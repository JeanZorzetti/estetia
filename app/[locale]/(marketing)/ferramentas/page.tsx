import { Metadata } from 'next'
import Script from 'next/script'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildLocaleAlternates } from '@/lib/seo/canonical'
import { Link } from '@/i18n/routing'
import { ArrowRight, TrendingUp, Clock, Users, DollarSign, Zap } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'marketing.ferramentas.meta' })
  const alternates = buildLocaleAlternates(locale, '/ferramentas', '/tools')
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

const TOOLS = [
  {
    href: '/ferramentas/calculadora-roi',
    icon: TrendingUp,
    color: '#489FB5',
    label: 'Calculadora ROI',
    title: 'Calculadora ROI para Clínicas de Estética',
    description: 'Descubra quanto sua clínica pode faturar a mais com gestão inteligente de agenda e retenção de pacientes.',
    badge: 'Mais usada',
  },
  {
    href: '/ferramentas/calculadora-no-show',
    icon: Clock,
    color: '#E05A4E',
    label: 'No-Show',
    title: 'Calculadora de Custo de No-Show',
    description: 'Calcule quanto dinheiro sua clínica perde por mês com faltas sem aviso. Veja o impacto real do recall automático.',
    badge: null,
  },
  {
    href: '/ferramentas/calculadora-ltv',
    icon: Users,
    color: '#C5A059',
    label: 'LTV',
    title: 'Calculadora de LTV do Paciente',
    description: 'Calcule o valor real de cada paciente ao longo do tempo e descubra quanto vale investir em retenção.',
    badge: null,
  },
  {
    href: '/ferramentas/calculadora-precificacao',
    icon: DollarSign,
    color: '#0A1F3D',
    label: 'Precificação',
    title: 'Calculadora de Precificação de Procedimento',
    description: 'Defina preço mínimo, sugerido e premium para seus procedimentos com base em custos reais e margem desejada.',
    badge: null,
  },
  {
    href: '/ferramentas/avaliacao-maturidade-digital',
    icon: Zap,
    color: '#489FB5',
    label: 'Quiz',
    title: 'Avaliação de Maturidade Digital',
    description: 'Quiz de 10 perguntas que avalia o nível digital da sua clínica e entrega recomendações personalizadas.',
    badge: 'Quiz',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://estetiacrm.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Ferramentas', item: 'https://estetiacrm.com.br/ferramentas' },
  ],
}

export default async function FerramentasPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <Script
        id="breadcrumb-ferramentas"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="bg-[#EEF0F8] min-h-screen">
        {/* Hero */}
        <section className="bg-[#0A1F3D] text-white py-20 px-6 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs font-semibold text-white/70 mb-5">
              Ferramentas gratuitas para clínicas
            </div>
            <h1 className="font-serif text-white leading-tight mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Ferramentas que ajudam sua clínica<br />
              a <span className="text-[#C5A059]">crescer com dados</span>
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              5 calculadoras e avaliações gratuitas, desenvolvidas especificamente para clínicas de estética e saúde.
              Sem cadastro — resultado imediato.
            </p>
          </div>
        </section>

        {/* Tools grid */}
        <section className="py-16 px-6">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {TOOLS.map(({ href, icon: Icon, color, label, title, description, badge }) => (
                <Link
                  key={href}
                  href={href as any}
                  className="group relative rounded-2xl border border-[#0A1F3D]/8 bg-white p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                >
                  {badge && (
                    <span
                      className="absolute top-4 right-4 rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                      style={{ backgroundColor: color }}
                    >
                      {badge}
                    </span>
                  )}

                  {/* Top border accent */}
                  <div className="absolute top-0 left-6 right-6 h-0.5 rounded-b-full transition-all duration-200 group-hover:left-4 group-hover:right-4"
                    style={{ backgroundColor: color }} />

                  <div
                    className="h-11 w-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${color}15` }}
                  >
                    <Icon className="h-5 w-5" style={{ color }} />
                  </div>

                  <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color }}>
                    {label}
                  </div>
                  <h2 className="font-serif text-[#0A1F3D] font-bold text-base leading-snug mb-2 group-hover:text-opacity-80 transition-colors">
                    {title}
                  </h2>
                  <p className="text-xs text-[#64748B] leading-relaxed mb-4">{description}</p>

                  <div
                    className="inline-flex items-center gap-1 text-xs font-semibold transition-all group-hover:gap-2"
                    style={{ color }}
                  >
                    Acessar ferramenta
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              ))}

              {/* Anuário card */}
              <Link
                href="/anuario"
                className="group relative rounded-2xl border border-dashed border-[#0A1F3D]/15 bg-[#F8FAFC] p-6 hover:border-[#0A1F3D]/30 hover:bg-white transition-all duration-200 flex flex-col justify-center"
              >
                <div className="text-2xl mb-3">📊</div>
                <h2 className="font-serif text-[#0A1F3D] font-bold text-base leading-snug mb-2">
                  Anuário da Estética 2026
                </h2>
                <p className="text-xs text-[#64748B] leading-relaxed mb-4">
                  Benchmarks do setor: ticket médio, taxa de retorno, no-show e tendências. Dados reais de +120 clínicas.
                </p>
                <div className="inline-flex items-center gap-1 text-xs font-semibold text-[#64748B] group-hover:text-[#0A1F3D] transition-colors">
                  Ver anuário
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 px-6 text-center">
          <div className="mx-auto max-w-xl">
            <h2 className="font-serif text-[#0A1F3D] text-2xl font-bold mb-3">
              Mais do que calculadoras — um sistema completo
            </h2>
            <p className="text-[#64748B] mb-8">
              O Estetia reúne todas as funcionalidades que você calculou aqui: agenda inteligente, recall automático, prontuário digital e muito mais.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A1F3D] px-8 py-3.5 font-bold text-sm text-white hover:bg-[#0A1F3D]/90 transition-colors"
            >
              Testar grátis por 14 dias
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
