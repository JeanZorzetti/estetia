import Link from 'next/link'
import { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { prisma } from '@/lib/prisma'
import { PricingBuilder } from '@/components/pricing/pricing-builder'
import { ScenarioCard } from '@/components/pricing/scenario-card'
import { CompetitorComparison } from '@/components/pricing/competitor-comparison'
import { FaqPricing } from '@/components/pricing/faq-pricing'
import { Button } from '@/components/ui/button'
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react'
import logger from '@/lib/logger'

// ISR: rendered statically and revalidated hourly. The pricing modules change
// rarely, so we keep the Prisma query off the per-request crawl path (was
// `force-dynamic`, which forced a DB hit on every Googlebot visit → 5-6s spikes).
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Preços transparentes — Estetia | Monte seu plano modular',
  description: 'Calcule o preço do Estetia em tempo real. Pague apenas pelos módulos que sua clínica de estética usa. A partir de R$ 39/mês.',
}

export default async function PrecosPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  // This page is ISR (revalidate above). At build time inside Docker there is
  // no DATABASE_URL, so the query would throw a PrismaClientInitializationError
  // and ABORT the whole build (no try/catch = fatal, unlike blog/[slug] whose
  // helper swallows it). Guard it: build prerenders with [] (empty), then the
  // first runtime request — where the DB is reachable — revalidates and fills
  // the real modules. See memory: SSG/ISR + DB query at build time.
  let modules: Awaited<ReturnType<typeof prisma.pricingModule.findMany>> = []
  try {
    modules = await prisma.pricingModule.findMany({
      where: { ativo: true },
      orderBy: [{ category: 'asc' }, { ordem: 'asc' }],
    })
  } catch (error) {
    logger.error({ error }, '[PrecosPage] pricingModule.findMany failed (expected at build time without DB):')
  }

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
    <main className="min-h-screen bg-white text-[#0A1F3D] dark:bg-slate-950 dark:text-slate-100 relative overflow-hidden">
      {/* ════════════════════════════════════════════════════════════
          GLOWS & PATTERNS BACKGROUND
         ════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:16px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none" />
      
      {/* Floating gradient glows */}
      <div className="absolute top-[-5%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[130px] opacity-35 pointer-events-none bg-gradient-to-br from-[#489FB5]/10 to-transparent" />
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[140px] opacity-25 pointer-events-none bg-gradient-to-br from-[#C5A059]/10 to-transparent" />
      <div className="absolute bottom-[5%] left-[-15%] w-[600px] h-[600px] rounded-full blur-[140px] opacity-20 pointer-events-none bg-gradient-to-br from-violet-500/10 to-transparent" />

      {/* HERO */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 z-10">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 flex flex-col items-center text-center gap-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/25 bg-[#C5A059]/5 px-3.5 py-1 text-xs font-bold text-[#C5A059] mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059] animate-pulse" />
            Preços 100% transparentes — calculados ao vivo
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight text-[#0A1F3D] dark:text-white leading-[1.1] max-w-4xl">
            Monte o seu Estetia.
            <br />
            <span className="text-[#C5A059]">Pague só pelo que usar.</span>
          </h1>
          <p className="font-sans text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Diferente dos concorrentes, mostramos cada preço por recurso. Escolha os módulos que sua clínica precisa, ajuste a capacidade e veja o total atualizar em tempo real.
          </p>
          <div className="flex items-center gap-4 text-xs font-bold text-slate-400 dark:text-slate-500 mt-2">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-[#489FB5]" /> 7 dias grátis</span>
            <span className="h-1.5 w-1.5 rounded-full bg-slate-200 dark:bg-slate-800" />
            <span>Sem fidelidade</span>
            <span className="h-1.5 w-1.5 rounded-full bg-slate-200 dark:bg-slate-800" />
            <span>Cancele a qualquer momento</span>
          </div>
        </div>
      </section>

      {/* BUILDER */}
      <section className="max-w-6xl mx-auto px-6 pb-24 relative z-10">
        <PricingBuilder
          modules={modulesTyped}
          initialSelectedSlugs={['base', 'prontuario', 'whatsapp_evolution']}
          ctaLabel="Começar 7 dias grátis"
          ctaHref="/register"
        />
      </section>

      {/* SCENARIOS */}
      <section className="border-t border-slate-100 dark:border-slate-900 bg-slate-50/20 py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="h-px w-6 bg-[#C5A059]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#C5A059]">Casos de Uso</span>
              <div className="h-px w-6 bg-[#C5A059]" />
            </div>
            <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl text-[#0A1F3D] dark:text-white mb-2">
              Exemplos de combinações reais
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Veja quanto outras clínicas pagam por mês de acordo com a sua complexidade
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      <section className="max-w-6xl mx-auto px-6 py-24 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="h-px w-6 bg-[#489FB5]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#489FB5]">Transparência</span>
            <div className="h-px w-6 bg-[#489FB5]" />
          </div>
          <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl text-[#0A1F3D] dark:text-white mb-2">
            Por que o Estetia é diferente
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Comparativo real com os principais sistemas de gestão de clínicas no Brasil
          </p>
        </div>
        <CompetitorComparison />
        <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-6">
          Comparativo baseado em informações públicas dos sites dos concorrentes em maio/2026. Sujeito a alterações periódicas.
        </p>
      </section>

      {/* FAQ */}
      <section className="border-t border-slate-100 dark:border-slate-900 bg-slate-50/20 py-24 relative z-10">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="h-px w-6 bg-[#C5A059]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#C5A059]">Suporte</span>
              <div className="h-px w-6 bg-[#C5A059]" />
            </div>
            <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl text-[#0A1F3D] dark:text-white mb-2">
              Perguntas Frequentes
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Tudo o que você precisa saber antes de contratar o seu plano modular
            </p>
          </div>
          <FaqPricing />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 border-t border-slate-100 dark:border-slate-900 bg-slate-50/40 dark:bg-slate-900/10 relative overflow-hidden z-10">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white p-10 sm:p-14 text-center shadow-2xl shadow-[#0A1F3D]/5 dark:border-slate-800 dark:bg-slate-900">
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[110px] opacity-15 pointer-events-none bg-[#489FB5]" />
            <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full blur-[90px] opacity-10 pointer-events-none bg-[#C5A059]" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/5 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-6">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium">Teste sem compromisso</span>
              </div>

              <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl text-[#0A1F3D] dark:text-white mb-4">
                Comece grátis em 30 segundos
              </h2>
              
              <p className="mt-4 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                7 dias para testar todos os módulos. Sem cartão de crédito. Sem contratos de fidelidade.
              </p>
              
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="h-12 px-8 text-base bg-[#0A1F3D] hover:bg-[#162D54] text-white shadow-xl shadow-[#0A1F3D]/25 rounded-xl transition-all hover:-translate-y-0.5 dark:bg-[#C5A059] dark:text-[#0A1F3D] dark:hover:bg-[#b8913f] dark:shadow-[#C5A059]/10">
                  <Link href="/register">
                    Começar Grátis Agora
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base border-slate-200 text-[#0A1F3D] hover:bg-slate-50 rounded-xl transition-all hover:-translate-y-0.5 dark:border-slate-800 dark:text-white dark:hover:bg-slate-900">
                  <Link href="/contact">Falar com Consultor</Link>
                </Button>
              </div>
              
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Sem cartão de crédito
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-slate-200 dark:bg-slate-800" />
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Configuração em 5 minutos
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
