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
    select: { organizationId: true, orgRole: true },
  })
}

// Returns the impact of switching plans: delta, prorated charge, next renewal amount
export async function POST(req: Request) {
  const user = await getUser()
  if (!user?.organizationId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = CustomPlanSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const [current, catalog] = await Promise.all([
    prisma.organization.findUnique({
      where: { id: user.organizationId },
      select: { customPlanPriceCents: true, customPricing: true, billingPeriod: true },
    }),
    prisma.pricingModule.findMany({ where: { ativo: true } }),
  ])

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

  const newResult = calculatePrice(
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

  // Honor price-lock
  const lockedPriceCents = current?.customPricing
    ? Math.round(Number(current.customPricing) * 100)
    : null

  const oldPriceCents = lockedPriceCents ?? current?.customPlanPriceCents ?? 0
  const newPriceCents = newResult.totalCents
  const deltaCents = newPriceCents - oldPriceCents

  // Proration: dia atual no mês × delta / dias do mês
  const now = new Date()
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const daysRemaining = daysInMonth - now.getDate() + 1
  const prorationCents = Math.max(0, Math.round((deltaCents * daysRemaining) / daysInMonth))

  return NextResponse.json({
    oldPriceCents,
    newPriceCents,
    deltaCents,
    prorationCents,
    daysRemaining,
    daysInMonth,
    isLocked: lockedPriceCents != null,
    newPlan: newResult,
  })
}
