/**
 * Shared patient anonymization — LGPD Art. 18, VI (direito ao esquecimento)
 * and Art. 16 (fim do período de retenção).
 *
 * Anonymizes patient PII while preserving:
 *   - financial/fiscal records (NFS-e compliance)
 *   - aggregate session counts (statistical integrity)
 *   - audit log entries (cannot be deleted — LGPD Art. 37)
 *
 * Does NOT physically delete rows. Used by:
 *   - POST /api/lgpd/delete        (manual, admin-triggered)
 *   - GET  /api/cron/lgpd-retention-cleanup (automatic retention policy)
 */

import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { logMedicalAccess } from '@/lib/audit/medical-access-log'

export interface AnonymizePatientOptions {
  pacienteId: string
  organizationId: string
  /** User who triggered the anonymization; null for automated jobs */
  userId?: string | null
  reason: string
  /** Distinguishes manual requests from the retention cron in the audit trail */
  source: 'manual' | 'retention_cron'
}

export async function anonymizePatient(opts: AnonymizePatientOptions) {
  const { pacienteId, organizationId, userId, reason, source } = opts

  // Deterministic per patient so no orphaned NFS-e refs
  const anonId = `Paciente Anonimizado #${pacienteId.slice(0, 8).toUpperCase()}`

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // 1. Anonymize patient PII + health data
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
        observacoesMedicas: null,
        tags: [],
        origem: 'anonimizado',
        consentLgpd: {
          anonimizadoEm: new Date().toISOString(),
          motivo: reason,
          origem: source,
        },
      },
    })

    // 2. Wipe medical records content (keep row for fiscal integrity)
    await tx.medicalRecord.updateMany({
      where: { pacienteId, organizationId },
      data: {
        queixaPrincipal: null,
        historiaClinica: null,
        examesAvaliados: Prisma.DbNull,
        avaliacaoFisica: null,
        hipoteseDiagnostica: null,
        planoTratamento: null,
        dadosCriptografados: null,
      },
    })

    // 3. Wipe anamnesis answers (keep structural row)
    await tx.anamnesis.updateMany({
      where: { pacienteId, organizationId },
      data: {
        respostas: JSON.stringify({ anonimizado: true }),
        assinaturaDigital: null,
        assinadoIp: null,
      },
    })

    // 4. Revoke all active consents
    await tx.consentLog.updateMany({
      where: { pacienteId, organizationId, revokedAt: null },
      data: { revokedAt: new Date() },
    })
  })

  // Log the anonymization (this entry itself is permanent)
  await logMedicalAccess({
    organizationId,
    userId: userId ?? null,
    pacienteId,
    recordType: 'Patient',
    recordId: pacienteId,
    action: 'ANONYMIZE',
    metadata: { reason, anonId, source },
  })

  return { anonId }
}
