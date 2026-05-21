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
        <section className="relative overflow-hidden bg-[#0A1F3D] text-white py-24 px-6">
          {/* Luzes decorativas / halos estelares */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-[#489FB5]/10 blur-[100px] pointer-events-none" />
          <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#C5A059]/5 blur-[120px] pointer-events-none" />
          
          {/* Grade geométrica fina de fundo */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

          <div className="relative mx-auto max-w-4xl text-center">
            <div className="flex items-center justify-center gap-2 mb-6 text-xs font-semibold uppercase tracking-[0.25em]">
              <Link href="/ferramentas" className="text-white/40 hover:text-white/70 transition-colors">Ferramentas</Link>
              <span className="text-white/20">›</span>
              <span className="text-[#489FB5]">Calculadora ROI</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#489FB5]/30 bg-[#489FB5]/10 px-4 py-1.5 text-xs font-medium text-[#489FB5] mb-8 shadow-[0_0_15px_rgba(72,159,181,0.15)] animate-pulse">
              <TrendingUp className="h-3.5 w-3.5 text-[#489FB5]" />
              Simulador Financeiro Gratuito
            </div>
            <h1 className="font-serif text-white leading-tight mb-6" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)' }}>
              Quanto faturamento sua clínica está<br />
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#489FB5] via-[#C5A059] to-[#489FB5] bg-[length:200%_auto]">
                deixando para trás
              </span> todo mês?
            </h1>
            <p className="text-white/75 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
              Descubra em 30 segundos o retorno financeiro oculto de reduzir faltas e automatizar o recall dos seus pacientes de forma inteligente.
            </p>
          </div>
        </section>

        {/* Stats strip */}
        <div className="relative z-10 -mt-8 max-w-5xl mx-auto px-6">
          <div className="bg-white/90 backdrop-blur-xl border border-white/50 shadow-[0_20px_50px_rgba(10,31,61,0.08)] rounded-3xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-4 py-4 md:py-0 md:px-6 first:pl-0 last:pr-0 transition-transform duration-300 hover:scale-[1.02]">
                <div className="h-12 w-12 rounded-2xl bg-[#489FB5]/10 flex items-center justify-center shrink-0 border border-[#489FB5]/15 shadow-inner">
                  <Icon className="h-5 w-5 text-[#489FB5]" />
                </div>
                <div>
                  <div className="font-serif text-3xl font-bold text-[#0A1F3D] leading-none mb-1">{value}</div>
                  <div className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculator */}
        <section className="py-20 px-6 relative overflow-hidden bg-gradient-to-b from-[#F5F7FA] to-[#EBEFF5]">
          <div className="absolute top-1/4 right-0 w-[450px] h-[450px] rounded-full bg-[#489FB5]/5 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 left-0 w-[450px] h-[450px] rounded-full bg-[#C5A059]/5 blur-[120px] pointer-events-none" />
          <div className="mx-auto max-w-6xl">
            <CalculadoraROIClinica />
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 px-6 bg-white relative overflow-hidden">
          {/* Detalhe estético de fundo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#489FB5]/3 rounded-full blur-[150px] pointer-events-none" />

          <div className="mx-auto max-w-5xl relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-serif text-[#0A1F3D] text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Transparência e Rigor Metodológico
              </h2>
              <p className="text-slate-500 text-sm md:text-base">
                Entenda a engenharia financeira por trás de cada projeção de lucro calculada pelo nosso simulador.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {HOW_IT_WORKS.map(({ step, title, desc }) => (
                <div key={step} className="relative group p-6 rounded-3xl bg-slate-50/50 border border-slate-100 hover:border-[#489FB5]/20 hover:bg-white hover:shadow-[0_15px_30px_rgba(72,159,181,0.05)] transition-all duration-300">
                  <div className="text-5xl font-serif font-black text-slate-200 group-hover:text-[#489FB5]/10 mb-4 transition-colors duration-300">
                    {step}
                  </div>
                  <h3 className="font-bold text-base text-[#0A1F3D] mb-2 group-hover:text-[#489FB5] transition-colors duration-300">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-12 px-6 bg-gradient-to-b from-white to-[#F5F7FA]">
          <div className="mx-auto max-w-4xl rounded-3xl border border-[#C5A059]/20 bg-gradient-to-r from-amber-50/20 via-white to-amber-50/10 p-6 md:p-8 shadow-[0_10px_30px_rgba(197,160,89,0.03)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#C5A059]/3 rounded-full blur-2xl pointer-events-none" />
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-[#C5A059]/10 flex items-center justify-center shrink-0 border border-[#C5A059]/15">
                <CheckCircle2 className="h-5 w-5 text-[#C5A059]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-[#0A1F3D] tracking-wide uppercase">Garantia de Rigor e Metodologia Conservadora</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Os algoritmos deste simulador aplicam fórmulas prudentes e realistas amparadas no histórico analítico real de clínicas que operam com o <strong className="text-[#0A1F3D]">Estetia CRM</strong>. A taxa projetada de redução de no-show (-70%) e o aumento de retorno de pacientes (+15%) são médias baseadas em métricas reais consolidadas de desempenho. O retorno financeiro exato pode variar por região, segmento específico e eficácia operacional.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-[#0A1F3D] text-white py-24 px-6">
          {/* Halos estelares de fundo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#C5A059]/10 blur-[130px] pointer-events-none" />
          <div className="absolute bottom-0 right-10 w-[300px] h-[300px] rounded-full bg-[#489FB5]/5 blur-[100px] pointer-events-none" />

          {/* Linha fina dourada superior decorativa */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent" />

          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 tracking-tight leading-tight">
              Pronto para recuperar o faturamento que sua clínica está perdendo?
            </h2>
            <p className="text-white/70 text-base md:text-lg mb-10 max-w-xl mx-auto font-light leading-relaxed">
              Faça como centenas de clínicas de elite e automatize seu agendamento, recall de pacientes e CRM de estética. Teste por 14 dias sem compromisso.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#489FB5] px-8 py-4 font-bold text-sm text-white hover:bg-[#3b8599] active:scale-[0.98] transition-all shadow-[0_10px_25px_rgba(72,159,181,0.25)]"
              >
                Começar Teste Gratuito de 14 Dias
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/ferramentas"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 px-8 py-4 font-semibold text-sm text-white/80 hover:text-white hover:bg-white/5 hover:border-white/30 transition-all"
              >
                Ver Outras Ferramentas
              </Link>
            </div>
            
            <div className="mt-8 text-xs text-white/40 flex items-center justify-center gap-3">
              <span>✓ Sem cartão de crédito</span>
              <span>•</span>
              <span>✓ Configuração em 5 minutos</span>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
