import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ScenarioCard } from '@/components/pricing/scenario-card'
import { CompetitorComparison } from '@/components/pricing/competitor-comparison'
import { FaqPricing } from '@/components/pricing/faq-pricing'
import { Badge } from '@/components/ui/badge'
import { Sparkles, ShieldCheck, RefreshCw, Calendar } from 'lucide-react'
import PricingBuilderClient from './_pricing-builder-client'

export default async function PlansPage() {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) redirect('/login')

  const [org, modules] = await Promise.all([
    prisma.organization.findUnique({
      where: { id: user.organizationId },
      select: {
        billingActiveModules: true,
        billingCycle: true,
        billingMonthlyTotal: true,
        billingNextDueDate: true,
        asaasSubscriptionId: true,
        extraUsers: true,
        extraRooms: true,
        extraProfs: true,
      },
    }),
    prisma.pricingModule.findMany({
      where: { ativo: true },
      orderBy: [{ category: 'asc' }, { ordem: 'asc' }],
    }),
  ])

  const activeModules = (org?.billingActiveModules as string[] | null) ?? []
  const currentTotalCents = org?.billingMonthlyTotal
    ? Math.round(Number(org.billingMonthlyTotal) * 100)
    : null
  const billingCycle = (org?.billingCycle ?? 'MONTHLY') as 'MONTHLY' | 'YEARLY'
  const hasSubscription = !!org?.asaasSubscriptionId

  const modulesTyped = modules.map(m => ({
    slug: m.slug,
    category: m.category as 'BASE' | 'CLINICO' | 'COMUNICACAO' | 'GESTAO' | 'IA' | 'ADDON',
    nome: m.nome,
    descricao: m.descricao,
    features: m.features as string[],
    priceCents: m.priceCents,
    iconLucide: m.iconLucide,
    exclusiveGroup: m.exclusiveGroup,
    required: m.required,
    ordem: m.ordem,
  }))

  const initialSlugs = activeModules.length > 0
    ? activeModules
    : ['base', 'prontuario', 'whatsapp_evolution']

  const initialExtras = {
    users: org?.extraUsers ?? 0,
    rooms: org?.extraRooms ?? 0,
    profs: org?.extraProfs ?? 0,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <div className="border-b border-border/40 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col items-center text-center gap-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
            <Sparkles className="w-3.5 h-3.5" />
            {hasSubscription ? 'Gerencie sua assinatura' : 'Monte seu plano modular'}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter max-w-3xl">
            {hasSubscription ? (
              <>Sua assinatura.<br /><span className="text-primary">Atualize a qualquer momento.</span></>
            ) : (
              <>Monte o seu Estetia.<br /><span className="text-primary">Pague só pelo que usar.</span></>
            )}
          </h1>
          <p className="text-base text-muted-foreground max-w-xl leading-relaxed">
            {hasSubscription
              ? 'Adicione ou remova módulos abaixo. Mudanças entram em vigor imediatamente com cobrança proporcional.'
              : 'Marque os módulos que sua clínica precisa, ajuste capacidade e veja o total atualizar em tempo real.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            {hasSubscription ? (
              <>
                {org?.billingNextDueDate && (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    Próximo vencimento: {new Date(org.billingNextDueDate).toLocaleDateString('pt-BR')}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4" />
                  Ciclo {billingCycle === 'YEARLY' ? 'anual' : 'mensal'}
                </span>
                {currentTotalCents != null && (
                  <Badge variant="secondary" className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400">
                    Plano atual: R$ {(currentTotalCents / 100).toFixed(2)}/mês
                  </Badge>
                )}
              </>
            ) : (
              <>
                <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> 7 dias grátis</span>
                <span>·</span>
                <span>Sem fidelidade</span>
                <span>·</span>
                <span>Cancele a qualquer momento</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* BUILDER */}
      <div className="max-w-6xl mx-auto px-6 py-14">
        <PricingBuilderClient
          modules={modulesTyped}
          initialSlugs={initialSlugs}
          initialExtras={initialExtras}
          initialBilling={billingCycle}
          activeModules={activeModules}
          currentTotalCents={currentTotalCents ?? undefined}
          hasSubscription={hasSubscription}
        />
      </div>

      {/* SCENARIOS */}
      <div className="border-t border-border/40 bg-muted/20">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter mb-2">Exemplos de combinações reais</h2>
            <p className="text-sm text-muted-foreground">Veja o quanto outras clínicas pagam por mês com o Estetia</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <ScenarioCard
              icon="LayoutDashboard"
              title="Clínica solo"
              subtitle="Esteticista recém-aberta — 1 profissional, sem convênios"
              modules={['Plataforma Base', 'Prontuário', 'Procedimentos', 'WhatsApp Evolution']}
              totalCents={16600}
            />
            <ScenarioCard
              icon="Sparkles"
              title="Clínica média"
              subtitle="3 profissionais, foco em harmonização e marketing forte"
              modules={[
                'Base + Prontuário + Procedimentos',
                'Fotos + Pacotes + Recall',
                'WhatsApp + Marketing Clínico',
                'Financeiro',
                '+ 2 profissionais e 1 usuário',
              ]}
              totalCents={36200}
              highlight
            />
            <ScenarioCard
              icon="Brain"
              title="Dermatologia com convênios"
              subtitle="Atende particular + convênios, com IA e analytics"
              modules={[
                'Base + Clínico completo',
                'WhatsApp Cloud API + Marketing',
                'TISS + Omie ERP',
                'Estetia IA Pro + Analytics',
                '+ 5 profissionais',
              ]}
              totalCents={66000}
            />
          </div>
        </div>
      </div>

      {/* COMPARISON */}
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tighter mb-2">Por que o Estetia é diferente</h2>
          <p className="text-sm text-muted-foreground">Comparativo com os principais sistemas de gestão de clínicas no Brasil</p>
        </div>
        <CompetitorComparison />
        <p className="text-xs text-muted-foreground text-center mt-4">
          Comparativo baseado em informações públicas dos sites dos concorrentes em maio/2026. Sujeito a alterações.
        </p>
      </div>

      {/* FAQ */}
      <div className="border-t border-border/40 bg-muted/20">
        <div className="max-w-3xl mx-auto px-6 py-14">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter mb-2">Perguntas frequentes</h2>
            <p className="text-sm text-muted-foreground">Tudo que você precisa saber antes de começar</p>
          </div>
          <FaqPricing />
        </div>
      </div>
    </div>
  )
}
