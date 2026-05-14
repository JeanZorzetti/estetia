import { Metadata } from 'next'
import Script from 'next/script'
import { buildLocaleAlternates } from '@/lib/seo/canonical'
import { CalculadoraPrecificacao } from '@/components/calculadoras/calculadora-precificacao'
import { Link } from '@/i18n/routing'
import { ArrowRight, DollarSign, AlertCircle } from 'lucide-react'

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
  { emoji: '⚠️', tip: 'Cobrar abaixo do custo real é o erro mais comum em clínicas. Inclua TODOS os custos fixos rateados.' },
  { emoji: '💡', tip: 'Preço premium não é apenas mais caro — é percepção de valor. Ambiente, atendimento e fotos evolutivas justificam.' },
  { emoji: '📊', tip: 'Reajuste seus preços pelo menos uma vez por ano. Insumos e custos fixos sobem — sua tabela precisa acompanhar.' },
]

export default function CalculadoraPrecificacaoPage() {
  return (
    <>
      <Script
        id="breadcrumb-precificacao"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="bg-[#EEF0F8] min-h-screen">
        {/* Hero */}
        <section className="bg-[#0A1F3D] text-white py-16 px-6">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-[0.2em]">
              <Link href="/ferramentas" className="text-white/40 hover:text-white/70 transition-colors">Ferramentas</Link>
              <span className="text-white/20">›</span>
              <span className="text-[#C5A059]">Calculadora de Precificação</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/10 px-3 py-1 text-xs font-semibold text-[#C5A059] mb-5">
              <DollarSign className="h-3.5 w-3.5" />
              Calculadora gratuita
            </div>
            <h1 className="font-serif text-white leading-tight mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Defina o preço certo<br />
              <span className="text-[#C5A059]">sem adivinhar</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl">
              Calcule preço mínimo, sugerido e premium para qualquer procedimento com base nos seus custos reais.
              Pare de cobrar menos do que deveria.
            </p>
          </div>
        </section>

        {/* Warning strip */}
        <div className="border-b border-[#0A1F3D]/8 bg-amber-50">
          <div className="mx-auto max-w-4xl px-6 py-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                <strong>Atenção:</strong> Esta calculadora fornece estimativas baseadas nos dados que você inserir.
                Os resultados são indicativos — valide sempre com os preços praticados na sua região e com um contador.
              </p>
            </div>
          </div>
        </div>

        {/* Calculator */}
        <section className="py-16 px-6">
          <div className="mx-auto max-w-6xl">
            <CalculadoraPrecificacao />
          </div>
        </section>

        {/* Tips */}
        <section className="py-14 px-6 bg-white">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-serif text-[#0A1F3D] text-2xl font-bold text-center mb-10">Dicas de precificação para clínicas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {PRICING_TIPS.map(({ emoji, tip }) => (
                <div key={emoji} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                  <div className="text-2xl mb-3">{emoji}</div>
                  <p className="text-sm text-[#64748B] leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6 bg-[#0A1F3D] text-white text-center">
          <div className="mx-auto max-w-xl">
            <h2 className="font-serif text-2xl font-bold mb-3">Controle o financeiro da sua clínica</h2>
            <p className="text-white/60 mb-8">DRE, fluxo de caixa e comissões integrados ao sistema clínico. Sem planilha manual.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={"/features/financeiro-tiss" as any}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C5A059] px-8 py-3.5 font-bold text-sm text-[#0A1F3D] hover:opacity-90 transition-opacity"
              >
                Ver módulo Financeiro
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-8 py-3.5 font-semibold text-sm text-white/70 hover:text-white hover:border-white/40 transition-colors"
              >
                Testar grátis 14 dias
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
