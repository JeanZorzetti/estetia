/**
 * Migration: Sirius CRM → Estetia (Clínicas de Estética)
 *
 * Converts existing Sirius CRM organizations to Estetia domain model:
 *   Contact  → Patient  (with legacyContactId FK)
 *   Deal     → Treatment (with legacyDealId FK, status mapping)
 *
 * This is opt-in per organization. Data is COPIED, never deleted.
 * Reversible for 30 days — original Contact/Deal rows remain untouched.
 *
 * Usage:
 *   tsx scripts/migrate-sirius-to-estetia.ts --dry-run          # preview
 *   tsx scripts/migrate-sirius-to-estetia.ts --org=<orgId>      # single org
 *   tsx scripts/migrate-sirius-to-estetia.ts --all-saude        # all health-segment orgs
 *   tsx scripts/migrate-sirius-to-estetia.ts --org=<id> --commit # actually run
 */

import { prisma } from '../lib/prisma'

// ─── Config ──────────────────────────────────────────────────────────────────

const DRY_RUN = !process.argv.includes('--commit')
const TARGET_ORG_ID = process.argv.find(a => a.startsWith('--org='))?.split('=')[1]
const ALL_SAUDE = process.argv.includes('--all-saude')

// Deal status → Treatment status mapping
const DEAL_STATUS_MAP: Record<string, string> = {
  open: 'AVALIACAO',
  won: 'FINALIZADO',
  lost: 'CANCELADO',
  active: 'EM_ANDAMENTO',
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface MigrationStats {
  orgsProcessed: number
  patientsCreated: number
  treatmentsCreated: number
  contactsSkipped: number  // already migrated or no phone
  dealsSkipped: number
  errors: string[]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function log(msg: string) {
  console.log(msg)
}

function warn(msg: string) {
  console.warn(`  [WARN] ${msg}`)
}

function preview(msg: string) {
  if (DRY_RUN) console.log(`  [DRY-RUN] ${msg}`)
}

// ─── Core migration per org ───────────────────────────────────────────────────

async function migrateOrg(orgId: string, stats: MigrationStats): Promise<void> {
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { id: true, name: true },
  })
  if (!org) {
    warn(`Organization ${orgId} not found — skipping`)
    return
  }

  log(`\n── Org: ${org.name} (${org.id})`)

  // ── 1. Contacts → Patients ───────────────────────────────────────────────

  const contacts = await prisma.contact.findMany({
    where: { organizationId: orgId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
    },
  })

  log(`   Contacts found: ${contacts.length}`)

  for (const contact of contacts) {
    // Check if already migrated
    const existing = await (prisma as any).patient?.findFirst?.({
      where: { legacyContactId: contact.id },
    }).catch(() => null)

    if (existing) {
      stats.contactsSkipped++
      continue
    }

    if (!contact.phone && !contact.email) {
      warn(`Contact ${contact.id} (${contact.name}) has no phone/email — skipping`)
      stats.contactsSkipped++
      continue
    }

    preview(`Create Patient: ${contact.name} (from Contact ${contact.id})`)

    if (!DRY_RUN) {
      try {
        await (prisma as any).patient.create({
          data: {
            organizationId: orgId,
            nome: contact.name,
            email: contact.email,
            telefone: contact.phone,
            legacyContactId: contact.id,
            origem: 'MIGRACAO_SIRIUS',
            ativo: true,
          },
        })
        stats.patientsCreated++
      } catch (err) {
        const msg = `Failed to create Patient for Contact ${contact.id}: ${(err as Error).message}`
        warn(msg)
        stats.errors.push(msg)
      }
    } else {
      stats.patientsCreated++
    }
  }

  // ── 2. Deals → Treatments ────────────────────────────────────────────────

  const deals = await prisma.deal.findMany({
    where: { organizationId: orgId },
    select: {
      id: true,
      title: true,
      status: true,
      value: true,
      contactId: true,
      createdAt: true,
    },
  })

  log(`   Deals found: ${deals.length}`)

  for (const deal of deals) {
    // Check if already migrated
    const existingTreatment = await (prisma as any).treatment?.findFirst?.({
      where: { legacyDealId: deal.id },
    }).catch(() => null)

    if (existingTreatment) {
      stats.dealsSkipped++
      continue
    }

    // Find associated patient
    let patientId: string | null = null
    if (deal.contactId) {
      const patient = await (prisma as any).patient?.findFirst?.({
        where: { legacyContactId: deal.contactId },
        select: { id: true },
      }).catch(() => null)
      patientId = patient?.id ?? null
    }

    if (!patientId) {
      warn(`Deal ${deal.id} (${deal.title}) has no matching Patient — skipping`)
      stats.dealsSkipped++
      continue
    }

    const treatmentStatus = DEAL_STATUS_MAP[deal.status ?? 'open'] ?? 'AVALIACAO'

    preview(`Create Treatment: "${deal.title}" → status=${treatmentStatus} for Patient ${patientId}`)

    if (!DRY_RUN) {
      try {
        await (prisma as any).treatment.create({
          data: {
            organizationId: orgId,
            pacienteId: patientId,
            tipoTratamento: 'OUTRO',
            status: treatmentStatus,
            valorTotal: deal.value ? Number(deal.value) : null,
            legacyDealId: deal.id,
            observacoes: `Migrado de Deal Sirius: ${deal.title}`,
          },
        })
        stats.treatmentsCreated++
      } catch (err) {
        const msg = `Failed to create Treatment for Deal ${deal.id}: ${(err as Error).message}`
        warn(msg)
        stats.errors.push(msg)
      }
    } else {
      stats.treatmentsCreated++
    }
  }

  stats.orgsProcessed++
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  log('═══════════════════════════════════════════')
  log(' Sirius CRM → Estetia Migration Script')
  log(`  Mode: ${DRY_RUN ? 'DRY-RUN (no changes)' : '⚠️  COMMIT (writing to DB)'}`)
  log('═══════════════════════════════════════════')

  if (DRY_RUN) {
    log('\n  Run with --commit to actually apply changes.\n')
  }

  const stats: MigrationStats = {
    orgsProcessed: 0,
    patientsCreated: 0,
    treatmentsCreated: 0,
    contactsSkipped: 0,
    dealsSkipped: 0,
    errors: [],
  }

  if (TARGET_ORG_ID) {
    await migrateOrg(TARGET_ORG_ID, stats)
  } else if (ALL_SAUDE) {
    // Find orgs with segment=SAUDE or ESTETICA
    const orgs = await prisma.organization.findMany({
      where: {
        OR: [
          { segment: 'SAUDE' },
          { segment: 'ESTETICA' },
        ],
      },
      select: { id: true },
    }).catch(async () => {
      // segment column might not exist — fall back to all orgs
      warn('segment column not found — falling back to all orgs (use --org=<id> for single org)')
      return prisma.organization.findMany({ select: { id: true } })
    })

    log(`\nFound ${orgs.length} organizations to migrate`)
    for (const org of orgs) {
      await migrateOrg(org.id, stats)
    }
  } else {
    log('\nUsage:')
    log('  tsx scripts/migrate-sirius-to-estetia.ts --dry-run --org=<orgId>')
    log('  tsx scripts/migrate-sirius-to-estetia.ts --org=<orgId> --commit')
    log('  tsx scripts/migrate-sirius-to-estetia.ts --all-saude --dry-run')
    process.exit(0)
  }

  // ── Summary ─────────────────────────────────────────────────────────────
  log('\n═══════════════════════════════════════════')
  log(` Migration ${DRY_RUN ? 'preview' : 'complete'} — Summary`)
  log('═══════════════════════════════════════════')
  log(`  Organizations processed : ${stats.orgsProcessed}`)
  log(`  Patients created        : ${stats.patientsCreated}`)
  log(`  Treatments created      : ${stats.treatmentsCreated}`)
  log(`  Contacts skipped        : ${stats.contactsSkipped}`)
  log(`  Deals skipped           : ${stats.dealsSkipped}`)
  log(`  Errors                  : ${stats.errors.length}`)

  if (stats.errors.length > 0) {
    log('\nErrors:')
    stats.errors.forEach(e => log(`  ✗ ${e}`))
    process.exit(1)
  }

  if (DRY_RUN) {
    log('\n✓ Dry-run complete. Add --commit to apply.')
  } else {
    log('\n✓ Migration complete.')
    log('  Original Contact/Deal rows are untouched.')
    log('  To rollback: delete Patient rows WHERE legacyContactId IS NOT NULL')
    log('               delete Treatment rows WHERE legacyDealId IS NOT NULL')
  }

  await prisma.$disconnect()
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
