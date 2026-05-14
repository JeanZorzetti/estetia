import { Metadata } from 'next'
import Script from 'next/script'
import { buildLocaleAlternates } from '@/lib/seo/canonical'
import { CalculadoraNoShow } from '@/components/calculadoras/calculadora-no-show'
import { Link } from '@/i18n/routing'
import { ArrowRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const alternates = buildLocaleAlternates(locale, '/ferramentas/calculadora-no-show', '/tools/no-show-calculator')
  return {
    title: 'Calculadora de Custo de No-Show | Estetia CRM',
    description: 'Calcule quanto dinheiro sua clínica perde por mês com faltas sem aviso. Veja o impacto real do recall automático na sua receita.',
    alternates,
    openGraph: {
      title: 'Calculadora de Custo de No-Show — Estetia CRM',
      description: 'Descubra o prejuízo real das faltas na sua clínica e como reduzi-las em até 70%.',
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
    { '@type': 'ListItem', position: 3, name: 'Calculadora de No-Show', item: 'https://estetiacrm.com.br/ferramentas/calculadora-no-show' },
  ],
}

const FACTS = [
  { stat: '18–25%', desc: 'taxa média de no-show em clínicas sem confirmação automática' },
  { stat: '4%', desc: 'taxa com confirmação automática via WhatsApp (média do mercado)' },
  { stat: '70%', desc: 'de redução no no-show com recall automático ativado' },
]

export default function CalculadoraNoShowPage() {
  return (
    <>
      <Script
        id="breadcrumb-no-show"
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
              <span className="text-[#E05A4E]">Calculadora de No-Show</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E05A4E]/30 bg-[#E05A4E]/10 px-3 py-1 text-xs font-semibold text-[#E05A4E] mb-5">
              <Clock className="h-3.5 w-3.5" />
              Calculadora gratuita
            </div>
            <h1 className="font-serif text-white leading-tight mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Cada falta sem aviso é<br />
              <span className="text-[#E05A4E]">dinheiro perdido</span> para sempre
            </h1>
            <p className="text-white/60 text-lg max-w-2xl">
              Descubra em 30 segundos quanto prejuízo as faltas causam na sua clínica por mês — e o quanto você recuperaria com confirmação automática.
            </p>
          </div>
        </section>

        {/* Facts strip */}
        <div className="border-b border-[#0A1F3D]/8 bg-white">
          <div className="mx-auto max-w-4xl px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {FACTS.map(({ stat, desc }) => (
              <div key={stat} className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-[#E05A4E] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#E05A4E] text-lg leading-none">{stat}</div>
                  <div className="text-[10px] text-[#64748B]">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculator */}
        <section className="py-16 px-6">
          <div className="mx-auto max-w-5xl">
            <CalculadoraNoShow />
          </div>
        </section>

        {/* Why no-show happens */}
        <section className="py-14 px-6 bg-white">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-serif text-[#0A1F3D] text-2xl font-bold text-center mb-10">Por que pacientes faltam sem avisar?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { emoji: '📱', title: 'Esquecimento', desc: 'Sem confirmação automática, o paciente simplesmente esquece. Uma mensagem 24h antes resolve.' },
                { emoji: '😰', title: 'Ansiedade', desc: 'Alguns pacientes evitam cancelar por constrangimento. Um link de reagendamento fácil elimina essa barreira.' },
                { emoji: '⏰', title: 'Urgência do dia', desc: 'Imprevistos acontecem. A confirmação 48h antes dá tempo de reencaixar outro paciente.' },
              ].map(({ emoji, title, desc }) => (
                <div key={title} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                  <div className="text-2xl mb-3">{emoji}</div>
                  <h3 className="font-bold text-sm text-[#0A1F3D] mb-1">{title}</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6 bg-[#E05A4E] text-white text-center">
          <div className="mx-auto max-w-xl">
            <div className="flex items-center justify-center gap-2 mb-4">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-semibold">Recall automático incluso em todos os planos</span>
            </div>
            <h2 className="font-serif text-2xl font-bold mb-3">Pare de perder receita com faltas</h2>
            <p className="text-white/80 mb-8">Ative o recall automático e reduza no-shows em até 70% nos primeiros 30 dias.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={"/features/recall-automatico" as any}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 font-bold text-sm text-[#E05A4E] hover:opacity-90 transition-opacity"
              >
                Ver como o recall funciona
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-8 py-3.5 font-semibold text-sm text-white hover:bg-white/10 transition-colors"
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
