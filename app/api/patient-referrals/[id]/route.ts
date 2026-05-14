import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PatientReferralUpdateSchema } from '@/lib/patient-referrals/schema'

async function getOrgId() {
  const session = await getSession()
  if (!session?.user?.email) return null
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  return user?.organizationId ?? null
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const orgId = await getOrgId()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const referral = await prisma.patientReferral.findFirst({
    where: { id, organizationId: orgId },
    include: {
      indicador: { select: { id: true, nome: true, telefone: true } },
      indicado: { select: { id: true, nome: true, telefone: true } },
    },
  })
  if (!referral) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({
    referral: {
      ...referral,
      recompensaValor: referral.recompensaValor != null ? Number(referral.recompensaValor) : null,
    },
  })
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const orgId = await getOrgId()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const existing = await prisma.patientReferral.findFirst({
    where: { id, organizationId: orgId },
    select: { id: true },
  })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const parsed = PatientReferralUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const data: Record<string, unknown> = {}
  if (parsed.data.status !== undefined) data.status = parsed.data.status
  if (parsed.data.indicadoId !== undefined) data.indicadoId = parsed.data.indicadoId || null
  if (parsed.data.recompensaTipo !== undefined) data.recompensaTipo = parsed.data.recompensaTipo || null
  if (parsed.data.recompensaValor !== undefined) data.recompensaValor = parsed.data.recompensaValor
  if (parsed.data.recompensaConcedidaEm !== undefined) {
    data.recompensaConcedidaEm = parsed.data.recompensaConcedidaEm ? new Date(parsed.data.recompensaConcedidaEm) : null
  }
  if (parsed.data.observacoes !== undefined) data.observacoes = parsed.data.observacoes || null

  const referral = await prisma.patientReferral.update({
    where: { id },
    data,
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
  })
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const orgId = await getOrgId()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const existing = await prisma.patientReferral.findFirst({
    where: { id, organizationId: orgId },
    select: { id: true },
  })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.patientReferral.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
