import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PatientReferralCreateSchema } from '@/lib/patient-referrals/schema'

async function getOrgId() {
  const session = await getSession()
  if (!session?.user?.email) return null
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  return user?.organizationId ?? null
}

export async function GET(req: Request) {
  const orgId = await getOrgId()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const indicadorId = searchParams.get('indicadorId')

  const where: Record<string, unknown> = { organizationId: orgId }
  if (status) where.status = status
  if (indicadorId) where.indicadorId = indicadorId

  const referrals = await prisma.patientReferral.findMany({
    where,
    include: {
      indicador: { select: { id: true, nome: true, telefone: true } },
      indicado: { select: { id: true, nome: true, telefone: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  const serialized = referrals.map(r => ({
    ...r,
    recompensaValor: r.recompensaValor != null ? Number(r.recompensaValor) : null,
  }))
  return NextResponse.json({ referrals: serialized })
}

export async function POST(req: Request) {
  const orgId = await getOrgId()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = PatientReferralCreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const indicador = await prisma.patient.findFirst({
    where: { id: parsed.data.indicadorId, organizationId: orgId },
    select: { id: true },
  })
  if (!indicador) return NextResponse.json({ error: 'Indicador not found' }, { status: 404 })

  const referral = await prisma.patientReferral.create({
    data: {
      organizationId: orgId,
      indicadorId: parsed.data.indicadorId,
      indicadoId: parsed.data.indicadoId || null,
      nomeIndicado: parsed.data.nomeIndicado || null,
      telefoneIndicado: parsed.data.telefoneIndicado || null,
      recompensaTipo: parsed.data.recompensaTipo || null,
      recompensaValor: parsed.data.recompensaValor ?? null,
      observacoes: parsed.data.observacoes || null,
    },
    include: {
      indicador: { select: { id: true, nome: true } },
      indicado: { select: { id: true, nome: true } },
    },
  })

  return NextResponse.json({
    referral: {
      ...referral,
      recompensaValor: referral.recompensaValor != null ? Number(referral.recompensaValor) : null,
    },
  }, { status: 201 })
}
