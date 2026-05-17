import { createHmac } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/encryption'

/**
 * Recebe eventos de webhook RingCentral.
 * Configurar no RingCentral: URL = /api/integrations/ringcentral/webhook?orgId=...
 *
 * GET: RingCentral valida o endpoint enviando Validation-Token — deve ser ecoado no response.
 * POST: Eventos assinados com X-Glip-Signature (HMAC-SHA512 do body usando ringcentralClientSecret).
 *
 * Nota: IntegrationType não possui enum RINGCENTRAL — usa PABX (telefonia/voz).
 */

// GET: endpoint validation (RingCentral subscription creation)
export async function GET(req: NextRequest) {
  const validationToken = req.headers.get('Validation-Token')
  if (validationToken) {
    return new NextResponse(null, {
      status: 200,
      headers: { 'Validation-Token': validationToken },
    })
  }
  return NextResponse.json({ ok: true })
}

export async function POST(req: NextRequest) {
  const orgId = req.nextUrl.searchParams.get('orgId')
  if (!orgId) return NextResponse.json({ error: 'orgId obrigatório' }, { status: 400 })

  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { ringcentralEnabled: true, ringcentralClientSecret: true },
  })
  if (!org?.ringcentralEnabled) {
    return NextResponse.json({ error: 'Integração desativada' }, { status: 403 })
  }

  const rawBody = await req.text()

  // Validate HMAC-SHA512 signature
  if (org.ringcentralClientSecret) {
    const secret = decrypt(org.ringcentralClientSecret)
    const sig = req.headers.get('X-Glip-Signature') ?? ''
    const expected = createHmac('sha512', secret).update(rawBody).digest('hex')
    if (sig !== expected) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
  }

  const payload = JSON.parse(rawBody || '{}') as Record<string, unknown>

  try {
    await prisma.integrationLog.create({
      data: {
        organizationId: orgId,
        type: 'PABX',
        action: 'webhook:call-event',
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
