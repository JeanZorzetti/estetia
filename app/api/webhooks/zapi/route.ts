import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * Inbound webhook from Z-API.
 * Z-API includes instanceId in payload.
 */
export async function POST(req: NextRequest) {
  let payload: Record<string, unknown>
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const instanceId = (payload.instanceId as string) || (payload.instance as string)
  if (!instanceId) {
    return NextResponse.json({ error: 'instanceId missing' }, { status: 400 })
  }

  const org = await prisma.organization.findFirst({
    where: { zapiInstanceId: instanceId, zapiEnabled: true },
    select: { id: true },
  })

  if (!org) {
    return NextResponse.json({ ok: true, ignored: true })
  }

  await prisma.integrationLog.create({
    data: {
      organizationId: org.id,
      type: 'WHATSAPP_ZAPI',
      action: String(payload.type ?? payload.event ?? 'event'),
      status: 'SUCCESS',
      request: payload as never,
    },
  }).catch(() => {})

  return NextResponse.json({ ok: true })
}
