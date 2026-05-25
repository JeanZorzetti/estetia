import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { logMedicalAccess } from '@/lib/audit/medical-access-log'
import { AnamneseCard } from '@/components/pacientes/anamnese/anamnese-card'
import { EmptyState } from '@/components/pacientes/shared/empty-state'
import { Button } from '@/components/ui/button'
import { ClipboardList, Plus } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AnamnesesPage({
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

  const anamneses = await prisma.anamnesis.findMany({
    where: { pacienteId, organizationId: user.organizationId },
    select: {
      id: true,
      treatmentId: true,
      preenchidoPor: true,
      assinadoEm: true,
      createdAt: true,
      profissional: { select: { nome: true } },
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
    metadata: { page: 'anamnese' },
  })

  const serialize = <T,>(v: T): T => JSON.parse(JSON.stringify(v))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-foreground">Anamneses</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Fichas e questionários de saúde do paciente</p>
        </div>
        <Button asChild size="sm" className="rounded-xl bg-navy hover:bg-navy/90 text-white text-xs font-bold h-9 px-4 gap-1.5">
          <Link href={`/dashboard/pacientes/${pacienteId}/anamnese/nova`}>
            <Plus className="w-3.5 h-3.5" />
            Nova anamnese
          </Link>
        </Button>
      </div>

      {anamneses.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Nenhuma anamnese preenchida ainda"
          description="Preencha o questionário de saúde do paciente"
          action={
            <Button asChild size="sm" variant="outline" className="rounded-xl text-xs font-bold h-8">
              <Link href={`/dashboard/pacientes/${pacienteId}/anamnese/nova`}>
                <Plus className="w-3.5 h-3.5 mr-1" />
                Preencher agora
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {serialize(anamneses).map((a: typeof anamneses[number]) => (
            <AnamneseCard key={a.id} anamnese={a} patientId={pacienteId} />
          ))}
        </div>
      )}
    </div>
  )
}
