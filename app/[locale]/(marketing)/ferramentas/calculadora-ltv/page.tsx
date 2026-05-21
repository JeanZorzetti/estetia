import { Metadata } from 'next'
import Script from 'next/script'
import { buildLocaleAlternates } from '@/lib/seo/canonical'
import { CalculadoraLTV } from '@/components/calculadoras/calculadora-ltv'
import { Link } from '@/i18n/routing'
import { ArrowRight, Users, Sparkles, TrendingUp, Info } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const alternates = buildLocaleAlternates(locale, '/ferramentas/calculadora-ltv', '/tools/ltv-calculator')
  return {
    title: 'Calculadora de LTV do Cliente | Estetia CRM',
    description: 'Calcule o Lifetime Value dos pacientes da sua clínica. Descubra quanto vale cada cliente ao longo do tempo e quanto investir em retenção.',
    alternates,
    openGraph: {
      title: 'Calculadora de LTV do Paciente — Estetia CRM',
      description: 'Descubra o valor real de cada paciente ao longo do tempo e otimize seus investimentos em retenção.',
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
    { '@type': 'ListItem', position: 3, name: 'Calculadora de LTV', item: 'https://estetiacrm.com.br/ferramentas/calculadora-ltv' },
  ],
}

const LTV_CONCEPTS = [
  { term: 'LTV Bruto', def: 'Total que um paciente gasta na clínica ao longo do relacionamento. Fundamental para decidir quanto investir em retenção.' },
  { term: 'LTV/CAC', def: 'Ratio entre o valor gerado pelo cliente e o seu custo de aquisição. Acima de 3x = saudável. Abaixo de 1.5x = alerta.' },
  { term: 'CAC máximo', def: 'Valor limite sugerido que você pode gastar para adquirir um novo paciente de forma saudável. Regra geral: LTV ÷ 3.' },
]

export default function CalculadoraLTVPage() {
  return (
    <>
      <Script
        id="breadcrumb-ltv"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="bg-[#EEF0F8] dark:bg-slate-950 min-h-screen relative overflow-hidden selection:bg-[#C5A059]/30 selection:text-[#C5A059]">
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-bl from-[#C5A059]/15 to-[#0A1F3D]/0 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-[#0A1F3D]/25 to-transparent rounded-full blur-[100px] pointer-events-none" />

        {/* Hero */}
        <section className="relative bg-[#0A1F3D] text-white py-24 px-6 overflow-hidden border-b border-white/5">
          {/* Subtle Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
          
          <div className="relative mx-auto max-w-4xl text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-6 text-xs font-semibold uppercase tracking-[0.25em]">
              <Link href="/ferramentas" className="text-white/40 hover:text-white/70 transition-colors">Ferramentas</Link>
              <span className="text-white/20">›</span>
              <span className="text-[#C5A059] font-bold">Calculadora de LTV</span>
            </div>
            
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/10 px-4 py-1.5 text-xs font-semibold text-[#C5A059] mb-6 backdrop-blur-md">
              <Users className="h-3.5 w-3.5" />
              Calculadora gratuita de Lifetime Value
            </div>
            
            <h1 className="font-serif font-normal text-white leading-[1.1] mb-6 tracking-tight" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              Qual é o valor real de<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#E2C384] to-[#C5A059] font-bold">cada paciente</span> da sua clínica?
            </h1>
            
            <p className="text-white/60 text-lg max-w-2xl leading-relaxed">
              O LTV (Lifetime Value) é a métrica financeira de ouro para clínicas que buscam crescer de forma sustentável. Calcule o seu e calibre seus investimentos em atração e fidelidade.
            </p>
          </div>
        </section>

        {/* Concepts */}
        <div className="relative border-b border-[#0A1F3D]/8 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md z-10">
          <div className="mx-auto max-w-4xl px-6 py-6 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {LTV_CONCEPTS.map(({ term, def }) => (
              <div key={term} className="group p-2 rounded-xl hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all duration-300">
                <div className="font-bold text-[#C5A059] text-sm mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059]" />
                  {term}
                </div>
                <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed font-medium">{def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Calculator */}
        <section className="relative py-20 px-6 z-10">
          <div className="mx-auto max-w-5xl">
            <CalculadoraLTV />
          </div>
        </section>

        {/* How to increase LTV */}
        <section className="py-20 px-6 bg-white dark:bg-slate-900/60 border-t border-b border-[#0A1F3D]/5 dark:border-white/5 relative">
          <div className="mx-auto max-w-4xl">
            <div className="text-center max-w-xl mx-auto mb-14">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#C5A059]/10 text-xs font-bold text-[#C5A059] px-3.5 py-1 mb-3">
                <TrendingUp className="h-3.5 w-3.5" />
                Maximização de Receita
              </div>
              <h2 className="font-serif text-[#0A1F3D] dark:text-white text-3xl font-normal leading-tight">
                Como aumentar o <span className="text-[#C5A059] font-bold">Lifetime Value</span> da sua base?
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { icon: '🔔', title: 'Recall automático inteligente', desc: 'Pacientes avisados e reativados automaticamente retornam até 40% mais vezes. Reduza janelas vazias sem esforço manual.', href: '/features/recall-automatico' },
                { icon: '📱', title: 'WhatsApp Business integrado', desc: 'Comunicação direta, ágil e fluida eleva o índice de satisfação do paciente, agilizando novas consultas e tratamentos.', href: '/features/whatsapp-business' },
                { icon: '📊', title: 'Analytics PRO', desc: 'Identifique instantaneamente pacientes em risco de sumir antes do churn ocorrer, permitindo ações proativas sob medida.', href: '/features/analytics-pro' },
                { icon: '⭐', title: 'NPS e marketing de fidelidade', desc: 'Pacientes promotores e muito satisfeitos retornam 5x mais e indicam múltiplos novos clientes. Monitore o amor de forma ativa.', href: '/features/marketing-clinico' },
              ].map(({ icon, title, desc, href }) => (
                <Link
                  key={title}
                  href={href as any}
                  className="flex items-start gap-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-[#F8FAFC]/50 dark:bg-slate-900/30 p-6 hover:border-[#C5A059]/30 hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-none hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <div className="text-3xl shrink-0 transform group-hover:scale-115 transition-transform duration-300">{icon}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base text-[#0A1F3D] dark:text-white group-hover:text-[#C5A059] transition-colors mb-2">{title}</h3>
                    <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed">{desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#94A3B8] group-hover:text-[#C5A059] group-hover:translate-x-1 shrink-0 mt-1.5 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-24 px-6 overflow-hidden">
          {/* Gold gradient CTA background */}
          <div className="absolute inset-0 bg-[#0A1F3D] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(197,160,89,0.12),transparent_50%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

          <div className="relative mx-auto max-w-2xl text-center text-white">
            <div className="flex items-center justify-center gap-1.5 mb-6">
              <span className="p-1 rounded-full bg-[#C5A059]/20 text-[#C5A059]">
                <Sparkles className="h-4.5 w-4.5 animate-pulse" />
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">Ecossistema Integrado Estetia</span>
            </div>
            
            <h2 className="font-serif text-3xl md:text-4xl font-normal mb-4 leading-tight">
              Maximize o valor de cada paciente com <span className="font-bold border-b-2 border-[#C5A059]/40 pb-1">automação premium</span>
            </h2>
            <p className="text-white/60 max-w-md mx-auto mb-10 text-sm leading-relaxed">
              Fidelização inteligente, WhatsApp Business PRO e analytics robusto reunidos em um único software médico de alta performance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#C5A059] px-8 py-4 font-bold text-sm text-[#0A1F3D] shadow-xl shadow-[#C5A059]/10 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 w-full sm:w-auto"
              >
                Começar grátis agora
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
