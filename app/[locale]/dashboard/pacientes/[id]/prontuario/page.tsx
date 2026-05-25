import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { logMedicalAccess } from '@/lib/audit/medical-access-log'
import { headers } from 'next/headers'
import { ProntuarioClient } from './prontuario-client'
import { PacienteTabs } from '@/components/pacientes/paciente-tabs'

export const dynamic = 'force-dynamic'

export default async function ProntuarioPage({
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

  // Verify patient belongs to org
  const patient = await prisma.patient.findFirst({
    where: { id: pacienteId, organizationId: user.organizationId },
    select: {
      id: true,
      nome: true,
      email: true,
      telefone: true,
      dataNascimento: true,
      alergias: true,
      medicacoesUso: true,
      contraindicacoes: true,
      tags: true,
      origem: true,
      // tags agora existe no schema (adicionado nesta sprint)
      createdAt: true,
    },
  })
  if (!patient) notFound()

  const [records, anamneses, treatments, consentLogs] = await Promise.all([
    // Medical records (metadata only — content fetched per-record on demand)
    prisma.medicalRecord.findMany({
      where: { pacienteId, organizationId: user.organizationId },
      select: {
        id: true,
        dataAtendimento: true,
        queixaPrincipal: true,
        hipoteseDiagnostica: true,
        planoTratamento: true,
        profissional: { select: { nome: true } },
        createdAt: true,
      },
      orderBy: { dataAtendimento: 'desc' },
      take: 20,
    }),

    // Anamneses list (no content — decrypted on demand)
    prisma.anamnesis.findMany({
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
      take: 20,
    }),

    // Treatment timeline
    prisma.treatment.findMany({
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
      take: 10,
    }),

    // Consent history
    prisma.consentLog.findMany({
      where: { pacienteId, organizationId: user.organizationId },
      select: { id: true, tipo: true, aceitoEm: true, revokedAt: true },
      orderBy: { aceitoEm: 'desc' },
    }),
  ])

  // Log the page view (server-side, before returning)
  await logMedicalAccess({
    organizationId: user.organizationId,
    userId: user.id,
    pacienteId,
    recordType: 'Patient',
    recordId: pacienteId,
    action: 'VIEW',
    metadata: { page: 'prontuario' },
  })

  const serialize = <T extends object>(obj: T): T =>
    JSON.parse(JSON.stringify(obj))

  return (
    <div className="flex flex-col">
      <PacienteTabs patientId={pacienteId} />
      <ProntuarioClient
        patient={serialize(patient)}
        records={serialize(records)}
        anamneses={serialize(anamneses)}
        treatments={serialize(treatments)}
        consentLogs={serialize(consentLogs)}
        canEdit={user.orgRole !== 'MEMBER'}
      />
    </div>
  )
}
