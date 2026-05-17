import { createHmac } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/encryption'

/**
 * Recebe eventos de rastreamento de chamadas do CallGear.
 * Configurar no CallGear: URL = /api/integrations/callgear/webhook?orgId=...
 * Header esperado: X-CallGear-Signature: <hex digest HMAC-SHA256 do body com callgearApiKey>
 *
 * Nota: IntegrationType não possui enum CALLGEAR — usa PABX (telefonia/rastreamento).
 */
export async function POST(req: NextRequest) {
  const orgId = req.nextUrl.searchParams.get('orgId')
  if (!orgId) return NextResponse.json({ error: 'orgId obrigatório' }, { status: 400 })

  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { callgearEnabled: true, callgearApiKey: true },
  })
  if (!org?.callgearEnabled) {
    return NextResponse.json({ error: 'Integração desativada' }, { status: 403 })
  }

  const rawBody = await req.text()

  // Validate HMAC-SHA256 signature
  if (org.callgearApiKey) {
    const secret = decrypt(org.callgearApiKey)
    const sig = req.headers.get('X-CallGear-Signature') ?? ''
    const expected = createHmac('sha256', secret).update(rawBody).digest('hex')
    if (sig !== expected) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
  }

  const payload = JSON.parse(rawBody || '{}') as {
    event?: string
    call_id?: string
    [k: string]: unknown
  }

  try {
    await prisma.integrationLog.create({
      data: {
        organizationId: orgId,
        type: 'PABX',
        action: `webhook:${payload.event ?? 'event'}`,
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
