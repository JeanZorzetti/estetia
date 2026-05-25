import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { logMedicalAccess } from '@/lib/audit/medical-access-log'
import { FotosGridClient } from '@/components/pacientes/fotos/fotos-grid-client'

export const dynamic = 'force-dynamic'

export default async function FotosPage({
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
    select: { id: true },
  })
  if (!patient) notFound()

  const fotos = await prisma.patientPhoto.findMany({
    where: { patientId: pacienteId, organizationId: user.organizationId },
    select: {
      id: true,
      url: true,
      tipo: true,
      areaCorpo: true,
      anguloPadronizado: true,
      createdAt: true,
      consentimentoConcedido: true,
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
    metadata: { page: 'fotos' },
  })

  const serialize = <T,>(v: T): T => JSON.parse(JSON.stringify(v))

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-black text-foreground">Fotos Clínicas</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Registro fotográfico de evolução dos tratamentos</p>
      </div>
      <FotosGridClient
        fotos={serialize(fotos)}
        patientId={pacienteId}
        canUpload={user.orgRole !== 'MEMBER'}
      />
    </div>
  )
}
