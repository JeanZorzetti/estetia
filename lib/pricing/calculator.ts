import {
  BASE_PRICE_CENTS,
  EXTRA_USER_CENTS,
  EXTRA_ROOM_CENTS,
  EXTRA_PROF_CENTS,
  MUTEX_GROUPS,
  ANNUAL_DISCOUNT_PCT,
  type PricingModuleData,
} from './modules'

export interface CalculateInput {
  selectedSlugs: string[]
  extras?: {
    users?: number  // adicionais além dos 2 incluídos
    rooms?: number  // adicionais além de 1
    profs?: number  // adicionais além de 1
  }
  billingPeriod?: 'MONTHLY' | 'ANNUAL'
}

export interface BreakdownItem {
  slug: string
  nome: string
  category: string
  priceCents: number
}

export interface CalculateResult {
  breakdown: BreakdownItem[]
  baseCents: number
  modulesCents: number
  extrasCents: number
  subtotalCents: number
  annualDiscountCents: number
  totalCents: number
  // Quando billing=ANNUAL, totalCents é o valor mensal com desconto aplicado
  totalMonthlyCents: number
  totalAnnualCents: number  // 12x se anual
  warnings: string[]
}

// Resolve mutex: dentro de cada grupo, mantém só o último selecionado
function resolveMutex(slugs: string[]): { resolved: string[]; warnings: string[] } {
  const warnings: string[] = []
  const slugSet = new Set(slugs)

  for (const [groupName, groupSlugs] of Object.entries(MUTEX_GROUPS)) {
    const selected = groupSlugs.filter(s => slugSet.has(s))
    if (selected.length > 1) {
      // Mantém apenas o último (mais à direita na ordem de seleção)
      const keep = slugs.filter(s => groupSlugs.includes(s)).pop()
      for (const s of selected) {
        if (s !== keep) slugSet.delete(s)
      }
      warnings.push(`Grupo "${groupName}" permite apenas 1 opção. Mantido: ${keep}`)
    }
  }

  return { resolved: Array.from(slugSet), warnings }
}

export function calculatePrice(
  input: CalculateInput,
  catalog: PricingModuleData[],
): CalculateResult {
  const billingPeriod = input.billingPeriod ?? 'MONTHLY'
  const extraUsers = Math.max(0, input.extras?.users ?? 0)
  const extraRooms = Math.max(0, input.extras?.rooms ?? 0)
  const extraProfs = Math.max(0, input.extras?.profs ?? 0)

  // Base sempre incluída (required)
  const slugs = new Set(input.selectedSlugs)
  slugs.add('base')

  const { resolved, warnings } = resolveMutex(Array.from(slugs))

  const catalogBySlug = Object.fromEntries(catalog.map(m => [m.slug, m]))

  // Anti-double: se tem WABA, Evolution não é necessário (apenas warning, não bloqueia)
  if (resolved.includes('whatsapp_waba') && resolved.includes('whatsapp_evolution')) {
    warnings.push('Você selecionou WhatsApp Cloud API (oficial). A integração Evolution se torna redundante mas pode ser mantida para multi-instância.')
  }

  const breakdown: BreakdownItem[] = []
  let baseCents = 0
  let modulesCents = 0

  for (const slug of resolved) {
    const mod = catalogBySlug[slug]
    if (!mod) continue
    breakdown.push({
      slug: mod.slug,
      nome: mod.nome,
      category: mod.category,
      priceCents: mod.priceCents,
    })
    if (mod.category === 'BASE') baseCents += mod.priceCents
    else modulesCents += mod.priceCents
  }

  const extrasCents =
    extraUsers * EXTRA_USER_CENTS +
    extraRooms * EXTRA_ROOM_CENTS +
    extraProfs * EXTRA_PROF_CENTS

  const subtotalCents = baseCents + modulesCents + extrasCents
  const annualDiscountCents = billingPeriod === 'ANNUAL'
    ? Math.round(subtotalCents * ANNUAL_DISCOUNT_PCT / 100)
    : 0
  const totalMonthlyCents = subtotalCents - annualDiscountCents
  const totalAnnualCents = totalMonthlyCents * 12

  return {
    breakdown,
    baseCents,
    modulesCents,
    extrasCents,
    subtotalCents,
    annualDiscountCents,
    totalCents: totalMonthlyCents,
    totalMonthlyCents,
    totalAnnualCents,
    warnings,
  }
}

export function formatBRL(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100)
}

// Sanity fallback for client-side use without catalog
export function calculatePriceWithSeed(
  input: CalculateInput,
): CalculateResult {
  // dynamic import to avoid loading seed in server unnecessarily
  const { PRICING_MODULES_SEED } = require('./modules') as typeof import('./modules')
  return calculatePrice(input, PRICING_MODULES_SEED)
}
