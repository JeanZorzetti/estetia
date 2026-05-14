/**
 * Immutable audit log for clinical record access.
 * LGPD Art. 46: technical measures to protect personal health data.
 *
 * Every read/write/export/delete of MedicalRecord, Anamnesis or ConsentLog
 * must call logMedicalAccess() — failure to do so is caught by unit tests
 * on critical routes.
 *
 * Writes to MedicalAccessLog (append-only — no UPDATE/DELETE in application
 * layer). DB-level GRANT revokes DELETE on this table for the app user.
 */

import { prisma } from '@/lib/prisma'
import logger from '@/lib/logger'
import { headers } from 'next/headers'

export type MedicalRecordType = 'MedicalRecord' | 'Anamnesis' | 'ConsentLog' | 'Patient'
export type MedicalAction = 'VIEW' | 'CREATE' | 'UPDATE' | 'EXPORT' | 'DELETE' | 'ANONYMIZE'

export interface LogMedicalAccessOptions {
  organizationId: string
  userId?: string | null
  pacienteId: string
  recordType: MedicalRecordType
  recordId: string
  action: MedicalAction
  metadata?: Record<string, unknown>
}

export async function logMedicalAccess(opts: LogMedicalAccessOptions): Promise<void> {
  try {
    const headersList = await headers()
    const ip =
      headersList.get('x-forwarded-for')?.split(',')[0].trim() ??
      headersList.get('x-real-ip') ??
      'unknown'
    const userAgent = headersList.get('user-agent') ?? undefined

    await prisma.$executeRaw`
      INSERT INTO "MedicalAccessLog"
        ("id", "organizationId", "userId", "pacienteId", "recordType", "recordId", "action", "ipAddress", "userAgent", "metadata", "createdAt")
      VALUES
        (gen_random_uuid()::text, ${opts.organizationId}, ${opts.userId ?? null}, ${opts.pacienteId},
         ${opts.recordType}, ${opts.recordId}, ${opts.action},
         ${ip}, ${userAgent ?? null},
         ${opts.metadata ? JSON.stringify(opts.metadata) : null}::jsonb,
         NOW())
    `
  } catch (err) {
    // Log to application logger but never throw — audit failure must not block clinical workflow
    logger.error({ err, ...opts }, 'Failed to write MedicalAccessLog — LGPD audit gap')
  }
}

/**
 * Retrieve access audit trail for a patient. Used by LGPD export endpoint.
 */
export async function getPatientAccessLog(
  pacienteId: string,
  organizationId: string,
  limit = 100
) {
  const rows = await prisma.$queryRaw<
    Array<{
      id: string
      userId: string | null
      recordType: string
      recordId: string
      action: string
      ipAddress: string | null
      createdAt: Date
    }>
  >`
    SELECT id, "userId", "recordType", "recordId", action, "ipAddress", "createdAt"
    FROM "MedicalAccessLog"
    WHERE "organizationId" = ${organizationId}
      AND "pacienteId" = ${pacienteId}
    ORDER BY "createdAt" DESC
    LIMIT ${limit}
  `
  return rows
}
