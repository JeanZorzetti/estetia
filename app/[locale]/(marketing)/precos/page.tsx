import Link from 'next/link'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { PricingBuilder } from '@/components/pricing/pricing-builder'
import { ScenarioCard } from '@/components/pricing/scenario-card'
import { CompetitorComparison } from '@/components/pricing/competitor-comparison'
import { FaqPricing } from '@/components/pricing/faq-pricing'
import { Button } from '@/components/ui/button'
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Preços transparentes — Estetia | Monte seu plano modular',
  description: 'Calcule o preço do Estetia em tempo real. Pague apenas pelos módulos que sua clínica de estética usa. A partir de R$ 39/mês.',
}

export default async function PrecosPage() {
  const modules = await prisma.pricingModule.findMany({
    where: { ativo: true },
    orderBy: [{ category: 'asc' }, { ordem: 'asc' }],
  })

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

  return (
    <main className="min-h-screen bg-background">
      {/* HERO */}
      <section className="border-b border-border/40 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center text-center gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
            <Sparkles className="w-3.5 h-3.5" />
            Preços 100% transparentes — calculados ao vivo
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter max-w-4xl">
            Monte o seu Estetia.
            <br />
            <span className="text-primary">Pague só pelo que usar.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Diferente dos concorrentes, mostramos cada preço por feature. Marque os módulos que sua clínica precisa, ajuste capacidade e veja o total atualizar em tempo real.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> 7 dias grátis</span>
            <span>·</span>
            <span>Sem fidelidade</span>
            <span>·</span>
            <span>Cancele a qualquer momento</span>
          </div>
        </div>
      </section>

      {/* BUILDER */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <PricingBuilder
          modules={modulesTyped}
          initialSelectedSlugs={['base', 'prontuario', 'whatsapp_evolution']}
          ctaLabel="Começar 7 dias grátis"
          ctaHref="/register"
        />
      </section>

      {/* SCENARIOS */}
      <section className="border-t border-border/40 bg-muted/20">
        <div className="max-w-6xl mx-auto px-6 py-16">
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
      </section>

      {/* COMPARISON */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tighter mb-2">Por que o Estetia é diferente</h2>
          <p className="text-sm text-muted-foreground">Comparativo com os principais sistemas de gestão de clínicas no Brasil</p>
        </div>
        <CompetitorComparison />
        <p className="text-xs text-muted-foreground text-center mt-4">
          Comparativo baseado em informações públicas dos sites dos concorrentes em maio/2026. Sujeito a alterações.
        </p>
      </section>

      {/* FAQ */}
      <section className="border-t border-border/40 bg-muted/20">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter mb-2">Perguntas frequentes</h2>
            <p className="text-sm text-muted-foreground">Tudo que você precisa saber antes de começar</p>
          </div>
          <FaqPricing />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-border/40">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center flex flex-col items-center gap-6">
          <h2 className="text-4xl font-bold tracking-tighter">
            Comece grátis em 30 segundos.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            7 dias para testar todos os módulos. Sem cartão de crédito. Sem compromisso.
          </p>
          <Link href="/register">
            <Button size="lg" className="gap-2">
              Começar agora
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
