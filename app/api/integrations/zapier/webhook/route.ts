import { createHmac } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/encryption'

/**
 * Recebe webhook Zapier (Catch Hook).
 * Configurar no Zapier: URL = /api/integrations/zapier/webhook?orgId=...
 * Assinar com HMAC-SHA256 usando o campo webhookSecret da org.
 * Header esperado: x-hook-signature: <hex digest>
 */
export async function POST(req: NextRequest) {
  const orgId = req.nextUrl.searchParams.get('orgId')
  if (!orgId) return NextResponse.json({ error: 'orgId obrigatório' }, { status: 400 })

  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { zapierEnabled: true, webhookSecret: true },
  })
  if (!org?.zapierEnabled) {
    return NextResponse.json({ error: 'Integração desativada' }, { status: 403 })
  }

  const rawBody = await req.text()

  // Validate HMAC-SHA256 signature when secret is configured
  if (org.webhookSecret) {
    const secret = decrypt(org.webhookSecret)
    const sig = req.headers.get('x-hook-signature') ?? ''
    const expected = createHmac('sha256', secret).update(rawBody).digest('hex')
    if (sig !== expected) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
  }

  const payload = JSON.parse(rawBody || '{}') as Record<string, unknown>

  try {
    await prisma.integrationLog.create({
      data: {
        organizationId: orgId,
        type: 'ZAPIER',
        action: 'webhook:received',
        status: 'SUCCESS',
        request: payload as never,
        response: { ok: true } as never,
      },
    })
  } catch {
    // best-effort log
  }

  return NextResponse.json({ ok: true })
}
