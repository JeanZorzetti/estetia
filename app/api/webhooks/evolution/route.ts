/**
 * Inbound webhook from Evolution API.
 * Auth: relies on Evolution API token/header config — clinics control their own instance.
 * Events: messages.upsert, qrcode.updated, connection.update
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { prismaWa } from '@/lib/prisma-wa'
import { ssePublish } from '@/lib/sse'
import { normalizePhoneNumber, findContactByPhone } from '@/lib/whatsapp-sync'
import { triggerAgentsForInboundMessage } from '@/lib/agaas-agent-trigger'
import logger from '@/lib/logger'

export async function POST(req: NextRequest) {
  let payload: Record<string, unknown>
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const instanceName = (payload.instance as string) || (payload.instanceName as string)
  if (!instanceName) {
    return NextResponse.json({ error: 'instance missing' }, { status: 400 })
  }

  const org = await prisma.organization.findFirst({
    where: { evolutionInstance: instanceName, evolutionEnabled: true },
    select: { id: true },
  })

  if (!org) {
    // Silently accept to avoid leaking which instances exist
    return NextResponse.json({ ok: true, ignored: true })
  }

  const event = String(payload.event ?? '')

  await prisma.integrationLog.create({
    data: {
      organizationId: org.id,
      type: 'WHATSAPP_EVOLUTION',
      action: event,
      status: 'SUCCESS',
      request: payload as never,
    },
  }).catch(() => {})

  try {
    if (event === 'messages.upsert') {
      await handleMessagesUpsert(org.id, instanceName, payload)
    } else if (event === 'connection.update') {
      await handleConnectionUpdate(org.id, payload)
    }
  } catch (err: any) {
    logger.error({ err: err.message, event, instanceName }, 'evolution webhook: processing error')
  }

  return NextResponse.json({ ok: true })
}

async function handleMessagesUpsert(organizationId: string, instanceName: string, payload: any) {
  // Evolution sends messages array under data.messages or data
  const messages: any[] = payload.data?.messages ?? (Array.isArray(payload.data) ? payload.data : [])
  if (!messages.length) return

  // Find the WhatsAppConnection record for this Evolution instance
  const connection = await prismaWa.whatsAppConnection.findFirst({
    where: { instanceName },
  })
  // Evolution BYO uses org-level config — no WhatsAppConnection record needed for message storage
  // but we use connection.id if available for scoping
  const connectionId = connection?.id ?? null

  for (const msg of messages) {
    try {
      await processEvolutionMessage(organizationId, connectionId, msg)
    } catch (err: any) {
      logger.warn({ err: err.message, messageId: msg?.key?.id }, 'evolution: skipped message')
    }
  }
}

async function processEvolutionMessage(
  organizationId: string,
  connectionId: string | null,
  msg: any
) {
  // Evolution message structure: { key: { id, remoteJid, fromMe }, pushName, message: {...}, messageTimestamp }
  const key = msg.key ?? {}
  const messageId: string = key.id
  const remoteJid: string = key.remoteJid ?? ''
  const fromMe: boolean = key.fromMe === true
  const pushName: string = msg.pushName ?? ''
  const timestamp: number = msg.messageTimestamp ?? Math.floor(Date.now() / 1000)

  if (!remoteJid) return

  // Skip broadcast/status/newsletter
  if (remoteJid.includes('status@') || remoteJid.includes('@broadcast') || remoteJid.includes('@newsletter')) return

  const isGroup = remoteJid.includes('@g.us')

  // Skip invalid JIDs for non-groups
  if (!isGroup) {
    const rawPhone = remoteJid.replace('@s.whatsapp.net', '').replace('@c.us', '')
    if (rawPhone.length > 15) return
  }

  // Extract text content and media type from Evolution message structure
  let text = ''
  let mediaType: string | null = null

  const msgContent = msg.message ?? {}
  if (msgContent.conversation) {
    text = msgContent.conversation
  } else if (msgContent.extendedTextMessage?.text) {
    text = msgContent.extendedTextMessage.text
  } else if (msgContent.imageMessage) {
    text = msgContent.imageMessage.caption ?? '[Imagem]'
    mediaType = 'image'
  } else if (msgContent.videoMessage) {
    text = msgContent.videoMessage.caption ?? '[Vídeo]'
    mediaType = 'video'
  } else if (msgContent.audioMessage) {
    text = '[Áudio]'
    mediaType = 'audio'
  } else if (msgContent.documentMessage) {
    text = msgContent.documentMessage.fileName ?? '[Documento]'
    mediaType = 'document'
  } else if (msgContent.stickerMessage) {
    text = '[Figurinha]'
    mediaType = 'sticker'
  } else if (msgContent.locationMessage) {
    text = '[Localização]'
  } else if (msgContent.reactionMessage) {
    // Reactions are handled separately — skip as message
    return
  }

  if (!text && !mediaType) return

  // Dedup
  if (messageId) {
    const existing = await prismaWa.whatsAppMessage.findFirst({
      where: { messageId, organizationId },
      select: { id: true },
    })
    if (existing) return
  }

  const phone = isGroup
    ? remoteJid
    : normalizePhoneNumber(remoteJid.replace('@s.whatsapp.net', '').replace('@c.us', ''))

  // Find or create CRM contact
  let contact: any = isGroup
    ? await prisma.contact.findFirst({ where: { organizationId, phone: remoteJid } })
    : await findContactByPhone(organizationId, phone)

  if (!contact) {
    contact = await prisma.contact.create({
      data: { organizationId, name: pushName || phone, phone },
    })
  } else if (pushName && !isGroup) {
    const hasGenericName =
      !contact.name || contact.name === contact.phone || /^\d+$/.test(contact.name.replace(/\D/g, ''))
    if (hasGenericName) {
      await prisma.contact.update({ where: { id: contact.id }, data: { name: pushName } })
      contact.name = pushName
    }
  }

  const sentAt = new Date(timestamp * 1000)

  const savedMsg = await prismaWa.whatsAppMessage.create({
    data: {
      contactId: contact.id,
      organizationId,
      connectionId,
      remoteJid,
      messageId: messageId || `evo-${Date.now()}`,
      text: text || `[${mediaType}]`,
      direction: fromMe ? 'OUTBOUND' : 'INBOUND',
      status: fromMe ? 'SENT' : 'DELIVERED',
      mediaType,
      sentAt,
      isRead: fromMe,
    },
  })

  await prisma.contact.update({
    where: { id: contact.id },
    data: { updatedAt: new Date() },
  })

  ssePublish(organizationId, 'message:new', {
    contactId: contact.id,
    message: {
      id: savedMsg.id,
      text: savedMsg.text,
      direction: savedMsg.direction,
      status: savedMsg.status,
      sentAt: savedMsg.sentAt.toISOString(),
      mediaType: savedMsg.mediaType ?? null,
    },
    contactName: contact.name,
    contactPhone: contact.phone,
  })

  if (!fromMe && text) {
    triggerAgentsForInboundMessage({
      organizationId,
      contactId: contact.id,
      messageId: savedMsg.id,
      messageText: text,
      contactName: contact.name || '',
      contactPhone: contact.phone,
    }).catch(() => {})
  }
}

async function handleConnectionUpdate(organizationId: string, payload: any) {
  const data = payload.data ?? {}
  const state = data.state ?? data.status ?? ''
  const instanceName = String(payload.instance ?? '')

  const connection = await prismaWa.whatsAppConnection.findFirst({
    where: { instanceName },
  })
  if (!connection) return

  const statusMap: Record<string, string> = {
    open: 'CONNECTED',
    connecting: 'CONNECTING',
    close: 'DISCONNECTED',
    unknown: 'DISCONNECTED',
  }
  const newStatus = statusMap[state] ?? 'DISCONNECTED'

  await prismaWa.whatsAppConnection.update({
    where: { id: connection.id },
    data: { status: newStatus as any, ...(newStatus === 'CONNECTED' && { connectedAt: new Date() }) },
  })

  ssePublish(organizationId, 'connection:ready', {
    connectionId: connection.id,
    instanceName: connection.instanceName,
    ...(newStatus === 'DISCONNECTED' && { status: 'disconnected' }),
  })
}
