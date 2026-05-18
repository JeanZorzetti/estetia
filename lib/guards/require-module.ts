import 'server-only'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { isTrialActive } from '@/lib/entitlements'
import { hasModuleAccess } from '@/lib/module-map'

export type ModuleAccessCheck =
  | { allowed: true; reason: 'trial' | 'subscribed' | 'base' }
  | { allowed: false; slug: string; reason: 'not_subscribed' | 'unauthenticated' }

/**
 * Server-side gate for a single module.
 * Returns `null` when access is allowed, or a descriptor that callers can use
 * to render <ModuleLockedScreen /> when blocked.
 *
 * Use as the first line of a page:
 *
 *   const block = await requireModule('prontuario')
 *   if (block) return <ModuleLockedScreen {...block} />
 */
export async function requireModule(slug: string | null): Promise<ModuleAccessCheck> {
  if (!slug) return { allowed: true, reason: 'base' }

  const session = await getSession()
  if (!session?.user?.email) {
    return { allowed: false, slug, reason: 'unauthenticated' }
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          tier: true,
          trialEndsAt: true,
          trialStatus: true,
          billingActiveModules: true,
        },
      },
    },
  })

  const org = user?.organization
  if (!org) return { allowed: false, slug, reason: 'unauthenticated' }

  const trialOn = isTrialActive({
    tier: org.tier,
    trialEndsAt: org.trialEndsAt,
    trialStatus: org.trialStatus,
  })
  if (trialOn) return { allowed: true, reason: 'trial' }

  const active = (org.billingActiveModules as string[] | null) ?? []
  if (hasModuleAccess(slug, active, false)) {
    return { allowed: true, reason: 'subscribed' }
  }

  return { allowed: false, slug, reason: 'not_subscribed' }
}
