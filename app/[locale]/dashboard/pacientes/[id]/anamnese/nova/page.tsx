import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { AnamnesesNovaClient } from './anamnese-nova-client'
import { ClipboardList } from 'lucide-react'
import { EmptyState } from '@/components/pacientes/shared/empty-state'

export const dynamic = 'force-dynamic'

export default async function NovaAnamnесePage({
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

  // Get the most recent active template for this org
  const templateRecord = await prisma.anamnesisTemplate.findFirst({
    where: { organizationId: user.organizationId },
    orderBy: { updatedAt: 'desc' },
    select: { template: true, templateHash: true },
  })

  const serialize = <T,>(v: T): T => JSON.parse(JSON.stringify(v))

  if (!templateRecord) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="Nenhum template de anamnese configurado"
        description="Configure um template em Configurações → Anamnese antes de preencher fichas"
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-sm font-black text-foreground">Nova Anamnese</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Preencha o questionário de saúde do paciente</p>
      </div>
      <AnamnesesNovaClient
        patientId={pacienteId}
        template={serialize(templateRecord.template) as Parameters<typeof AnamnesesNovaClient>[0]['template']}
        templateHash={templateRecord.templateHash}
      />
    </div>
  )
}
