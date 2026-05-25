import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { logMedicalAccess } from '@/lib/audit/medical-access-log'
import { PacienteHeader } from '@/components/pacientes/paciente-header'
import { PacienteTabs } from '@/components/pacientes/paciente-tabs'
import { Syringe, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function PacienteOverviewPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { id: pacienteId } = await params

  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, organizationId: true, orgRole: true },
  })
  if (!user?.organizationId) redirect('/login')

  const patient = await prisma.patient.findFirst({
    where: { id: pacienteId, organizationId: user.organizationId },
    include: {
      _count: {
        select: { treatments: true, anamneses: true, medicalRecords: true, consentLogs: true },
      },
    },
  })
  if (!patient) notFound()

  // Últimos tratamentos para visão geral
  const recentTreatments = await prisma.treatment.findMany({
    where: { pacienteId, organizationId: user.organizationId },
    select: {
      id: true,
      tipoTratamento: true,
      descricaoCustomizada: true,
      status: true,
      sessoesRealizadas: true,
      sessoesPrevistas: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  // Próxima sessão agendada
  const proximaSessao = await prisma.treatmentSession.findFirst({
    where: {
      organizationId: user.organizationId,
      treatment: { pacienteId },
      dataAgendada: { gte: new Date() },
      status: { in: ['AGENDADA', 'CONFIRMADA'] },
    },
    include: { profissional: { select: { nome: true } }, sala: { select: { nome: true } } },
    orderBy: { dataAgendada: 'asc' },
  })

  await logMedicalAccess({
    organizationId: user.organizationId,
    userId: user.id,
    pacienteId,
    recordType: 'Patient',
    recordId: pacienteId,
    action: 'VIEW',
    metadata: { page: 'overview' },
  })

  const serialize = <T,>(v: T): T => JSON.parse(JSON.stringify(v))

  const STATUS_LABELS: Record<string, string> = {
    AVALIACAO: 'Avaliação',
    ORCAMENTO_ENVIADO: 'Orçamento Enviado',
    AGENDADO: 'Agendado',
    EM_ANDAMENTO: 'Em Andamento',
    EM_TRATAMENTO: 'Em Tratamento',
    FINALIZADO: 'Finalizado',
    CONCLUIDO: 'Concluído',
    PAUSADO: 'Pausado',
    RETORNO: 'Retorno',
    CANCELADO: 'Cancelado',
  }

  const STATUS_COLORS: Record<string, string> = {
    AVALIACAO: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 px-2.5 py-0.5 rounded-full border text-[10px] tracking-wide leading-tight',
    ORCAMENTO_ENVIADO: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 px-2.5 py-0.5 rounded-full border text-[10px] tracking-wide leading-tight',
    AGENDADO: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 px-2.5 py-0.5 rounded-full border text-[10px] tracking-wide leading-tight',
    EM_ANDAMENTO: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 px-2.5 py-0.5 rounded-full border text-[10px] tracking-wide leading-tight',
    EM_TRATAMENTO: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-2.5 py-0.5 rounded-full border text-[10px] tracking-wide leading-tight',
    FINALIZADO: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-2.5 py-0.5 rounded-full border text-[10px] tracking-wide leading-tight',
    CONCLUIDO: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-2.5 py-0.5 rounded-full border text-[10px] tracking-wide leading-tight',
    PAUSADO: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 px-2.5 py-0.5 rounded-full border text-[10px] tracking-wide leading-tight',
    RETORNO: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20 px-2.5 py-0.5 rounded-full border text-[10px] tracking-wide leading-tight',
    CANCELADO: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 px-2.5 py-0.5 rounded-full border text-[10px] tracking-wide leading-tight',
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 relative overflow-visible">
      {/* Premium multi-layered decorative gradient glows for branded aesthetic */}
      <div className="absolute top-0 right-0 w-[550px] h-[350px] bg-gradient-to-bl from-teal-500/10 via-navy-500/3 to-transparent rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-gradient-to-tr from-gold-500/5 via-navy-500/2 to-transparent rounded-full blur-3xl pointer-events-none z-0" />

      <PacienteHeader
        patient={serialize(patient)}
        counts={{
          treatments: patient._count.treatments,
          anamneses: patient._count.anamneses,
          medicalRecords: patient._count.medicalRecords,
        }}
      />

      <PacienteTabs patientId={pacienteId} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        {/* Próxima sessão */}
        <div className="lg:col-span-1 flex flex-col">
          <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-wider leading-none mb-3">
            Próxima sessão
          </h2>
          {proximaSessao ? (
            <div className="rounded-2xl border border-teal-500/25 bg-card/45 backdrop-blur-sm p-5 relative overflow-hidden pl-5 group shadow-sm transition-all hover:shadow-md hover:border-teal-500/40 duration-300 flex-1 flex flex-col justify-center min-h-[120px]">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal to-teal-600" />
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal shrink-0 shadow-inner">
                  <Calendar className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm md:text-base font-black text-foreground capitalize leading-tight">
                    {new Date(proximaSessao.dataAgendada).toLocaleDateString('pt-BR', {
                      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
                    })}
                  </p>
                  <p className="text-[11px] md:text-xs text-muted-foreground font-semibold mt-1 leading-normal flex items-center gap-1.5 flex-wrap">
                    <Clock className="w-3.5 h-3.5 text-teal shrink-0" />
                    <span>{new Date(proximaSessao.dataAgendada).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                    {proximaSessao.profissional && (
                      <>
                        <span>·</span>
                        <span>Profissional: <strong className="text-foreground font-bold">{proximaSessao.profissional.nome}</strong></span>
                      </>
                    )}
                    {proximaSessao.sala && (
                      <>
                        <span>·</span>
                        <span>Sala: <strong className="text-foreground font-bold">{proximaSessao.sala.nome}</strong></span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border/60 bg-card/20 backdrop-blur-sm p-6 text-center shadow-inner flex flex-col items-center justify-center min-h-[120px] flex-1">
              <Calendar className="w-6 h-6 text-muted-foreground/30 mb-2" />
              <p className="text-xs text-muted-foreground font-bold">Sem sessão agendada</p>
              <Link href="/dashboard/agenda" className="text-xs font-bold text-teal hover:underline hover:text-teal-600 mt-1 block">
                Agendar sessão →
              </Link>
            </div>
          )}
        </div>

        {/* Tratamentos recentes */}
        <div className="lg:col-span-1 flex flex-col">
          <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-wider leading-none mb-3">
            Tratamentos recentes
          </h2>
          {recentTreatments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/60 bg-card/20 backdrop-blur-sm p-6 text-center shadow-inner flex flex-col items-center justify-center min-h-[120px] flex-1">
              <Syringe className="w-6 h-6 text-muted-foreground/30 mb-2" />
              <p className="text-xs text-muted-foreground font-bold">Nenhum tratamento em andamento</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 flex-1">
              {recentTreatments.map(t => (
                <div key={t.id} className="flex items-center justify-between gap-4 rounded-2xl border border-border/40 bg-card/45 backdrop-blur-sm p-4 hover:border-gold-500/25 transition-all duration-300 hover:shadow-sm relative overflow-hidden pl-5">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gold to-gold-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-extrabold text-foreground truncate leading-tight">
                      {t.descricaoCustomizada ?? t.tipoTratamento}
                    </p>
                    <p className="text-xs text-muted-foreground font-semibold mt-1 leading-normal">
                      Sessões: {t.sessoesRealizadas}/{t.sessoesPrevistas} realizadas
                    </p>
                  </div>
                  <span className={cn('shrink-0 border', STATUS_COLORS[t.status] ?? 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20 font-bold px-2.5 py-0.5 rounded-full text-[10px] tracking-wide leading-tight')}>
                    {STATUS_LABELS[t.status] ?? t.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
