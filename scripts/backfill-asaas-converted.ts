/**
 * One-shot backfill: marks any org that already has an Asaas subscription
 * but still carries trialStatus=ACTIVE as CONVERTED.
 *
 * Context: pre-fix, `createOrgSubscription` and `updateOrgSubscription` did
 * not update `trialStatus`, so customers who paid during the trial window
 * kept ACTIVE — which makes `isTrialActive()` return true and silences the
 * lock badges on the modular gating UI.
 *
 * Idempotent: re-running is a no-op once trialStatus is CONVERTED.
 *
 * Usage: npx tsx scripts/backfill-asaas-converted.ts
 */

import { prisma } from '@/lib/prisma'

async function main() {
  const targets = await prisma.organization.findMany({
    where: {
      asaasSubscriptionId: { not: null },
      trialStatus: 'ACTIVE',
    },
    select: { id: true, name: true, asaasSubscriptionId: true, billingActiveModules: true },
  })

  if (targets.length === 0) {
    console.log('No orgs to backfill — every Asaas subscriber is already CONVERTED.')
    return
  }

  console.log(`Found ${targets.length} org(s) to backfill:`)
  for (const o of targets) {
    console.log(`  - ${o.name} (sub=${o.asaasSubscriptionId})`)
  }

  const res = await prisma.organization.updateMany({
    where: {
      asaasSubscriptionId: { not: null },
      trialStatus: 'ACTIVE',
    },
    data: { trialStatus: 'CONVERTED' },
  })

  console.log(`\nBackfilled ${res.count} org(s) to trialStatus=CONVERTED.`)
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
