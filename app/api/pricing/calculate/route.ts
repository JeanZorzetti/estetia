import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CalculateRequestSchema } from '@/lib/pricing/schema'
import { calculatePrice } from '@/lib/pricing/calculator'

// Public endpoint — calculate plan price.
export async function POST(req: Request) {
  const body = await req.json()
  const parsed = CalculateRequestSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const catalog = await prisma.pricingModule.findMany({
    where: { ativo: true },
  })

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

  return NextResponse.json(result)
}
