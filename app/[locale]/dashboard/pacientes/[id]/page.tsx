import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { logMedicalAccess } from '@/lib/audit/medical-access-log'
import { PacienteHeader } from '@/components/pacientes/paciente-header'
import { PacienteTabs } from '@/components/pacientes/paciente-tabs'
import { Heart, ClipboardList, Syringe, Camera, Calendar } from 'lucide-react'
import Link from 'next/link'

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
    EM_TRATAMENTO: 'Em tratamento',
    CONCLUIDO: 'Concluído',
    PAUSADO: 'Pausado',
    CANCELADO: 'Cancelado',
  }

  const STATUS_COLORS: Record<string, string> = {
    AVALIACAO: 'bg-blue-50 text-blue-700 border-blue-200',
    EM_TRATAMENTO: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    CONCLUIDO: 'bg-gray-100 text-gray-600 border-gray-200',
    PAUSADO: 'bg-amber-50 text-amber-700 border-amber-200',
    CANCELADO: 'bg-red-50 text-red-600 border-red-200',
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <PacienteHeader
        patient={serialize(patient)}
        counts={{
          treatments: patient._count.treatments,
          anamneses: patient._count.anamneses,
          medicalRecords: patient._count.medicalRecords,
        }}
      />

      <PacienteTabs patientId={pacienteId} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Próxima sessão */}
        <div className="lg:col-span-1">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Próxima sessão
          </h2>
          {proximaSessao ? (
            <div className="rounded-xl border border-[#489FB5]/30 bg-[#489FB5]/5 p-4">
              <p className="text-sm font-medium text-foreground">
                {new Date(proximaSessao.dataAgendada).toLocaleDateString('pt-BR', {
                  weekday: 'long', day: 'numeric', month: 'long',
                })}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(proximaSessao.dataAgendada).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                {proximaSessao.profissional && ` · ${proximaSessao.profissional.nome}`}
                {proximaSessao.sala && ` · ${proximaSessao.sala.nome}`}
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-6 text-center">
              <Calendar className="w-6 h-6 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Sem sessão agendada</p>
              <Link href="/dashboard/agenda" className="text-xs text-[#489FB5] hover:underline mt-1 block">
                Agendar sessão →
              </Link>
            </div>
          )}
        </div>

        {/* Atalhos */}
        <div className="lg:col-span-1">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Ações rápidas
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Prontuário', href: `/dashboard/pacientes/${pacienteId}/prontuario`, icon: ClipboardList, color: 'text-[#0A1F3D]', bg: 'bg-[#0A1F3D]/5 hover:bg-[#0A1F3D]/10 border-[#0A1F3D]/10' },
              { label: 'Anamnese', href: `/dashboard/pacientes/${pacienteId}/anamnese`, icon: Heart, color: 'text-[#E05A4E]', bg: 'bg-[#E05A4E]/5 hover:bg-[#E05A4E]/10 border-[#E05A4E]/10' },
              { label: 'Agendar', href: '/dashboard/agenda', icon: Calendar, color: 'text-[#489FB5]', bg: 'bg-[#489FB5]/5 hover:bg-[#489FB5]/10 border-[#489FB5]/10' },
              { label: 'Fotos', href: `/dashboard/pacientes/${pacienteId}/fotos`, icon: Camera, color: 'text-[#C5A059]', bg: 'bg-[#C5A059]/5 hover:bg-[#C5A059]/10 border-[#C5A059]/10' },
            ].map(({ label, href, icon: Icon, color, bg }) => (
              <Link
                key={label}
                href={href}
                className={`flex flex-col items-center gap-1.5 rounded-lg border px-3 py-4 text-center transition-colors ${bg}`}
              >
                <Icon className={`w-5 h-5 ${color}`} />
                <span className={`text-xs font-medium ${color}`}>{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Tratamentos recentes */}
        <div className="lg:col-span-1">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Tratamentos recentes
          </h2>
          {recentTreatments.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-6 text-center">
              <Syringe className="w-6 h-6 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Nenhum tratamento ainda</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {recentTreatments.map(t => (
                <div key={t.id} className="flex items-center gap-3 rounded-lg border border-border/50 bg-card px-3 py-2.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">
                      {t.descricaoCustomizada ?? t.tipoTratamento}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {t.sessoesRealizadas}/{t.sessoesPrevistas} sessões
                    </p>
                  </div>
                  <span className={`text-[10px] font-medium rounded-full px-2 py-0.5 border ${STATUS_COLORS[t.status] ?? 'bg-gray-100 text-gray-600'}`}>
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
