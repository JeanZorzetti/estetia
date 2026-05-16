import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateHmac } from '@/lib/integrations/webhook-validator'
import {
  normalizePabxPayload,
  matchAndLogCall,
  type PabxProvider,
} from '@/lib/integrations/pabx-handler'

/**
 * Inbound PABX webhook. Normalizes vendor-specific payloads.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  const { orgId } = await params

  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: {
      id: true,
      pabxEnabled: true,
      pabxProvider: true,
      pabxWebhookSecret: true,
    },
  })

  if (!org) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (!org.pabxEnabled || !org.pabxWebhookSecret) {
    return NextResponse.json({ error: 'PABX webhook disabled' }, { status: 503 })
  }

  const rawBody = await req.text()
  const signature = req.headers.get('x-estetia-signature')

  if (!validateHmac(rawBody, signature, org.pabxWebhookSecret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let payload: unknown
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const provider = (org.pabxProvider ?? 'generic') as PabxProvider
  const event = normalizePabxPayload(provider, payload)

  if (!event) {
    return NextResponse.json({ error: 'Could not parse PABX payload' }, { status: 400 })
  }

  await matchAndLogCall(org.id, event)

  return NextResponse.json({ ok: true })
}
