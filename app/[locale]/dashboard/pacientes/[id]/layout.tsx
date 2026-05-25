import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { PacienteHeader } from '@/components/pacientes/paciente-header'
import { PacienteTabs } from '@/components/pacientes/paciente-tabs'

export const dynamic = 'force-dynamic'

export default async function PacienteLayout({
  children,
  params,
}: {
  children: React.ReactNode
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
    select: {
      id: true,
      nome: true,
      telefone: true,
      email: true,
      dataNascimento: true,
      sexo: true,
      origem: true,
      dadosSensiveis: true,
      tags: true,
      _count: {
        select: {
          treatments: true,
          anamneses: true,
          medicalRecords: true,
          consentLogs: true,
        },
      },
    },
  })
  if (!patient) notFound()

  const serialize = <T,>(v: T): T => JSON.parse(JSON.stringify(v))

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 relative overflow-visible">
      {/* Decorative gradient glows */}
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

      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
