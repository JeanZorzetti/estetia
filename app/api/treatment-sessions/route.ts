import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { SessionCreateSchema } from '@/lib/agenda/schema'
import { detectConflicts } from '@/lib/agenda/conflicts'

export const dynamic = 'force-dynamic'

async function getUser() {
  const session = await getSession()
  if (!session?.user?.email) return null
  return prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true, orgRole: true },
  })
}

export async function GET(req: Request) {
  const user = await getUser()
  if (!user?.organizationId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const profissionalId = searchParams.get('profissionalId')
  const salaId = searchParams.get('salaId')
  const status = searchParams.getAll('status')

  const where: Record<string, unknown> = { organizationId: user.organizationId }
  if (from || to) {
    where.dataAgendada = {
      ...(from ? { gte: new Date(from) } : {}),
      ...(to ? { lte: new Date(to) } : {}),
    }
  }
  if (profissionalId) where.profissionalId = profissionalId
  if (salaId) where.salaId = salaId
  if (status.length > 0) where.status = { in: status }

  const sessions = await prisma.treatmentSession.findMany({
    where,
    include: {
      profissional: { select: { id: true, nome: true } },
      sala: { select: { id: true, nome: true, cor: true } },
      treatment: {
        include: {
          paciente: { select: { id: true, nome: true, telefone: true } },
          procedure: { select: { id: true, nome: true, categoria: true } },
        },
      },
    },
    orderBy: { dataAgendada: 'asc' },
    take: 500,
  })

  return NextResponse.json({ sessions })
}

export async function POST(req: Request) {
  const user = await getUser()
  if (!user?.organizationId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = SessionCreateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const d = parsed.data
  const dataAgendada = new Date(d.dataAgendada)

  // Verify patient
  const paciente = await prisma.patient.findFirst({
    where: { id: d.pacienteId, organizationId: user.organizationId },
    select: { id: true },
  })
  if (!paciente) return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })

  // Resolve or create lightweight treatment
  let treatmentId = d.treatmentId
  if (!treatmentId) {
    const existing = await prisma.treatment.findFirst({
      where: {
        organizationId: user.organizationId,
        pacienteId: d.pacienteId,
        ...(d.procedureId ? { procedureId: d.procedureId } : {}),
        status: { in: ['AVALIACAO', 'ORCAMENTO_ENVIADO', 'AGENDADO', 'EM_ANDAMENTO'] },
      },
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    })
    if (existing) {
      treatmentId = existing.id
    } else {
      const created = await prisma.treatment.create({
        data: {
          organizationId: user.organizationId,
          pacienteId: d.pacienteId,
          procedureId: d.procedureId ?? null,
          profissionalResponsavelId: d.profissionalId ?? null,
          tipoTratamento: 'OUTROS',
          status: 'AGENDADO',
          sessoesPrevistas: 1,
        },
        select: { id: true },
      })
      treatmentId = created.id
    }
  }

  // Conflict check
  const conflicts = await detectConflicts({
    organizationId: user.organizationId,
    dataAgendada,
    duracaoMinutos: d.duracaoMinutos,
    profissionalId: d.profissionalId ?? undefined,
    salaId: d.salaId ?? undefined,
  })

  if (conflicts.length > 0) {
    return NextResponse.json({ error: 'Conflitos detectados', conflicts }, { status: 409 })
  }

  const session = await prisma.treatmentSession.create({
    data: {
      organizationId: user.organizationId,
      treatmentId,
      dataAgendada,
      duracaoMinutos: d.duracaoMinutos,
      profissionalId: d.profissionalId ?? null,
      salaId: d.salaId ?? null,
      observacoes: d.observacoes || null,
      googleSyncStatus: 'PENDING',
    },
    include: {
      profissional: { select: { id: true, nome: true } },
      sala: { select: { id: true, nome: true, cor: true } },
      treatment: {
        include: {
          paciente: { select: { id: true, nome: true, telefone: true } },
          procedure: { select: { id: true, nome: true, categoria: true } },
        },
      },
    },
  })

  // ── Integrations: Slack / Teams (best-effort, never breaks the flow) ──
  const org = await prisma.organization.findUnique({
    where: { id: user.organizationId },
    select: {
      slackEnabled: true,
      slackWebhookUrl: true,
      teamsEnabled: true,
      teamsWebhookUrl: true,
    },
  })

  if (org?.slackEnabled && org.slackWebhookUrl) {
    try {
      const { sendSlackMessage, buildAppointmentBlocks } = await import('@/lib/integrations/slack-client')
      await sendSlackMessage(org.slackWebhookUrl, {
        text: `Novo agendamento — ${session.treatment.paciente.nome}`,
        blocks: buildAppointmentBlocks({
          patient: session.treatment.paciente.nome,
          professional: session.profissional?.nome ?? '—',
          procedure: session.treatment.procedure?.nome ?? '—',
          date: new Date(session.dataAgendada).toLocaleDateString('pt-BR'),
          time: new Date(session.dataAgendada).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        }),
      })
    } catch { /* best-effort */ }
  }

  if (org?.teamsEnabled && org.teamsWebhookUrl) {
    try {
      const { sendTeamsCard, buildAppointmentCard } = await import('@/lib/integrations/teams-client')
      await sendTeamsCard(org.teamsWebhookUrl, buildAppointmentCard({
        patient: session.treatment.paciente.nome,
        professional: session.profissional?.nome ?? '—',
        procedure: session.treatment.procedure?.nome ?? '—',
        date: new Date(session.dataAgendada).toLocaleDateString('pt-BR'),
        time: new Date(session.dataAgendada).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      }))
    } catch { /* best-effort */ }
  }

  return NextResponse.json({ session }, { status: 201 })
}
