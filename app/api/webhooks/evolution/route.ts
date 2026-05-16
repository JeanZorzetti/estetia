import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * Inbound webhook from Evolution API.
 * Auth: relies on Evolution API token/header config — clinics control their own instance.
 * Events: messages.upsert, qrcode.updated, connection.update
 */
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

  await prisma.integrationLog.create({
    data: {
      organizationId: org.id,
      type: 'WHATSAPP_EVOLUTION',
      action: String(payload.event ?? 'event'),
      status: 'SUCCESS',
      request: payload as never,
    },
  }).catch(() => {})

  // TODO: route messages.upsert to chat center service
  return NextResponse.json({ ok: true })
}
