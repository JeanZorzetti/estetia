import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { logMedicalAccess } from '@/lib/audit/medical-access-log'
import { TratamentoCard } from '@/components/pacientes/tratamentos/tratamento-card'
import { EmptyState } from '@/components/pacientes/shared/empty-state'
import { Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function TratamentosPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { id: pacienteId } = await params

  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, organizationId: true },
  })
  if (!user?.organizationId) redirect('/login')

  const patient = await prisma.patient.findFirst({
    where: { id: pacienteId, organizationId: user.organizationId },
    select: { id: true },
  })
  if (!patient) notFound()

  const treatments = await prisma.treatment.findMany({
    where: { pacienteId, organizationId: user.organizationId },
    select: {
      id: true,
      tipoTratamento: true,
      descricaoCustomizada: true,
      status: true,
      sessoesRealizadas: true,
      sessoesPrevistas: true,
      createdAt: true,
      sessions: {
        select: { id: true, dataAgendada: true, status: true, noShowScore: true },
        orderBy: { dataAgendada: 'desc' },
        take: 5,
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  await logMedicalAccess({
    organizationId: user.organizationId,
    userId: user.id,
    pacienteId,
    recordType: 'Patient',
    recordId: pacienteId,
    action: 'VIEW',
    metadata: { page: 'tratamentos' },
  })

  const serialize = <T,>(v: T): T => JSON.parse(JSON.stringify(v))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-sm font-black text-foreground">Tratamentos</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Planos e cronogramas de sessões estéticas do paciente</p>
      </div>

      {treatments.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="Nenhum tratamento em andamento"
          description="Planos e cronogramas de sessões estéticas do paciente"
          iconBg="bg-gold-500/10 border-gold-500/20"
          iconColor="text-gold"
        />
      ) : (
        <div className="space-y-4">
          {serialize(treatments).map((t: typeof treatments[number]) => (
            <TratamentoCard key={t.id} treatment={t} />
          ))}
        </div>
      )}
    </div>
  )
}
