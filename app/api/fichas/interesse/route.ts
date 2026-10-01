import { NextRequest, NextResponse } from 'next/server'
import { leadCaptureRateLimit } from '@/lib/ratelimit'
import { sendLeadToRoihub } from '@/lib/roihub-crm'
import { getFicha } from '@/config/fichas-anamnese'

// Interest in the digital, signed version of a form. The e-mail is kept for one purpose only
// (telling the person when it opens), so consent is required and nothing else is collected.
export async function POST(request: NextRequest) {
  const blocked = await leadCaptureRateLimit(request)
  if (blocked) return blocked

  const body = await request.json().catch(() => null)
  const ficha = getFicha(String(body?.slug ?? ''))
  const email = String(body?.email ?? '').trim().toLowerCase()

  if (!ficha) return NextResponse.json({ error: 'Ficha não encontrada.' }, { status: 404 })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Confira o e-mail.' }, { status: 400 })
  }
  if (body?.consentimento !== true) {
    return NextResponse.json({ error: 'Marque a caixa para receber o aviso.' }, { status: 400 })
  }

  sendLeadToRoihub({
    nome: email,
    email,
    origem: 'estetiacrm:ficha-digital',
    metadata: { ficha: ficha.slug, consentimento: 'aviso-versao-digital', consentidoEm: new Date().toISOString() },
  })

  return NextResponse.json({ ok: true })
}
