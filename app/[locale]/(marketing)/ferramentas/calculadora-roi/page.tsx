import { Metadata } from 'next'
import Script from 'next/script'
import { getTranslations } from 'next-intl/server'
import { buildLocaleAlternates } from '@/lib/seo/canonical'
import { CalculadoraROIClinica } from '@/components/calculadoras/calculadora-roi-clinica'
import { Link } from '@/i18n/routing'
import { ArrowRight, TrendingUp, Clock, Users, CheckCircle2 } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'marketing.ferramentas.calculadoraRoi.meta' })
  const alternates = buildLocaleAlternates(locale, '/ferramentas/calculadora-roi', '/tools/roi-calculator')
  return {
    title: t('title'),
    description: t('description'),
    alternates,
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url: alternates.canonical,
    },
    twitter: {
      card: 'summary_large_image',
      title: t('ogTitle'),
      description: t('ogDescription'),
    },
  }
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://estetiacrm.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Ferramentas', item: 'https://estetiacrm.com.br/ferramentas' },
    { '@type': 'ListItem', position: 3, name: 'Calculadora ROI para Clínicas', item: 'https://estetiacrm.com.br/ferramentas/calculadora-roi' },
  ],
}

const STATS = [
  { icon: TrendingUp, value: '+15%', label: 'retorno médio com recall ativo' },
  { icon: Clock, value: '-70%', label: 'redução de no-shows confirmados' },
  { icon: Users, value: '+120', label: 'clínicas gerenciadas no Estetia' },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Informe seus dados atuais', desc: 'Volume de atendimentos, ticket médio, taxa de retorno e no-show.' },
  { step: '02', title: 'Calculamos a perda atual', desc: 'Revelamos quanto você perde por mês com faltas e pacientes que não retornam.' },
  { step: '03', title: 'Projetamos com Estetia', desc: 'Estimativa conservadora: -70% no-show, +15% retorno com automação de recall.' },
  { step: '04', title: 'Veja o ganho potencial', desc: 'Diferença anual entre a receita atual e a projetada com gestão inteligente.' },
]

export default function CalculadoraROIPage() {
  return (
    <>
      <Script
        id="breadcrumb-calculadora-roi"
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
              <span className="text-[#489FB5]">Calculadora ROI</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#489FB5]/30 bg-[#489FB5]/10 px-3 py-1 text-xs font-semibold text-[#489FB5] mb-5">
              <TrendingUp className="h-3.5 w-3.5" />
              Calculadora gratuita
            </div>
            <h1 className="font-serif text-white leading-tight mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Quanto dinheiro sua clínica pode<br />
              <span className="text-[#489FB5]">faturar a mais</span> todo mês?
            </h1>
            <p className="text-white/60 text-lg max-w-2xl">
              Calcule em 30 segundos o impacto financeiro de reduzir no-shows e aumentar a taxa de retorno dos seus pacientes.
            </p>
          </div>
        </section>

        {/* Stats strip */}
        <div className="border-b border-[#0A1F3D]/8 bg-white">
          <div className="mx-auto max-w-4xl px-6 py-5 grid grid-cols-3 gap-4">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-[#489FB5]/10 flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-[#489FB5]" />
                </div>
                <div>
                  <div className="font-bold text-[#0A1F3D] text-lg leading-none">{value}</div>
                  <div className="text-[10px] text-[#64748B]">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculator */}
        <section className="py-16 px-6">
          <div className="mx-auto max-w-5xl">
            <CalculadoraROIClinica />
          </div>
        </section>

        {/* How it works */}
        <section className="py-14 px-6 bg-white">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-serif text-[#0A1F3D] text-2xl font-bold text-center mb-10">Como a calculadora funciona</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {HOW_IT_WORKS.map(({ step, title, desc }) => (
                <div key={step} className="relative">
                  <div className="text-4xl font-bold text-[#489FB5]/15 mb-2">{step}</div>
                  <h3 className="font-bold text-sm text-[#0A1F3D] mb-1">{title}</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-8 px-6">
          <div className="mx-auto max-w-3xl rounded-2xl border border-[#0A1F3D]/8 bg-white p-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-xs text-[#64748B] leading-relaxed">
                <strong className="text-[#0A1F3D]">Metodologia conservadora:</strong>{' '}
                Os cálculos usam premissas conservadoras baseadas em dados reais de clínicas clientes do Estetia.
                A redução de no-show de 70% e o aumento de 15% no retorno representam resultados comuns — não os casos extremos.
                Resultados variam por segmento, localização e implementação.
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6 bg-[#0A1F3D] text-white text-center">
          <div className="mx-auto max-w-xl">
            <h2 className="font-serif text-2xl font-bold mb-3">Quer ver na prática?</h2>
            <p className="text-white/60 mb-8">Teste o Estetia por 14 dias sem compromisso. Agenda, recall e WhatsApp integrados.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#489FB5] px-8 py-3.5 font-bold text-sm text-white hover:opacity-90 transition-opacity"
              >
                Começar grátis agora
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/ferramentas"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-8 py-3.5 font-semibold text-sm text-white/70 hover:text-white hover:border-white/40 transition-colors"
              >
                Ver outras ferramentas
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
