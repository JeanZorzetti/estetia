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

export async function GET() {
  const user = await getUser()
  if (!user?.organizationId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const org = await prisma.organization.findUnique({
    where: { id: user.organizationId },
    select: {
      customPlanModules: true,
      customPlanPriceCents: true,
      customPlanLockedUntil: true,
      extraUsers: true,
      extraRooms: true,
      extraProfs: true,
      billingPeriod: true,
      tier: true,
      customPricing: true,
    },
  })

  return NextResponse.json({ plan: org })
}

export async function PUT(req: Request) {
  const user = await getUser()
  if (!user?.organizationId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.orgRole === 'MEMBER') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const parsed = CustomPlanSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  // Check lock
  const current = await prisma.organization.findUnique({
    where: { id: user.organizationId },
    select: { customPlanLockedUntil: true },
  })
  if (current?.customPlanLockedUntil && current.customPlanLockedUntil > new Date()) {
    return NextResponse.json({
      error: `Plan changes locked until ${current.customPlanLockedUntil.toISOString()}`,
    }, { status: 409 })
  }

  // Calculate
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

  // Build moduleMap
  const moduleMap: Record<string, boolean> = {}
  for (const slug of result.breakdown.map(b => b.slug)) {
    moduleMap[slug] = true
  }

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
      customPlanModules: true,
      customPlanPriceCents: true,
      extraUsers: true,
      extraRooms: true,
      extraProfs: true,
      billingPeriod: true,
    },
  })

  return NextResponse.json({ plan: updated, result })
}
