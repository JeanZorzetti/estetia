import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * Recebe webhook JotForm (form-encoded, não JSON).
 * Configurar no JotForm: Form Settings → Integrations → Webhooks → cole a URL.
 */
export async function POST(req: NextRequest) {
  const orgId = req.nextUrl.searchParams.get('orgId')
  if (!orgId) return NextResponse.json({ error: 'orgId obrigatório' }, { status: 400 })

  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { jotformEnabled: true },
  })
  if (!org?.jotformEnabled) {
    return NextResponse.json({ error: 'Integração desativada' }, { status: 403 })
  }

  let parsed: Record<string, string> = {}
  try {
    const formData = await req.formData()
    formData.forEach((v, k) => {
      if (typeof v === 'string') parsed[k] = v
    })
  } catch {
    try {
      parsed = (await req.json()) as Record<string, string>
    } catch {
      parsed = {}
    }
  }

  try {
    await prisma.integrationLog.create({
      data: {
        organizationId: orgId,
        type: 'JOTFORM',
        action: 'webhook:submission',
        status: 'SUCCESS',
        request: parsed as never,
      },
    })
  } catch {
    // best-effort
  }

  return NextResponse.json({ ok: true })
}
