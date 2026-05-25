import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { logMedicalAccess } from '@/lib/audit/medical-access-log'
import { Syringe, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import { TreatmentStatusBadge } from '@/components/pacientes/shared/status-badge'
import { EmptyState } from '@/components/pacientes/shared/empty-state'

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
    select: { id: true, nome: true },
  })
  if (!patient) notFound()

  const [recentTreatments, proximaSessao] = await Promise.all([
    prisma.treatment.findMany({
      where: { pacienteId, organizationId: user.organizationId },
      select: {
        id: true,
        tipoTratamento: true,
        descricaoCustomizada: true,
        status: true,
        sessoesRealizadas: true,
        sessoesPrevistas: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.treatmentSession.findFirst({
      where: {
        organizationId: user.organizationId,
        treatment: { pacienteId },
        dataAgendada: { gte: new Date() },
        status: { in: ['AGENDADA', 'CONFIRMADA'] },
      },
      include: { profissional: { select: { nome: true } }, sala: { select: { nome: true } } },
      orderBy: { dataAgendada: 'asc' },
    }),
  ])

  await logMedicalAccess({
    organizationId: user.organizationId,
    userId: user.id,
    pacienteId,
    recordType: 'Patient',
    recordId: pacienteId,
    action: 'VIEW',
    metadata: { page: 'overview' },
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Próxima sessão */}
      <div className="flex flex-col gap-3">
        <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-wider leading-none">
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
          <EmptyState
            icon={Calendar}
            title="Sem sessão agendada"
            description="Nenhuma sessão futura encontrada"
            action={
              <Link href="/dashboard/agenda" className="text-xs font-bold text-teal hover:underline hover:text-teal-600">
                Agendar sessão →
              </Link>
            }
          />
        )}
      </div>

      {/* Tratamentos recentes */}
      <div className="flex flex-col gap-3">
        <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-wider leading-none">
          Tratamentos recentes
        </h2>
        {recentTreatments.length === 0 ? (
          <EmptyState
            icon={Syringe}
            title="Nenhum tratamento em andamento"
            description="Planos e cronogramas de sessões estéticas do paciente"
            iconBg="bg-gold-500/10 border-gold-500/20"
            iconColor="text-gold"
          />
        ) : (
          <div className="flex flex-col gap-3">
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
                <TreatmentStatusBadge status={t.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
