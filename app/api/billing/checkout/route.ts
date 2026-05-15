import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CustomPlanSchema } from '@/lib/pricing/schema'
import { calculatePrice } from '@/lib/pricing/calculator'

async function getUser() {
  const session = await getSession()
  if (!session?.user?.email) return null
  return prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true, orgRole: true, email: true },
  })
}

/**
 * Creates or updates Mercado Pago subscription based on selected modules.
 * NOTE: Actual MP API call is stubbed — this endpoint persists the plan
 * and returns a checkout reference. The MP integration sits in lib/mercadopago/
 * and is called via a separate worker. For MVP we update the local state and
 * mark mercadoPagoPreferenceId as pending.
 */
export async function POST(req: Request) {
  const user = await getUser()
  if (!user?.organizationId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.orgRole === 'MEMBER') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const parsed = CustomPlanSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const catalog = await prisma.pricingModule.findMany({ where: { ativo: true } })
  const catalogTyped = catalog.map(m => ({
    slug: m.slug,
    category: m.category as 'BASE' | 'CLINICO' | 'COMUNICACAO' | 'GESTAO' | 'IA' | 'ADDON',
    nome: m.nome,
    descricao: m.descricao,
    features: m.features,
    priceCents: m.priceCents,
    iconLucide: m.iconLucide,
    exclusiveGroup: m.exclusiveGroup,
    required: m.required,
    ordem: m.ordem,
  }))

  const result = calculatePrice(
    {
      selectedSlugs: parsed.data.modules,
      extras: {
        users: parsed.data.extraUsers,
        rooms: parsed.data.extraRooms,
        profs: parsed.data.extraProfs,
      },
      billingPeriod: parsed.data.billingPeriod,
    },
    catalogTyped,
  )

  const moduleMap: Record<string, boolean> = {}
  for (const slug of result.breakdown.map(b => b.slug)) {
    moduleMap[slug] = true
  }

  // TODO: Integrate Mercado Pago subscription create/update API call.
  // For now, persist plan + return a fake checkout URL.
  const updated = await prisma.organization.update({
    where: { id: user.organizationId },
    data: {
      customPlanModules: moduleMap,
      customPlanPriceCents: result.totalCents,
      extraUsers: parsed.data.extraUsers,
      extraRooms: parsed.data.extraRooms,
      extraProfs: parsed.data.extraProfs,
      billingPeriod: parsed.data.billingPeriod,
    },
    select: {
      id: true,
      customPlanModules: true,
      customPlanPriceCents: true,
      mercadoPagoSubscriptionId: true,
    },
  })

  console.log(`[Pricing] Org ${updated.id} updated plan to R$${(result.totalCents / 100).toFixed(2)}/mês (${result.breakdown.length} modules)`)

  return NextResponse.json({
    ok: true,
    org: updated,
    result,
    // TODO: Replace with real MP checkout init_point
    checkoutUrl: '/dashboard/billing',
  })
}
