import logger from '@/lib/logger'
﻿import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { prismaWa } from "@/lib/prisma-wa"
import { fetchMessageCounts } from "@/lib/whatsapp-conversations"
import { requireModule } from "@/lib/guards/require-module"
import { ModuleLocked } from "@/components/upgrade/module-locked"
import { ChatInterface } from "@/components/chat/chat-interface"
import { EmptyState } from "@/components/ui/empty-state"
import { getTranslations } from "next-intl/server"

export const metadata = {
  title: "Chat Center - WhatsApp",
  description: "Central de atendimento WhatsApp"
}

export const dynamic = 'force-dynamic'

export default async function ChatPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ phone?: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'dashboard' })
  const { phone: initialPhone } = await searchParams
  const session = await getSession()

  if (!session?.user?.email) {
    return <div>{t('errors.unauthorized')}</div>
  }

  // Modular gating — WhatsApp Evolution must be active (or trial in effect)
  const gate = await requireModule('whatsapp_evolution')
  if (!gate.allowed) {
    return <ModuleLocked slug={gate.slug} />
  }

  let user
  try {
    user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        organizationId: true,
        organization: {
          select: {
            whatsappInstances: true,
          }
        }
      }
    })
  } catch (err: any) {
    logger.error({ message: err.message }, "[CHAT_PAGE] Falha ao buscar usuário:")
    return <div>{t('errors.fetchUser')}</div>
  }

  if (!user?.organizationId || !user.organization) {
    return <div>{t('errors.userNoOrg')}</div>
  }

  // Fetch WABA fields via raw SQL — these columns may not exist yet on older DBs
  // (migration 20260530000001_add_waba_fields adds them; raw SQL with COALESCE is safe either way)
  let wabaEnabled = false
  let wabaPhoneNumberId: string | null = null
  try {
    const rows = await prisma.$queryRaw<{ waba_enabled: boolean; waba_phone_number_id: string | null }[]>`
      SELECT
        COALESCE("wabaEnabled", false) AS waba_enabled,
        "wabaPhoneNumberId" AS waba_phone_number_id
      FROM "Organization"
      WHERE id = ${user.organizationId}
      LIMIT 1
    `
    if (rows[0]) {
      wabaEnabled = rows[0].waba_enabled === true
      wabaPhoneNumberId = rows[0].waba_phone_number_id ?? null
    }
  } catch {
    // Columns don't exist yet — default to false (WABA disabled)
  }

  let connections: any[] = []

  try {
    connections = await prismaWa.whatsAppConnection.findMany({
      where: { organizationId: user.organizationId },
      orderBy: { createdAt: 'desc' },
    })
  } catch (err: any) {
    logger.error({ message: err.message }, "[CHAT_PAGE] Falha ao buscar conexões:")
    return <div>{t('errors.fetchUser')}</div>
  }

  // Sync gateway status in the background — does NOT block page render.
  // The client polls connections every 10s anyway; SSE fires on status change.
  import('@/lib/integrations/whatsmeow-client').then(({ whatsmeowClient }) =>
    Promise.all(
      connections.map(async (conn: any) => {
        try {
          const gatewayStatus = await whatsmeowClient.getStatus(conn.instanceName)
          const newStatus = gatewayStatus?.connected === true ? 'CONNECTED' : 'DISCONNECTED'
          if (newStatus !== conn.status) {
            await prismaWa.whatsAppConnection.update({
              where: { id: conn.id },
              data: { status: newStatus },
            })
          }
        } catch {
          // Gateway unreachable — keep DB status
        }
      })
    )
  ).catch(() => {})

  // Filter only active connections — prevents mixing messages from old/disconnected instances
  const activeConnections = connections.filter((c: any) => c.status === 'CONNECTED')
  const connectionIds = activeConnections.map((c: any) => c.id)
  const wabaActive = wabaEnabled && !!wabaPhoneNumberId
  const hasEvolutionConnections = connectionIds.length > 0

  let contacts: any[] = []
  try {
    // No active Evolution connections and WABA not active — nothing to show
    if (!hasEvolutionConnections && !wabaActive) {
      contacts = []
    } else {
      // 1. Get org's contacts from CRM DB first (source of truth),
      // then intersect with WA DB to avoid cross-org orphaned messages
      const orgContacts = await prisma.contact.findMany({
        where: { organizationId: user.organizationId },
        select: { id: true },
      })
      const orgContactIds = orgContacts.map(c => c.id)

      let rows: { contact_id: string }[] = []
      if (orgContactIds.length > 0) {
        if (hasEvolutionConnections && wabaActive) {
          rows = await prismaWa.$queryRaw<{ contact_id: string }[]>`
            SELECT DISTINCT "contactId" AS contact_id
            FROM "WhatsAppMessage"
            WHERE "organizationId" = ${user.organizationId}
              AND "contactId" = ANY(${orgContactIds}::text[])
              AND ("connectionId" = ANY(${connectionIds}::text[]) OR "connectionId" IS NULL)
          `
        } else if (hasEvolutionConnections) {
          rows = await prismaWa.$queryRaw<{ contact_id: string }[]>`
            SELECT DISTINCT "contactId" AS contact_id
            FROM "WhatsAppMessage"
            WHERE "organizationId" = ${user.organizationId}
              AND "contactId" = ANY(${orgContactIds}::text[])
              AND "connectionId" = ANY(${connectionIds}::text[])
          `
        } else {
          // WABA only — intersect with org's contacts to avoid orphaned messages
          rows = await prismaWa.$queryRaw<{ contact_id: string }[]>`
            SELECT DISTINCT "contactId" AS contact_id
            FROM "WhatsAppMessage"
            WHERE "organizationId" = ${user.organizationId}
              AND "contactId" = ANY(${orgContactIds}::text[])
              AND "connectionId" IS NULL
          `
        }
      }

      const contactIds = rows.map(r => r.contact_id)

      if (contactIds.length > 0) {
        // 2. Fetch contacts from CRM DB
        const rawContacts = await prisma.contact.findMany({
          where: {
            id: { in: contactIds },
            organizationId: user.organizationId,
          },
          orderBy: { updatedAt: 'desc' },
        })

        // 3. Fetch last message per contact from WA DB
        const lastMsgWhere: any = {
          organizationId: user.organizationId,
          contactId: { in: contactIds },
        }
        if (hasEvolutionConnections && wabaActive) {
          lastMsgWhere.OR = [{ connectionId: { in: connectionIds } }, { connectionId: null }]
        } else if (hasEvolutionConnections) {
          lastMsgWhere.connectionId = { in: connectionIds }
        } else {
          lastMsgWhere.connectionId = null
        }

        const lastMessagesRaw = await prismaWa.whatsAppMessage.findMany({
          where: lastMsgWhere,
          orderBy: { sentAt: 'desc' },
        })

        const lastMessageMap = new Map<string, typeof lastMessagesRaw[0]>()
        for (const msg of lastMessagesRaw) {
          if (msg.contactId && !lastMessageMap.has(msg.contactId)) {
            lastMessageMap.set(msg.contactId, msg)
          }
        }

        // 4. Fetch unread and total counts via shared helper
        const { unreadMap, totalCountMap } = await fetchMessageCounts({
          organizationId: user.organizationId,
          contactIds,
          connectionIds,
          wabaActive,
        })

        // 5. Merge CRM contacts with WA data
        contacts = rawContacts.map(contact => {
          const lastMsg = lastMessageMap.get(contact.id)
          return {
            ...contact,
            whatsappMessages: lastMsg ? [lastMsg] : [],
            _count: {
              whatsappMessages: totalCountMap.get(contact.id) || 0,
              unreadMessages: unreadMap.get(contact.id) || 0,
            },
          }
        })

        // Sort by latest message time to match WhatsApp ordering
        contacts.sort((a: any, b: any) => {
          const aTime = a.whatsappMessages[0]?.sentAt?.getTime() ?? 0
          const bTime = b.whatsappMessages[0]?.sentAt?.getTime() ?? 0
          return bTime - aTime
        })
      }
    }
  } catch (err: any) {
    logger.error({ message: err.message }, "[CHAT_PAGE] Falha ao buscar contatos:")
    return <div>{t('errors.fetchUser')}</div>
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100svh-var(--app-bar-height)-3.5rem-env(safe-area-inset-bottom))] lg:h-[calc(100vh-4rem)]">
      <ChatInterface
        connections={connections}
        contacts={contacts}
        userId={user.id}
        userName={user.name || 'Usuário'}
        organizationId={user.organizationId}
        maxInstances={user.organization.whatsappInstances || 1}
        initialPhone={initialPhone}
        wabaEnabled={wabaActive}
      />
    </div>
  )
}
