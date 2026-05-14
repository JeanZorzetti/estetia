import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logMedicalAccess } from '@/lib/audit/medical-access-log'

/**
 * POST /api/lgpd/delete
 * Body: { pacienteId, reason }
 *
 * LGPD Art. 18, VI — direito ao esquecimento.
 * Anonymizes patient PII while preserving:
 *   - financial/fiscal records (NFS-e compliance)
 *   - aggregate session counts (statistical integrity)
 *   - audit log entries (cannot be deleted — LGPD Art. 37)
 *
 * Does NOT physically delete rows. Uses anonymization pattern.
 */
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, organizationId: true, orgRole: true },
  })
  if (!user?.organizationId) {
    return NextResponse.json({ error: 'No org' }, { status: 403 })
  }
  // Only admins can trigger LGPD deletion
  if (user.orgRole === 'MEMBER') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { pacienteId, reason } = await req.json()
  if (!pacienteId) {
    return NextResponse.json({ error: 'pacienteId required' }, { status: 400 })
  }

  const patient = await prisma.patient.findFirst({
    where: { id: pacienteId, organizationId: user.organizationId },
    select: { id: true, nome: true },
  })
  if (!patient) {
    return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
  }

  // Generate anonymous identifier (deterministic per patient so no orphaned NFS-e refs)
  const anonId = `Paciente Anonimizado #${pacienteId.slice(0, 8).toUpperCase()}`

  await prisma.$transaction(async (tx: typeof prisma) => {
    // 1. Anonymize patient PII
    await tx.patient.update({
      where: { id: pacienteId },
      data: {
        nome: anonId,
        email: null,
        telefone: null,
        cpf: null,
        dataNascimento: null,
        fotoPerfil: null,
        alergias: [],
        medicacoesUso: [],
        contraindicacoes: [],
        tags: [],
        origem: 'anonimizado',
        consentLgpd: { anonimizadoEm: new Date().toISOString(), motivo: reason ?? 'direito_esquecimento' },
      },
    })

    // 2. Wipe medical records content (keep row for fiscal integrity)
    await tx.medicalRecord.updateMany({
      where: { pacienteId, organizationId: user.organizationId },
      data: {
        queixaPrincipal: null,
        historiaClinica: null,
        examesAvaliados: null,
        avaliacaoFisica: null,
        hipoteseDiagnostica: null,
        planoTratamento: null,
        dadosCriptografados: null,
      },
    })

    // 3. Wipe anamnesis answers (keep structural row)
    await tx.anamnesis.updateMany({
      where: { pacienteId, organizationId: user.organizationId },
      data: {
        respostas: JSON.stringify({ anonimizado: true }),
        assinaturaDigital: null,
        assinadoIp: null,
      },
    })

    // 4. Revoke all active consents
    await tx.consentLog.updateMany({
      where: { pacienteId, organizationId: user.organizationId, revokedAt: null },
      data: { revokedAt: new Date() },
    })
  })

  // Log the anonymization (this entry itself is permanent)
  await logMedicalAccess({
    organizationId: user.organizationId,
    userId: user.id,
    pacienteId,
    recordType: 'Patient',
    recordId: pacienteId,
    action: 'ANONYMIZE',
    metadata: { reason: reason ?? 'LGPD Art. 18 VI — direito ao esquecimento', anonId },
  })

  return NextResponse.json({
    ok: true,
    message: `Dados do paciente anonimizados. ID: ${anonId}`,
    anonId,
  })
}
