import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AgendaClient } from '@/components/agenda/agenda-client'
import { AgendaClinica, type AgendaSession } from '@/components/clinica/agenda-clinica'
import { getTranslations } from 'next-intl/server'

export const metadata = { title: 'Agenda - CRM' }
export const dynamic = 'force-dynamic'

export default async function AgendaPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'dashboard' })
  const session = await getSession()
  if (!session?.user?.email) return <div>{t('errors.unauthorized')}</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, organizationId: true, orgRole: true },
  })
  if (!user?.organizationId) return <div>{t('errors.userNoOrg')}</div>

  const isMember = user.orgRole === 'MEMBER'

  const org = await prisma.organization.findUnique({
    where: { id: user.organizationId },
    select: { googleCalendarEnabled: true, googleCalendarEmail: true, segment: true },
  })

  // ── Estética mode: show clinical agenda instead of legacy deal agenda ──
  const isEstetica = process.env.NICHE_MODE === 'ESTETICA' || org?.segment === 'ESTETICA'

  if (isEstetica) {
    const now = new Date()
    const from = new Date(now)
    from.setDate(now.getDate() - 7) // show past week too
    const to = new Date(now)
    to.setDate(now.getDate() + 30)

    const [treatmentSessions, professionals] = await Promise.all([
      prisma.treatmentSession.findMany({
        where: {
          organizationId: user.organizationId,
          dataAgendada: { gte: from, lte: to },
          status: { not: 'CANCELADA' },
        },
        include: {
          profissional: { select: { id: true, nome: true } },
          treatment: {
            include: {
              paciente: { select: { nome: true, telefone: true } },
              profissionalResponsavel: { select: { id: true, nome: true } },
            },
          },
        },
        orderBy: { dataAgendada: 'asc' },
      }),
      prisma.professional.findMany({
        where: { organizationId: user.organizationId },
        select: { id: true, nome: true },
        orderBy: { nome: 'asc' },
      }),
    ])

    const agendaSessions: AgendaSession[] = treatmentSessions.map(s => ({
      id: s.id,
      dataAgendada: s.dataAgendada.toISOString(),
      duracaoMinutos: s.duracaoMinutos ?? 60,
      status: s.status as AgendaSession['status'],
      noShowScore: s.noShowScore,
      profissionalId: s.profissional?.id ?? s.treatment.profissionalResponsavel?.id ?? '',
      profissionalNome: s.profissional?.nome ?? s.treatment.profissionalResponsavel?.nome ?? 'Profissional',
      pacienteNome: s.treatment.paciente.nome,
      pacienteTelefone: s.treatment.paciente.telefone ?? '',
      procedimentoNome: s.treatment.descricaoCustomizada ?? s.treatment.tipoTratamento,
    }))

    const today = new Date().toISOString().split('T')[0]

    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col gap-4 p-4 md:p-6">
        <div>
          <h1 className="text-xl font-semibold">Agenda da Clínica</h1>
          <p className="text-sm text-muted-foreground">
            {agendaSessions.filter(s => s.dataAgendada.split('T')[0] === today).length} sessões hoje
          </p>
        </div>
        <AgendaClinica
          sessions={agendaSessions}
          professionals={professionals}
          currentDate={today}
        />
      </div>
    )
  }

  const [deals, stages, contacts, tasks] = await Promise.all([
    prisma.deal.findMany({
      where: {
        organizationId: user.organizationId,
        archived: false,
        status: 'ACTIVE' as const,
        dueDate: { not: null },
        ...(isMember ? { userId: user.id } : {}),
      },
      select: {
        id: true,
        title: true,
        value: true,
        dueDate: true,
        stageId: true,
        contactId: true,
        stage: { select: { id: true, name: true } },
        pipeline: { select: { id: true, name: true } },
        contact: { select: { id: true, name: true, phone: true } },
      },
      orderBy: { dueDate: 'asc' },
    }),
    prisma.pipelineStage.findMany({
      where: { pipeline: { organizationId: user.organizationId } },
      select: { id: true, name: true },
    }),
    prisma.contact.findMany({
      where: { organizationId: user.organizationId },
      select: { id: true, name: true, phone: true },
      orderBy: { name: 'asc' },
    }),
    prisma.task.findMany({
      where: {
        organizationId: user.organizationId,
        archived: false,
        completedAt: null,
        dueDate: { not: null },
        ...(isMember ? { assigneeId: user.id } : {}),
      },
      select: {
        id: true,
        title: true,
        dueDate: true,
        priority: true,
        status: { select: { id: true, name: true, color: true } },
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } },
      },
      orderBy: { dueDate: 'asc' },
    }),
  ])

  const serializedDeals = deals.map(d => ({
    ...d,
    value: d.value ? Number(d.value) : null,
    dueDate: d.dueDate!.toISOString(),
  }))

  const serializedTasks = tasks.map(t => ({
    ...t,
    dueDate: t.dueDate!.toISOString(),
  }))

  return (
    <AgendaClient
      deals={serializedDeals}
      stages={stages}
      contacts={contacts}
      tasks={serializedTasks}
      googleCalendarEnabled={org?.googleCalendarEnabled ?? false}
      googleCalendarEmail={org?.googleCalendarEmail ?? null}
    />
  )
}
