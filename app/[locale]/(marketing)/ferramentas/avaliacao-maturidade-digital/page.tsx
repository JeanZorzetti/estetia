import { Metadata } from 'next'
import Script from 'next/script'
import { buildLocaleAlternates } from '@/lib/seo/canonical'
import { QuizMaturidade } from '@/components/calculadoras/quiz-maturidade'
import { Link } from '@/i18n/routing'
import { ArrowRight, Zap, Sparkles, HelpCircle } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const alternates = buildLocaleAlternates(
    locale,
    '/ferramentas/avaliacao-maturidade-digital',
    '/tools/digital-maturity-assessment'
  )
  return {
    title: 'Avaliação de Maturidade Digital da Clínica | Estetia CRM',
    description: 'Quiz de 10 perguntas que avalia o nível digital da sua clínica em 4 dimensões. Receba recomendações personalizadas de melhorias — gratuito, sem e-mail.',
    alternates,
    openGraph: {
      title: 'Avaliação de Maturidade Digital — Estetia CRM',
      description: 'Descubra em 2 minutos o nível digital da sua clínica e o que priorizar para crescer.',
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
    { '@type': 'ListItem', position: 3, name: 'Avaliação de Maturidade Digital', item: 'https://estetiacrm.com.br/ferramentas/avaliacao-avaliacao-maturidade-digital' },
  ],
}

const DIMENSIONS = [
  { icon: '📅', title: 'Agenda & Atendimento', desc: 'Agendamento online, confirmação automática por WhatsApp e recall de pacientes.' },
  { icon: '📋', title: 'Prontuário & Clínico', desc: 'Registro digital de prontuários, assinatura digital e evolução com fotos.' },
  { icon: '💬', title: 'Marketing & CRM', desc: 'WhatsApp Business integrado, funil de vendas ativo e feedback automatizado.' },
  { icon: '💰', title: 'Gestão & Compliance', desc: 'Fluxo de caixa inteligente, comissão e segurança sob a LGPD.' },
]

export default function AvaliacaoMaturidadePage() {
  return (
    <>
      <Script
        id="breadcrumb-maturidade"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="bg-[#EEF0F8] dark:bg-slate-950 min-h-screen relative overflow-hidden selection:bg-[#489FB5]/30 selection:text-[#489FB5]">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-[#489FB5]/15 to-[#0A1F3D]/0 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-[#0A1F3D]/25 to-transparent rounded-full blur-[100px] pointer-events-none" />

        {/* Hero */}
        <section className="relative bg-[#0A1F3D] text-white py-24 px-6 overflow-hidden border-b border-white/5">
          {/* Subtle Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
          
          <div className="relative mx-auto max-w-4xl text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-6 text-xs font-semibold uppercase tracking-[0.25em]">
              <Link href="/ferramentas" className="text-white/40 hover:text-white/70 transition-colors">Ferramentas</Link>
              <span className="text-white/20">›</span>
              <span className="text-[#489FB5] font-bold">Avaliação de Maturidade</span>
            </div>
            
            <div className="inline-flex items-center gap-2 rounded-full border border-[#489FB5]/30 bg-[#489FB5]/10 px-4 py-1.5 text-xs font-semibold text-[#489FB5] mb-6 backdrop-blur-md">
              <Zap className="h-3.5 w-3.5 animate-pulse text-[#489FB5]" />
              Quiz gratuito · Resultado imediato sem e-mail
            </div>
            
            <h1 className="font-serif font-normal text-white leading-[1.1] mb-6 tracking-tight" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              Qual o nível digital<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#489FB5] via-[#A8ECE7] to-[#489FB5] font-bold">da sua clínica?</span>
            </h1>
            
            <p className="text-white/60 text-lg max-w-2xl leading-relaxed">
              10 perguntas rápidas, 4 dimensões estratégicas analisadas, resultado em menos de 2 minutos. Receba na hora um diagnóstico acionável de melhorias.
            </p>
          </div>
        </section>

        {/* Dimensions Preview */}
        <div className="relative border-b border-[#0A1F3D]/8 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md z-10">
          <div className="mx-auto max-w-5xl px-6 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {DIMENSIONS.map(({ icon, title, desc }) => (
              <div key={title} className="group p-2 rounded-2xl hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all duration-300">
                <div className="text-3xl mb-2.5 transform group-hover:scale-115 transition-transform">{icon}</div>
                <div className="text-xs font-bold text-[#0A1F3D] dark:text-white group-hover:text-[#489FB5] transition-colors mb-1 uppercase tracking-wider">{title}</div>
                <p className="text-[10px] text-[#64748B] dark:text-slate-400 font-medium leading-relaxed hidden md:block">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quiz */}
        <section className="relative py-20 px-6 z-10">
          <div className="mx-auto max-w-3xl">
            <QuizMaturidade />
          </div>
        </section>

        {/* Why it matters */}
        <section className="py-20 px-6 bg-white dark:bg-slate-900/60 border-t border-b border-[#0A1F3D]/5 dark:border-white/5 relative">
          <div className="mx-auto max-w-4xl">
            <div className="text-center max-w-xl mx-auto mb-14">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#489FB5]/10 text-xs font-bold text-[#489FB5] px-3.5 py-1 mb-3">
                <HelpCircle className="h-3.5 w-3.5" />
                Maturidade Analítica
              </div>
              <h2 className="font-serif text-[#0A1F3D] dark:text-white text-3xl font-normal leading-tight">
                Por que mensurar a <span className="text-[#489FB5] font-bold">Maturidade Digital?</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { emoji: '🎯', title: 'Priorize com foco em ROI', desc: 'Com tantas inovações, saber o que implementar primeiro é crucial. O diagnóstico indica exatamente os gaps digitais de maior impacto financeiro.' },
                { emoji: '📈', title: 'Benchmark real de mercado', desc: 'Clínicas digitalmente maduras no Brasil faturam em média 40% mais. Entenda em qual estágio você se encontra nessa escala.' },
                { emoji: '🛣️', title: 'Roadmap estratégico claro', desc: 'Em vez de tentar abraçar todas as tecnologias de uma vez, receba recomendações sequenciais desenhadas especificamente para o seu perfil.' },
              ].map(({ emoji, title, desc }) => (
                <div key={title} className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-[#F8FAFC]/50 dark:bg-slate-900/30 p-6 hover:border-[#489FB5]/30 hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300 group">
                  <div className="text-3xl mb-4 transform group-hover:scale-110 transition-transform duration-300 inline-block">{emoji}</div>
                  <h3 className="font-bold text-base text-[#0A1F3D] dark:text-white mb-2">{title}</h3>
                  <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed font-medium">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-24 px-6 overflow-hidden">
          {/* Turquoise gradient CTA background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#489FB5] to-[#368498] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

          <div className="relative mx-auto max-w-2xl text-center text-white">
            <div className="flex items-center justify-center gap-1.5 mb-6">
              <span className="p-1 rounded-full bg-white/20">
                <Sparkles className="h-4.5 w-4.5 text-white animate-pulse" />
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-white/90">Evolução Acelerada</span>
            </div>
            
            <h2 className="font-serif text-3xl md:text-4xl font-normal mb-4 leading-tight">
              Pronto para evoluir a jornada <span className="font-bold border-b-2 border-white/40 pb-1">digital da sua clínica?</span>
            </h2>
            <p className="text-white/85 max-w-md mx-auto mb-10 text-sm leading-relaxed">
              O Estetia CRM reúne todas as ferramentas recomendadas no quiz para você saltar direto para o nível Avançado — com facilidade incomparável.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-sm shadow-xl shadow-[#2E6877]/30 hover:bg-[#F2FBFB] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 w-full sm:w-auto"
                style={{ color: '#489FB5' }}
              >
                Testar grátis por 14 dias
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" style={{ color: '#489FB5' }} />
              </Link>
              
              <Link
                href="/ferramentas"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/35 bg-white/5 hover:bg-white/10 px-8 py-4 font-semibold text-sm text-white hover:border-white/60 active:scale-[0.98] transition-all duration-300 w-full sm:w-auto backdrop-blur-sm"
              >
                Conhecer outras ferramentas
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
