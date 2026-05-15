import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { CalculadoraClient } from './calculadora-client'

export const dynamic = 'force-dynamic'

export default async function CalculadoraPage() {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true, orgRole: true },
  })
  if (!user?.organizationId) redirect('/login')

  const [modules, org] = await Promise.all([
    prisma.pricingModule.findMany({
      where: { ativo: true },
      orderBy: [{ category: 'asc' }, { ordem: 'asc' }],
    }),
    prisma.organization.findUnique({
      where: { id: user.organizationId },
      select: {
        customPlanModules: true,
        customPlanPriceCents: true,
        extraUsers: true,
        extraRooms: true,
        extraProfs: true,
        billingPeriod: true,
        customPricing: true,
        customPlanLockedUntil: true,
      },
    }),
  ])

  const modulesTyped = modules.map(m => ({
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

  const currentMap = (org?.customPlanModules ?? {}) as Record<string, boolean>
  const initialSelectedSlugs = Object.keys(currentMap).filter(k => currentMap[k])
  if (initialSelectedSlugs.length === 0) initialSelectedSlugs.push('base')

  const lockedCents = org?.customPricing ? Math.round(Number(org.customPricing) * 100) : null

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <Link
          href="/dashboard/billing"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar para Cobrança
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Personalizar plano</h1>
        <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
          Marque ou desmarque módulos para ajustar seu Estetia. Mudanças são aplicadas no próximo ciclo com proração.
        </p>
      </div>

      <CalculadoraClient
        modules={modulesTyped}
        initialSelectedSlugs={initialSelectedSlugs}
        initialExtras={{
          users: org?.extraUsers ?? 0,
          rooms: org?.extraRooms ?? 0,
          profs: org?.extraProfs ?? 0,
        }}
        initialBilling={(org?.billingPeriod as 'MONTHLY' | 'ANNUAL') ?? 'MONTHLY'}
        currentPriceCents={org?.customPlanPriceCents ?? null}
        lockedPriceCents={lockedCents}
        isAdmin={user.orgRole !== 'MEMBER'}
      />
    </div>
  )
}
