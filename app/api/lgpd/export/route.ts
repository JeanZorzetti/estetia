import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logMedicalAccess, getPatientAccessLog } from '@/lib/audit/medical-access-log'
import { decrypt } from '@/lib/encryption'

/**
 * GET /api/lgpd/export?pacienteId=
 *
 * LGPD Art. 18, II — portabilidade de dados do titular.
 * Returns a complete JSON export of all data held for a patient.
 * Access is logged in MedicalAccessLog.
 */
export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, organizationId: true },
  })
  if (!user?.organizationId) {
    return NextResponse.json({ error: 'No org' }, { status: 403 })
  }

  const pacienteId = req.nextUrl.searchParams.get('pacienteId')
  if (!pacienteId) {
    return NextResponse.json({ error: 'pacienteId required' }, { status: 400 })
  }

  const patient = await prisma.patient.findFirst({
    where: { id: pacienteId, organizationId: user.organizationId },
    include: {
      treatments: {
        include: {
          sessions: {
            select: {
              id: true,
              dataAgendada: true,
              dataRealizada: true,
              status: true,
              observacoes: true,
              produtosAplicados: true,
            },
          },
          anamneses: {
            select: {
              id: true,
              createdAt: true,
              templateHash: true,
              preenchidoPor: true,
              assinadoEm: true,
              respostas: true,
            },
          },
        },
      },
      medicalRecords: {
        select: {
          id: true,
          dataAtendimento: true,
          queixaPrincipal: true,
          historiaClinica: true,
          hipoteseDiagnostica: true,
          planoTratamento: true,
          dadosCriptografados: true,
        },
      },
      consentLogs: {
        select: {
          id: true,
          tipo: true,
          versaoDocumento: true,
          aceitoEm: true,
          revokedAt: true,
          ipAddress: true,
        },
      },
    },
  })

  if (!patient) {
    return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
  }

  // Decrypt anamneses answers
  type TreatmentWithAnamneses = typeof patient.treatments[number]
  type AnamnesisEntry = TreatmentWithAnamneses['anamneses'][number]
  type MedicalRecordEntry = typeof patient.medicalRecords[number]

  const treatmentsExport = patient.treatments.map((t: TreatmentWithAnamneses) => ({
    ...t,
    anamneses: t.anamneses.map((a: AnamnesisEntry) => {
      let respostasDecrypted: unknown = null
      try {
        respostasDecrypted = JSON.parse(decrypt(a.respostas))
      } catch {
        respostasDecrypted = '[encrypted]'
      }
      return { ...a, respostas: respostasDecrypted }
    }),
  }))

  // Decrypt medical records
  const medicalRecordsExport = patient.medicalRecords.map((r: MedicalRecordEntry) => {
    let extraDecrypted: unknown = null
    if (r.dadosCriptografados) {
      try {
        extraDecrypted = JSON.parse(decrypt(r.dadosCriptografados))
      } catch {
        extraDecrypted = '[encrypted]'
      }
    }
    return { ...r, dadosCriptografados: extraDecrypted }
  })

  // Fetch access audit trail
  const accessLog = await getPatientAccessLog(pacienteId, user.organizationId, 200)

  // Log this export itself
  await logMedicalAccess({
    organizationId: user.organizationId,
    userId: user.id,
    pacienteId,
    recordType: 'Patient',
    recordId: pacienteId,
    action: 'EXPORT',
    metadata: { reason: 'LGPD Art. 18 portabilidade' },
  })

  const exportPayload = {
    exportedAt: new Date().toISOString(),
    exportedBy: session.user.email,
    lgpdBasis: 'Art. 18, II — Portabilidade de dados',
    patient: {
      id: patient.id,
      nome: patient.nome,
      email: patient.email,
      telefone: patient.telefone,
      dataNascimento: patient.dataNascimento,
      origem: patient.origem,
      tags: patient.tags,
      createdAt: patient.createdAt,
    },
    treatments: treatmentsExport,
    medicalRecords: medicalRecordsExport,
    consentHistory: patient.consentLogs,
    accessAuditLog: accessLog,
  }

  return new NextResponse(JSON.stringify(exportPayload, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="lgpd-export-${pacienteId}-${Date.now()}.json"`,
    },
  })
}
