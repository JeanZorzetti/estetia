import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateHmac } from '@/lib/integrations/webhook-validator'

/**
 * Generic inbound webhook for Zapier/Make/n8n etc.
 * Auth: HMAC SHA256 via X-Estetia-Signature header.
 *
 * Payload shape:
 * {
 *   "event": "patient.create" | "appointment.schedule" | "payment.log",
 *   "data": { ... }
 * }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  const { orgId } = await params

  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { id: true, webhookEnabled: true, webhookSecret: true },
  })

  if (!org) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (!org.webhookEnabled || !org.webhookSecret) {
    return NextResponse.json({ error: 'Webhook disabled' }, { status: 503 })
  }

  const rawBody = await req.text()
  const signature = req.headers.get('x-estetia-signature')

  if (!validateHmac(rawBody, signature, org.webhookSecret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let payload: { event?: string; data?: Record<string, unknown> }
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!payload.event) {
    return NextResponse.json({ error: 'event field required' }, { status: 400 })
  }

  await prisma.integrationLog.create({
    data: {
      organizationId: org.id,
      type: 'WEBHOOK_GENERIC',
      action: payload.event,
      status: 'SUCCESS',
      request: payload as never,
    },
  }).catch(() => {})

  // TODO: dispatch to event handlers (patient.create, appointment.schedule, payment.log)
  return NextResponse.json({ ok: true, event: payload.event })
}
