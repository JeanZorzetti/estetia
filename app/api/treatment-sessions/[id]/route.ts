import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { SessionUpdateSchema } from '@/lib/agenda/schema'
import { detectConflicts } from '@/lib/agenda/conflicts'

async function getUser() {
  const session = await getSession()
  if (!session?.user?.email) return null
  return prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true, orgRole: true },
  })
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser()
  if (!user?.organizationId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const session = await prisma.treatmentSession.findFirst({
    where: { id, organizationId: user.organizationId },
    include: {
      profissional: { select: { id: true, nome: true } },
      sala: { select: { id: true, nome: true, cor: true } },
      treatment: {
        include: {
          paciente: { select: { id: true, nome: true, telefone: true, email: true } },
          procedure: { select: { id: true, nome: true, categoria: true, duracaoMinutos: true } },
        },
      },
    },
  })
  if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ session })
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser()
  if (!user?.organizationId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const existing = await prisma.treatmentSession.findFirst({
    where: { id, organizationId: user.organizationId },
    select: { id: true, dataAgendada: true, duracaoMinutos: true, profissionalId: true, salaId: true },
  })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const parsed = SessionUpdateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const d = parsed.data
  const data: Record<string, unknown> = {}
  if (d.dataAgendada !== undefined) data.dataAgendada = new Date(d.dataAgendada)
  if (d.duracaoMinutos !== undefined) data.duracaoMinutos = d.duracaoMinutos
  if (d.status !== undefined) data.status = d.status
  if (d.profissionalId !== undefined) data.profissionalId = d.profissionalId
  if (d.salaId !== undefined) data.salaId = d.salaId
  if (d.observacoes !== undefined) data.observacoes = d.observacoes || null
  if (d.procedureId !== undefined) data.treatment = { update: { procedureId: d.procedureId || null } }

  // Re-check conflicts when datetime/professional/sala changes
  if (d.dataAgendada || d.profissionalId !== undefined || d.salaId !== undefined || d.duracaoMinutos !== undefined) {
    const newDt = d.dataAgendada ? new Date(d.dataAgendada) : existing.dataAgendada
    const newDur = d.duracaoMinutos ?? existing.duracaoMinutos ?? 60
    const newProf = d.profissionalId !== undefined ? d.profissionalId : existing.profissionalId
    const newSala = d.salaId !== undefined ? d.salaId : existing.salaId

    const conflicts = await detectConflicts({
      organizationId: user.organizationId,
      dataAgendada: newDt,
      duracaoMinutos: newDur,
      profissionalId: newProf,
      salaId: newSala,
      ignoreSessionId: id,
    })
    if (conflicts.length > 0) {
      return NextResponse.json({ error: 'Conflitos detectados', conflicts }, { status: 409 })
    }
  }

  if (Object.keys(data).some(k => ['dataAgendada', 'duracaoMinutos', 'profissionalId', 'salaId'].includes(k))) {
    data.googleSyncStatus = 'PENDING'
  }

  const rawSession = await prisma.treatmentSession.update({
    where: { id },
    data,
    include: {
      profissional: { select: { id: true, nome: true } },
      sala: { select: { id: true, nome: true, cor: true } },
      treatment: {
        select: {
          id: true,
          valorTotal: true,
          sessoesPrevistas: true,
          sessoesRealizadas: true,
          paciente: { select: { id: true, nome: true, telefone: true, email: true } },
          procedure: { select: { id: true, nome: true, categoria: true, valorPadrao: true, duracaoMinutos: true } },
        },
      },
    },
  })

  const session = {
    ...rawSession,
    treatment: {
      ...rawSession.treatment,
      valorTotal: rawSession.treatment.valorTotal !== null ? Number(rawSession.treatment.valorTotal) : null,
      procedure: rawSession.treatment.procedure ? {
        ...rawSession.treatment.procedure,
        valorPadrao: rawSession.treatment.procedure.valorPadrao !== null ? Number(rawSession.treatment.procedure.valorPadrao) : null,
      } : null,
    },
  }

  return NextResponse.json({ session })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser()
  if (!user?.organizationId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const existing = await prisma.treatmentSession.findFirst({
    where: { id, organizationId: user.organizationId },
    select: { id: true },
  })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.treatmentSession.update({
    where: { id },
    data: { status: 'CANCELADA', googleSyncStatus: 'PENDING' },
  })
  return NextResponse.json({ ok: true })
}
