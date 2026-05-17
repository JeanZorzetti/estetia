import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const CreateSessionSchema = z.object({
  treatmentId: z.string().uuid(),
  dataAgendada: z.string().datetime(),
  profissionalId: z.string().uuid().optional(),
  salaId: z.string().uuid().optional(),
  duracaoMinutos: z.number().int().min(10).max(480).optional(),
  observacoes: z.string().max(1000).optional(),
})

// GET /api/clinica/sessions?from=ISO&to=ISO&profissionalId=&salaId=
export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true, orgRole: true, id: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'No org' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const from = searchParams.get('from') ? new Date(searchParams.get('from')!) : new Date()
  const to = searchParams.get('to')
    ? new Date(searchParams.get('to')!)
    : new Date(from.getTime() + 7 * 24 * 60 * 60 * 1000)
  const profissionalId = searchParams.get('profissionalId') ?? undefined
  const salaId = searchParams.get('salaId') ?? undefined

  const sessions = await prisma.treatmentSession.findMany({
    where: {
      organizationId: user.organizationId,
      dataAgendada: { gte: from, lte: to },
      ...(profissionalId && { profissionalId }),
      ...(salaId && { salaId }),
      status: { notIn: ['CANCELADA'] },
    },
    include: {
      treatment: {
        include: {
          paciente: { select: { id: true, nome: true, telefone: true, fotoPerfil: true } },
        },
      },
      profissional: { select: { id: true, nome: true } },
      sala: { select: { id: true, nome: true, tipo: true } },
    },
    orderBy: { dataAgendada: 'asc' },
  })

  return NextResponse.json({ sessions })
}

// POST /api/clinica/sessions
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'No org' }, { status: 403 })

  const body = await req.json()
  const parsed = CreateSessionSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { treatmentId, dataAgendada, profissionalId, salaId, duracaoMinutos, observacoes } = parsed.data

  // Verify treatment belongs to org
  const treatment = await prisma.treatment.findFirst({
    where: { id: treatmentId, organizationId: user.organizationId },
    select: { id: true, pacienteId: true, status: true },
  })
  if (!treatment) return NextResponse.json({ error: 'Treatment not found' }, { status: 404 })

  const newSession = await prisma.treatmentSession.create({
    data: {
      organizationId: user.organizationId,
      treatmentId,
      dataAgendada: new Date(dataAgendada),
      profissionalId,
      salaId,
      duracaoMinutos,
      observacoes,
      status: 'AGENDADA',
    },
    include: {
      treatment: {
        include: {
          paciente: { select: { id: true, nome: true, telefone: true } },
          procedure: { select: { id: true, nome: true } },
        },
      },
      profissional: { select: { id: true, nome: true } },
      sala: { select: { id: true, nome: true } },
    },
  })

  // Update treatment status to AGENDADO if still in AVALIACAO/ORCAMENTO_ENVIADO
  if (['AVALIACAO', 'ORCAMENTO_ENVIADO'].includes(treatment.status)) {
    await prisma.treatment.updateMany({
      where: { id: treatmentId, organizationId: user.organizationId },
      data: { status: 'AGENDADO' },
    })
  }

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
        text: `Novo agendamento — ${newSession.treatment.paciente.nome}`,
        blocks: buildAppointmentBlocks({
          patient: newSession.treatment.paciente.nome,
          professional: newSession.profissional?.nome ?? '—',
          procedure: newSession.treatment.procedure?.nome ?? '—',
          date: new Date(newSession.dataAgendada).toLocaleDateString('pt-BR'),
          time: new Date(newSession.dataAgendada).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        }),
      })
    } catch { /* best-effort */ }
  }

  if (org?.teamsEnabled && org.teamsWebhookUrl) {
    try {
      const { sendTeamsCard, buildAppointmentCard } = await import('@/lib/integrations/teams-client')
      await sendTeamsCard(org.teamsWebhookUrl, buildAppointmentCard({
        patient: newSession.treatment.paciente.nome,
        professional: newSession.profissional?.nome ?? '—',
        procedure: newSession.treatment.procedure?.nome ?? '—',
        date: new Date(newSession.dataAgendada).toLocaleDateString('pt-BR'),
        time: new Date(newSession.dataAgendada).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      }))
    } catch { /* best-effort */ }
  }

  return NextResponse.json({ session: newSession }, { status: 201 })
}
