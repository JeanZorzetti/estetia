/**
 * Route → PricingModule slug mapping.
 *
 * `null` means the route is part of the base platform (always available).
 * Any other value must match a `PricingModule.slug` in the catalog
 * (see `lib/pricing/modules.ts` → PRICING_MODULES_SEED).
 *
 * Used by:
 *  - Sidebar: paints a lock badge on routes whose module is not in `billingActiveModules`.
 *  - `requireModule()` server guard: blocks page rendering when accessed via deep-link.
 *  - `useModuleAccess()` client hook: gates inline UI fragments.
 */

export const ROUTE_TO_MODULE: Record<string, string | null> = {
  // BASE — always available
  '/dashboard':                         null,
  '/dashboard/agenda':                  null,
  '/dashboard/pacientes':               null,
  '/dashboard/settings':                null,
  '/dashboard/billing':                 null,
  '/dashboard/support':                 null,
  '/dashboard/lgpd':                    null,

  // CLÍNICO
  '/dashboard/prontuarios':             'prontuario',
  '/dashboard/procedimentos':           'procedimentos',
  '/dashboard/fotos':                   'fotos',
  '/dashboard/pacotes':                 'pacotes',
  '/dashboard/recall':                  'recall',

  // COMUNICAÇÃO
  '/dashboard/chat':                    'whatsapp_evolution',
  '/dashboard/marketing-clinico':       'marketing_clinico',
  '/dashboard/instagram':               'instagram',

  // GESTÃO
  '/dashboard/financeiro':              'financeiro',
  '/dashboard/financeiro/guias-tiss':   'tiss',
  '/dashboard/financeiro/operadoras':   'tiss',
  '/dashboard/financeiro/convenios':    'tiss',
  '/dashboard/financeiro/omie':         'omie',
  '/dashboard/analytics':               'analytics_avancado',
}

/**
 * Resolves the slug required to access a given pathname.
 * Walks from the most specific match down to the parent path so nested
 * routes inherit the parent's module unless explicitly mapped.
 */
export function moduleForRoute(pathname: string): string | null {
  // Strip locale prefix (e.g. "/pt-BR/dashboard/..." → "/dashboard/...")
  const stripped = pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?(?=\/)/, '')

  if (stripped in ROUTE_TO_MODULE) return ROUTE_TO_MODULE[stripped]

  const segments = stripped.split('/').filter(Boolean)
  while (segments.length > 1) {
    segments.pop()
    const candidate = '/' + segments.join('/')
    if (candidate in ROUTE_TO_MODULE) return ROUTE_TO_MODULE[candidate]
  }
  return null
}

/**
 * Returns true when the org has the module active OR trial is in effect.
 * Trial unlocks every module per UX decision (no lock badges during trial).
 */
export function hasModuleAccess(
  slug: string | null,
  activeModules: string[],
  trialActive: boolean,
): boolean {
  if (!slug) return true
  if (trialActive) return true
  return activeModules.includes(slug)
}
