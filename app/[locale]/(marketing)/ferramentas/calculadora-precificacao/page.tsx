import { Metadata } from 'next'
import Script from 'next/script'
import { setRequestLocale } from 'next-intl/server'
import { buildLocaleAlternates } from '@/lib/seo/canonical'
import { CalculadoraPrecificacao } from '@/components/calculadoras/calculadora-precificacao'
import { Link } from '@/i18n/routing'
import { ArrowRight, DollarSign, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const alternates = buildLocaleAlternates(locale, '/ferramentas/calculadora-precificacao', '/tools/pricing-calculator')
  return {
    title: 'Calculadora de Precificação de Procedimento | Estetia CRM',
    description: 'Calcule o preço mínimo, sugerido e premium para seus procedimentos estéticos com base em custos reais. Precifique com confiança.',
    alternates,
    openGraph: {
      title: 'Calculadora de Precificação — Estetia CRM',
      description: 'Defina o preço correto para seus procedimentos. Preço mínimo, sugerido e premium em segundos.',
      url: alternates.canonical,
    },
  }
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://estetiacrm.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Ferramentas', item: 'https://estetiacrm.com.br/ferramentas' },
    { '@type': 'ListItem', position: 3, name: 'Calculadora de Precificação', item: 'https://estetiacrm.com.br/ferramentas/calculadora-precificacao' },
  ],
}

const PRICING_TIPS = [
  { emoji: '⚠️', title: 'Cuidado com subprecificação', tip: 'Cobrar abaixo do custo real é o erro mais comum em clínicas. Inclua sempre TODOS os custos fixos rateados na sua hora de atendimento.' },
  { emoji: '💡', title: 'Agregue valor e cobre premium', tip: 'O preço premium não é apenas mais caro — é percepção de excelência. Um ambiente VIP, acompanhamento pré/pós e fotos evolutivas justificam a alta.' },
  { emoji: '📊', title: 'Reajustes sistemáticos', tip: 'Reajuste seus valores pelo menos uma vez por ano. Insumos e custos operacionais fixos sobem constantemente — seu faturamento precisa acompanhar.' },
]

export default async function CalculadoraPrecificacaoPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <Script
        id="breadcrumb-precificacao"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="bg-[#EEF0F8] dark:bg-slate-950 min-h-screen relative overflow-hidden selection:bg-[#0A1F3D]/20 selection:text-[#0A1F3D]">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-gradient-to-br from-[#0A1F3D]/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-[#C5A059]/10 to-transparent rounded-full blur-[100px] pointer-events-none" />

        {/* Hero */}
        <section className="relative bg-[#0A1F3D] text-white py-24 px-6 overflow-hidden border-b border-white/5">
          {/* Subtle Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
          
          <div className="relative mx-auto max-w-4xl text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-6 text-xs font-semibold uppercase tracking-[0.25em]">
              <Link href="/ferramentas" className="text-white/40 hover:text-white/70 transition-colors">Ferramentas</Link>
              <span className="text-white/20">›</span>
              <span className="text-[#C5A059] font-bold">Calculadora de Precificação</span>
            </div>
            
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/10 px-4 py-1.5 text-xs font-semibold text-[#C5A059] mb-6 backdrop-blur-md">
              <DollarSign className="h-3.5 w-3.5" />
              Calculadora gratuita de margem de lucro
            </div>
            
            <h1 className="font-serif font-normal text-white leading-[1.1] mb-6 tracking-tight" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              Defina o preço certo<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#E2C384] to-[#C5A059] font-bold">sem adivinhar</span>
            </h1>
            
            <p className="text-white/60 text-lg max-w-2xl leading-relaxed">
              Calcule com precisão cirúrgica o preço mínimo, sugerido e premium para qualquer procedimento clínico com base nos seus custos e margens de lucro reais.
            </p>
          </div>
        </section>

        {/* Warning strip (capsule pill of prestige) */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 -mt-6">
          <div className="rounded-2xl border border-amber-500/25 bg-amber-50/90 dark:bg-amber-950/20 backdrop-blur-md p-4 shadow-lg shadow-slate-200/20 dark:shadow-none">
            <div className="flex items-start gap-3">
              <div className="p-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                <AlertCircle className="h-4.5 w-4.5" />
              </div>
              <p className="text-[11px] text-amber-800 dark:text-amber-200 leading-normal font-semibold">
                Nota Metodológica: Esta ferramenta gera referências financeiras com base nas premissas imputadas por você. 
                Os resultados operacionais servem de balizamento — certifique-se de validar seus custos com seu contador e comparar com o mercado local.
              </p>
            </div>
          </div>
        </div>

        {/* Calculator */}
        <section className="relative py-16 px-6 z-10">
          <div className="mx-auto max-w-6xl">
            <CalculadoraPrecificacao />
          </div>
        </section>

        {/* Tips */}
        <section className="py-20 px-6 bg-white dark:bg-slate-900/60 border-t border-b border-[#0A1F3D]/5 dark:border-white/5 relative">
          <div className="mx-auto max-w-4xl">
            <div className="text-center max-w-xl mx-auto mb-14">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#0A1F3D]/10 dark:bg-white/10 text-xs font-bold text-[#0A1F3D] dark:text-slate-200 px-3.5 py-1 mb-3">
                <DollarSign className="h-3.5 w-3.5 text-[#C5A059]" />
                Finanças Clínicas
              </div>
              <h2 className="font-serif text-[#0A1F3D] dark:text-white text-3xl font-normal leading-tight">
                Diretrizes de Precificação para <span className="text-[#C5A059] font-bold">Clínicas de Elite</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {PRICING_TIPS.map(({ emoji, title, tip }) => (
                <div key={emoji} className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-[#F8FAFC]/50 dark:bg-slate-900/30 p-6 hover:border-[#C5A059]/30 hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300 group">
                  <div className="text-3xl mb-4 transform group-hover:scale-110 transition-transform duration-300 inline-block">{emoji}</div>
                  <h3 className="font-bold text-base text-[#0A1F3D] dark:text-white mb-2">{title}</h3>
                  <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed font-medium">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-24 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-[#0A1F3D] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(197,160,89,0.12),transparent_50%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

          <div className="relative mx-auto max-w-2xl text-center text-white">
            <div className="flex items-center justify-center gap-1.5 mb-6">
              <span className="p-1 rounded-full bg-[#C5A059]/20 text-[#C5A059]">
                <Sparkles className="h-4.5 w-4.5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">Auditoria e Fluxo Financeiro</span>
            </div>
            
            <h2 className="font-serif text-3xl md:text-4xl font-normal mb-4 leading-tight">
              Tenha o controle total do <span className="font-bold border-b-2 border-[#C5A059]/40 pb-1">financeiro da sua clínica</span>
            </h2>
            <p className="text-white/60 max-w-md mx-auto mb-10 text-sm leading-relaxed">
              DRE detalhado, repasses de comissões, faturamento TISS e controle de estoque de insumos integrados. Esqueça as planilhas manuais.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href={"/features/financeiro-tiss" as any}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#C5A059] px-8 py-4 font-bold text-sm text-[#0A1F3D] shadow-xl shadow-[#C5A059]/10 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 w-full sm:w-auto"
              >
                Conhecer o módulo Financeiro
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 px-8 py-4 font-semibold text-sm text-white/90 hover:text-white hover:border-white/40 active:scale-[0.98] transition-all duration-300 w-full sm:w-auto backdrop-blur-sm"
              >
                Testar grátis por 14 dias
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
