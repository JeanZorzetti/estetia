import { Metadata } from 'next'
import Script from 'next/script'
import { setRequestLocale } from 'next-intl/server'
import { buildLocaleAlternates } from '@/lib/seo/canonical'
import { CalculadoraNoShow } from '@/components/calculadoras/calculadora-no-show'
import { Link } from '@/i18n/routing'
import { ArrowRight, Clock, CheckCircle2, AlertCircle, Sparkles, HelpCircle } from 'lucide-react'

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

export default async function CalculadoraNoShowPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <Script
        id="breadcrumb-no-show"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="bg-[#EEF0F8] dark:bg-slate-950 min-h-screen relative overflow-hidden selection:bg-[#E05A4E]/30 selection:text-[#E05A4E]">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-[#E05A4E]/15 to-[#0A1F3D]/0 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-[#0A1F3D]/20 to-transparent rounded-full blur-[100px] pointer-events-none" />

        {/* Hero */}
        <section className="relative bg-[#0A1F3D] text-white py-24 px-6 overflow-hidden border-b border-white/5">
          {/* Subtle Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
          
          <div className="relative mx-auto max-w-4xl text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-6 text-xs font-semibold uppercase tracking-[0.25em]">
              <Link href="/ferramentas" className="text-white/40 hover:text-white/70 transition-colors">Ferramentas</Link>
              <span className="text-white/20">›</span>
              <span className="text-[#E05A4E] font-bold">Calculadora de No-Show</span>
            </div>
            
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E05A4E]/30 bg-[#E05A4E]/10 px-4 py-1.5 text-xs font-semibold text-[#E05A4E] mb-6 backdrop-blur-md">
              <Clock className="h-3.5 w-3.5 animate-pulse" />
              Calculadora gratuita de impacto financeiro
            </div>
            
            <h1 className="font-serif font-normal text-white leading-[1.1] mb-6 tracking-tight" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              Cada falta sem aviso é<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E05A4E] via-[#F48C82] to-[#E05A4E] font-bold">dinheiro perdido</span> para sempre
            </h1>
            
            <p className="text-white/60 text-lg max-w-2xl leading-relaxed">
              Descubra em 30 segundos quanto prejuízo as faltas causam na sua clínica por mês — e o quanto você recuperaria de faturamento com confirmação automática.
            </p>
          </div>
        </section>

        {/* Facts strip */}
        <div className="relative border-b border-[#0A1F3D]/8 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md z-10">
          <div className="mx-auto max-w-4xl px-6 py-6 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
            {FACTS.map(({ stat, desc }) => (
              <div key={stat} className="flex items-start gap-4 p-2 rounded-xl hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all duration-300">
                <div className="p-2 rounded-lg bg-[#E05A4E]/10 shrink-0">
                  <AlertCircle className="h-4 w-4 text-[#E05A4E]" />
                </div>
                <div>
                  <div className="font-bold text-[#E05A4E] text-2xl leading-none tracking-tight mb-1">{stat}</div>
                  <div className="text-[11px] text-[#64748B] dark:text-slate-400 font-medium leading-normal">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculator */}
        <section className="relative py-20 px-6 z-10">
          <div className="mx-auto max-w-5xl">
            <CalculadoraNoShow />
          </div>
        </section>

        {/* Why no-show happens */}
        <section className="py-20 px-6 bg-white dark:bg-slate-900/60 border-t border-b border-[#0A1F3D]/5 dark:border-white/5 relative">
          <div className="mx-auto max-w-4xl">
            <div className="text-center max-w-xl mx-auto mb-14">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E05A4E]/10 text-xs font-bold text-[#E05A4E] px-3.5 py-1 mb-3">
                <HelpCircle className="h-3.5 w-3.5" />
                Comportamento do Paciente
              </div>
              <h2 className="font-serif text-[#0A1F3D] dark:text-white text-3xl font-normal leading-tight">
                Por que os pacientes faltam <span className="text-[#E05A4E] font-bold">sem avisar?</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { emoji: '📱', title: 'Esquecimento involuntário', desc: 'Sem confirmação automática, o paciente simplesmente esquece da consulta no dia a dia corrido. Uma simples mensagem 24h antes resolve.' },
                { emoji: '😰', title: 'Falta de canal rápido', desc: 'Muitos evitam telefonar para desmarcar por constrangimento ou falta de tempo. Um link de reagendamento fácil elimina essa barreira.' },
                { emoji: '⏰', title: 'Urgências de última hora', desc: 'Imprevistos acontecem. A confirmação com 48h dá tempo hábil para reencaixar outro paciente na sua lista de espera.' },
              ].map(({ emoji, title, desc }) => (
                <div key={title} className="group rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-[#F8FAFC]/50 dark:bg-slate-900/30 p-6 hover:border-[#E05A4E]/30 hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300">
                  <div className="text-3xl mb-4 transform group-hover:scale-110 transition-transform duration-300 inline-block">{emoji}</div>
                  <h3 className="font-bold text-base text-[#0A1F3D] dark:text-white mb-2">{title}</h3>
                  <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-24 px-6 overflow-hidden">
          {/* Accent glow on CTA background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#E05A4E] to-[#CD483B] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

          <div className="relative mx-auto max-w-2xl text-center text-white">
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="p-1 rounded-full bg-white/20">
                <CheckCircle2 className="h-4 w-4 text-white" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-white/90">Recall automático incluso em todos os planos</span>
            </div>
            
            <h2 className="font-serif text-3xl md:text-4xl font-normal mb-4 leading-tight">
              Pare de perder receita com <span className="font-bold border-b-2 border-white/40 pb-1">cadeiras vazias</span>
            </h2>
            <p className="text-white/80 max-w-md mx-auto mb-10 text-sm leading-relaxed">
              Ative o recall automático inteligente via WhatsApp e reduza no-shows na sua clínica em até 70% nos primeiros 30 dias de uso.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href={"/features/recall-automatico" as any}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-sm text-[#E05A4E] shadow-xl shadow-[#9E2E23]/30 hover:bg-[#FFF5F4] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 w-full sm:w-auto"
              >
                Ver como o recall funciona
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/35 bg-white/5 hover:bg-white/10 px-8 py-4 font-semibold text-sm text-white hover:border-white/60 active:scale-[0.98] transition-all duration-300 w-full sm:w-auto backdrop-blur-sm"
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
