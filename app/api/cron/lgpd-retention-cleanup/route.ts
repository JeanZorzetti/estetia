/**
 * LGPD Retention Cleanup Cron Job
 *
 * Enforces Organization.lgpdRetentionMonths (LGPD Art. 16 — eliminação
 * após o fim do tratamento): anonymizes patients with no activity
 * (patient record or any treatment) for longer than the configured
 * retention window. Reuses lib/lgpd/anonymize-patient.ts, so fiscal
 * rows and the audit trail are preserved.
 *
 * Runs monthly. Idempotent: already-anonymized patients
 * (origem = 'anonimizado') are skipped.
 *
 * Manual test:
 * GET /api/cron/lgpd-retention-cleanup?token=SEU_CRON_SECRET
 * Dry run (no writes): &dryRun=1
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { anonymizePatient } from '@/lib/lgpd/anonymize-patient'
import logger from '@/lib/logger'

export const runtime = 'nodejs'
export const maxDuration = 300

const BATCH_LIMIT = 200 // safety cap per run; remainder picked up next run

export async function GET(request: NextRequest) {
  // Validate cron secret
  const authHeader = request.headers.get('authorization')
  const urlToken = request.nextUrl.searchParams.get('token')
  const cronSecret = process.env.CRON_SECRET

  const isValidToken =
    (cronSecret && authHeader === `Bearer ${cronSecret}`) ||
    (cronSecret && urlToken === cronSecret)

  if (!isValidToken) {
    return NextResponse.json(
      { error: 'Unauthorized - Invalid or missing CRON_SECRET' },
      { status: 401 }
    )
  }

  const dryRun = request.nextUrl.searchParams.get('dryRun') === '1'

  logger.info({ dryRun }, '[CRON:LGPD-RETENTION] Starting retention cleanup job...')
  const startTime = Date.now()
  const stats = { orgsChecked: 0, patientsExpired: 0, anonymized: 0, errors: 0 }

  try {
    const orgs = await prisma.organization.findMany({
      where: { lgpdRetentionMonths: { gt: 0 } },
      select: { id: true, name: true, lgpdRetentionMonths: true },
    })

    stats.orgsChecked = orgs.length

    for (const org of orgs) {
      const cutoff = new Date()
      cutoff.setMonth(cutoff.getMonth() - (org.lgpdRetentionMonths as number))

      const expiredPatients = await prisma.patient.findMany({
        where: {
          organizationId: org.id,
          origem: { not: 'anonimizado' },
          updatedAt: { lt: cutoff },
          // no treatment touched within the retention window
          treatments: { none: { updatedAt: { gte: cutoff } } },
        },
        select: { id: true },
        take: BATCH_LIMIT,
      })

      stats.patientsExpired += expiredPatients.length
      if (expiredPatients.length === 0) continue

      logger.info(
        { orgId: org.id, count: expiredPatients.length, retentionMonths: org.lgpdRetentionMonths, dryRun },
        '[CRON:LGPD-RETENTION] Patients past retention window'
      )

      if (dryRun) continue

      for (const patient of expiredPatients) {
        try {
          await anonymizePatient({
            pacienteId: patient.id,
            organizationId: org.id,
            userId: null,
            reason: `LGPD Art. 16 — retencao de ${org.lgpdRetentionMonths} meses expirada`,
            source: 'retention_cron',
          })
          stats.anonymized++
        } catch (err) {
          stats.errors++
          logger.error(
            { err, pacienteId: patient.id, orgId: org.id },
            '[CRON:LGPD-RETENTION] Failed to anonymize patient'
          )
        }
      }
    }

    const duration = Date.now() - startTime
    logger.info({ ...stats, dryRun, duration: `${duration}ms` }, '[CRON:LGPD-RETENTION] Job completed')

    return NextResponse.json({
      success: true,
      dryRun,
      message: 'LGPD retention cleanup completed',
      stats: { ...stats, duration: `${duration}ms` },
    })
  } catch (error) {
    logger.error({ error }, '[CRON:LGPD-RETENTION] Critical error')
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}
