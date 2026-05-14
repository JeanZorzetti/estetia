import { Metadata } from 'next'
import Script from 'next/script'
import { buildLocaleAlternates } from '@/lib/seo/canonical'
import { CalculadoraLTV } from '@/components/calculadoras/calculadora-ltv'
import { Link } from '@/i18n/routing'
import { ArrowRight, Users } from 'lucide-react'

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
  { term: 'LTV/CAC', def: 'Ratio entre valor do cliente e custo de aquisição. Acima de 3x = saudável. Abaixo de 1.5x = alerta.' },
  { term: 'CAC máximo', def: 'Valor máximo que você pode gastar para adquirir um novo paciente com lucro. Regra geral: LTV ÷ 3.' },
]

export default function CalculadoraLTVPage() {
  return (
    <>
      <Script
        id="breadcrumb-ltv"
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
              <span className="text-[#C5A059]">Calculadora de LTV</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/10 px-3 py-1 text-xs font-semibold text-[#C5A059] mb-5">
              <Users className="h-3.5 w-3.5" />
              Calculadora gratuita
            </div>
            <h1 className="font-serif text-white leading-tight mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Qual é o valor real de<br />
              <span className="text-[#C5A059]">cada paciente</span> da sua clínica?
            </h1>
            <p className="text-white/60 text-lg max-w-2xl">
              O LTV (Lifetime Value) é a métrica mais importante para clínicas que querem crescer de forma sustentável.
              Calcule o seu e descubra quanto investir em retenção.
            </p>
          </div>
        </section>

        {/* Concepts */}
        <div className="border-b border-[#0A1F3D]/8 bg-white">
          <div className="mx-auto max-w-4xl px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {LTV_CONCEPTS.map(({ term, def }) => (
              <div key={term}>
                <div className="font-bold text-sm text-[#C5A059] mb-1">{term}</div>
                <p className="text-xs text-[#64748B] leading-relaxed">{def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Calculator */}
        <section className="py-16 px-6">
          <div className="mx-auto max-w-5xl">
            <CalculadoraLTV />
          </div>
        </section>

        {/* How to increase LTV */}
        <section className="py-14 px-6 bg-white">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-serif text-[#0A1F3D] text-2xl font-bold text-center mb-10">Como aumentar o LTV da sua base</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: '🔔', title: 'Recall automático', desc: 'Pacientes que recebem lembretes personalizados retornam 40% mais. Automatize o processo de reativação.', href: '/features/recall-automatico' },
                { icon: '📱', title: 'WhatsApp integrado', desc: 'Comunicação ágil aumenta satisfação e reduz o tempo entre visitas. Histórico unificado por paciente.', href: '/features/whatsapp-business' },
                { icon: '📊', title: 'Analytics PRO', desc: 'Identifique pacientes em risco de churn antes que sumam. Aja com campanhas personalizadas.', href: '/features/analytics-pro' },
                { icon: '⭐', title: 'NPS e fidelidade', desc: 'Pacientes satisfeitos retornam 5x mais e indicam em média 3 novos clientes. Meça e aja.', href: '/features/marketing-clinico' },
              ].map(({ icon, title, desc, href }) => (
                <Link
                  key={title}
                  href={href as any}
                  className="flex items-start gap-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5 hover:border-[#C5A059]/30 hover:shadow-sm transition-all group"
                >
                  <div className="text-2xl">{icon}</div>
                  <div>
                    <h3 className="font-bold text-sm text-[#0A1F3D] group-hover:text-[#C5A059] transition-colors mb-1">{title}</h3>
                    <p className="text-xs text-[#64748B] leading-relaxed">{desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#94A3B8] group-hover:text-[#C5A059] shrink-0 mt-0.5 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6 bg-[#0A1F3D] text-white text-center">
          <div className="mx-auto max-w-xl">
            <h2 className="font-serif text-2xl font-bold mb-3">Maximize o LTV com automação inteligente</h2>
            <p className="text-white/60 mb-8">Recall, WhatsApp e analytics em uma plataforma só. Teste 14 dias grátis.</p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C5A059] px-8 py-3.5 font-bold text-sm text-[#0A1F3D] hover:opacity-90 transition-opacity"
            >
              Começar grátis agora
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
