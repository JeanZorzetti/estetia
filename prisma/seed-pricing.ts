/**
 * Seed do catálogo de PricingModule (Pricing v3.0).
 * Executar via: npx tsx prisma/seed-pricing.ts
 * Pode ser rodado múltiplas vezes — usa upsert por slug.
 */
import { PrismaClient } from '@prisma/client'
import { PRICING_MODULES_SEED } from '../lib/pricing/modules'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding PricingModule catalog...')

  for (const mod of PRICING_MODULES_SEED) {
    await prisma.pricingModule.upsert({
      where: { slug: mod.slug },
      create: {
        slug: mod.slug,
        category: mod.category,
        nome: mod.nome,
        descricao: mod.descricao,
        features: mod.features,
        priceCents: mod.priceCents,
        iconLucide: mod.iconLucide,
        exclusiveGroup: mod.exclusiveGroup ?? null,
        required: mod.required ?? false,
        ordem: mod.ordem,
        ativo: true,
      },
      update: {
        category: mod.category,
        nome: mod.nome,
        descricao: mod.descricao,
        features: mod.features,
        priceCents: mod.priceCents,
        iconLucide: mod.iconLucide,
        exclusiveGroup: mod.exclusiveGroup ?? null,
        required: mod.required ?? false,
        ordem: mod.ordem,
      },
    })
    console.log(`  ✓ ${mod.slug} (R$ ${(mod.priceCents / 100).toFixed(2)})`)
  }

  const count = await prisma.pricingModule.count()
  console.log(`\n${count} modules in catalog.`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
