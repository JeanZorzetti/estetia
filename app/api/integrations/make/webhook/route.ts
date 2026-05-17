import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/encryption'

/**
 * Recebe webhook Make (Webhooks > Custom webhook).
 * Configurar no Make: URL = /api/integrations/make/webhook?orgId=...
 * Make envia um token Bearer fixo em x-make-secret.
 * O token armazenado é o campo webhookSecret da org (compartilhado com webhook genérico).
 */
export async function POST(req: NextRequest) {
  const orgId = req.nextUrl.searchParams.get('orgId')
  if (!orgId) return NextResponse.json({ error: 'orgId obrigatório' }, { status: 400 })

  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { makeEnabled: true, webhookSecret: true },
  })
  if (!org?.makeEnabled) {
    return NextResponse.json({ error: 'Integração desativada' }, { status: 403 })
  }

  // Token validation (Bearer — valor fixo, não HMAC)
  if (org.webhookSecret) {
    const secret = decrypt(org.webhookSecret)
    const token = req.headers.get('x-make-secret') ?? ''
    if (token !== secret) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
  }

  const payload = (await req.json().catch(() => ({}))) as Record<string, unknown>

  try {
    await prisma.integrationLog.create({
      data: {
        organizationId: orgId,
        type: 'MAKE',
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
