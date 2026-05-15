import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { MoveSessionSchema } from '@/lib/agenda/schema'
import { detectConflicts } from '@/lib/agenda/conflicts'

async function getUser() {
  const session = await getSession()
  if (!session?.user?.email) return null
  return prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true, orgRole: true },
  })
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser()
  if (!user?.organizationId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const existing = await prisma.treatmentSession.findFirst({
    where: { id, organizationId: user.organizationId },
    select: {
      id: true, dataAgendada: true, duracaoMinutos: true,
      profissionalId: true, salaId: true, status: true,
    },
  })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (['CANCELADA', 'REALIZADA', 'NO_SHOW'].includes(existing.status)) {
    return NextResponse.json({ error: 'Não é possível mover sessão finalizada' }, { status: 409 })
  }

  const body = await req.json()
  const parsed = MoveSessionSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const novaData = new Date(parsed.data.novaData)
  const novaDuracao = parsed.data.novaDuracao ?? existing.duracaoMinutos ?? 60
  const novoProf = parsed.data.novoProfissionalId !== undefined ? parsed.data.novoProfissionalId : existing.profissionalId
  const novaSala = parsed.data.novaSalaId !== undefined ? parsed.data.novaSalaId : existing.salaId

  const conflicts = await detectConflicts({
    organizationId: user.organizationId,
    dataAgendada: novaData,
    duracaoMinutos: novaDuracao,
    profissionalId: novoProf,
    salaId: novaSala,
    ignoreSessionId: id,
  })
  if (conflicts.length > 0) {
    return NextResponse.json({ error: 'Conflitos detectados', conflicts }, { status: 409 })
  }

  const session = await prisma.treatmentSession.update({
    where: { id },
    data: {
      dataAgendada: novaData,
      duracaoMinutos: novaDuracao,
      profissionalId: novoProf,
      salaId: novaSala,
      status: existing.status === 'AGENDADA' ? 'AGENDADA' : existing.status,
      googleSyncStatus: 'PENDING',
    },
    include: {
      profissional: { select: { id: true, nome: true } },
      sala: { select: { id: true, nome: true, cor: true } },
      treatment: {
        include: {
          paciente: { select: { id: true, nome: true } },
          procedure: { select: { id: true, nome: true } },
        },
      },
    },
  })

  return NextResponse.json({ session })
}
