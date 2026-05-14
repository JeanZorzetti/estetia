import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { ProntuariosHubClient } from '@/components/prontuarios/prontuarios-hub-client'

export const dynamic = 'force-dynamic'

const serialize = <T,>(v: T): T => JSON.parse(JSON.stringify(v))

export default async function ProntuariosPage() {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) redirect('/login')

  const { organizationId } = user
  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const [
    recentRecords,
    patientsWithRecords,
    kpiRecordsCount,
    kpiPendingAnamneses,
    kpiGroups,
  ] = await Promise.all([
    prisma.medicalRecord.findMany({
      where: { organizationId },
      select: {
        id: true,
        dataAtendimento: true,
        queixaPrincipal: true,
        hipoteseDiagnostica: true,
        profissionalId: true,
        profissional: { select: { nome: true } },
        createdAt: true,
        paciente: { select: { id: true, nome: true } },
      },
      orderBy: { dataAtendimento: 'desc' },
      take: 50,
    }),

    prisma.patient.findMany({
      where: {
        organizationId,
        medicalRecords: { some: {} },
      },
      select: {
        id: true,
        nome: true,
        alergias: true,
        tags: true,
        _count: { select: { medicalRecords: true } },
        medicalRecords: {
          select: { id: true, dataAtendimento: true },
          orderBy: { dataAtendimento: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    }),

    prisma.medicalRecord.count({
      where: { organizationId, createdAt: { gte: since30d } },
    }),

    prisma.anamnesis.count({
      where: { organizationId, assinadoEm: null },
    }),

    prisma.medicalRecord.groupBy({
      by: ['profissionalId'],
      where: { organizationId, createdAt: { gte: since30d }, profissionalId: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 1,
    }),
  ])

  // Unique patients in last 30d
  const uniquePatientsSet = new Set(
    recentRecords
      .filter(r => new Date(r.createdAt) >= since30d)
      .map(r => r.paciente.id)
  )

  // Resolve top professional name
  let topProfessional: { nome: string; count: number } | null = null
  if (kpiGroups.length > 0 && kpiGroups[0].profissionalId) {
    const prof = await prisma.professional.findUnique({
      where: { id: kpiGroups[0].profissionalId },
      select: { nome: true },
    })
    if (prof) {
      topProfessional = { nome: prof.nome, count: kpiGroups[0]._count.id }
    }
  }

  // Reshape records for client (rename paciente → patient for component)
  const records = recentRecords.map(r => ({
    id: r.id,
    dataAtendimento: r.dataAtendimento.toISOString(),
    queixaPrincipal: r.queixaPrincipal,
    hipoteseDiagnostica: r.hipoteseDiagnostica,
    profissionalId: r.profissionalId,
    profissional: r.profissional,
    createdAt: r.createdAt.toISOString(),
    patient: { id: r.paciente.id, nome: r.paciente.nome },
  }))

  const patients = patientsWithRecords.map(p => ({
    id: p.id,
    nome: p.nome,
    alergias: p.alergias,
    tags: p.tags,
    _count: p._count,
    medicalRecords: p.medicalRecords.map(mr => ({
      id: mr.id,
      dataAtendimento: mr.dataAtendimento.toISOString(),
    })),
  }))

  // Sort patients by last medical record date desc
  patients.sort((a, b) => {
    const aDate = a.medicalRecords[0]?.dataAtendimento ?? ''
    const bDate = b.medicalRecords[0]?.dataAtendimento ?? ''
    return bDate.localeCompare(aDate)
  })

  const kpis = {
    recordsCount: kpiRecordsCount,
    pendingAnamneses: kpiPendingAnamneses,
    uniquePatients: uniquePatientsSet.size,
    topProfessional,
  }

  return (
    <ProntuariosHubClient
      records={serialize(records)}
      patients={serialize(patients)}
      kpis={serialize(kpis)}
    />
  )
}
