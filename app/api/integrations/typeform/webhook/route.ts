import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * Recebe webhook Typeform.
 * Configurar no Typeform: URL = /api/integrations/typeform/webhook?orgId=...
 */
export async function POST(req: NextRequest) {
  const orgId = req.nextUrl.searchParams.get('orgId')
  if (!orgId) return NextResponse.json({ error: 'orgId obrigatório' }, { status: 400 })

  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { typeformEnabled: true },
  })
  if (!org?.typeformEnabled) {
    return NextResponse.json({ error: 'Integração desativada' }, { status: 403 })
  }

  const payload = (await req.json().catch(() => ({}))) as {
    event_id?: string
    form_response?: {
      form_id?: string
      submitted_at?: string
      answers?: Array<{
        field?: { ref?: string; type?: string }
        type?: string
        email?: string
        phone_number?: string
        text?: string
      }>
    }
  }

  const answers = payload.form_response?.answers ?? []
  const emailAnswer = answers.find((a) => a.type === 'email')?.email
  const phoneAnswer = answers.find((a) => a.type === 'phone_number')?.phone_number
  const nameAnswer = answers.find((a) => a.type === 'text')?.text

  try {
    await prisma.integrationLog.create({
      data: {
        organizationId: orgId,
        type: 'TYPEFORM',
        action: 'webhook:response',
        status: 'SUCCESS',
        request: payload as never,
        response: {
          extracted: { email: emailAnswer, phone: phoneAnswer, name: nameAnswer },
        } as never,
      },
    })
  } catch {
    // log creation is best-effort
  }

  return NextResponse.json({ ok: true })
}
