import { Metadata } from 'next'
import Script from 'next/script'
import { buildLocaleAlternates } from '@/lib/seo/canonical'
import { QuizMaturidade } from '@/components/calculadoras/quiz-maturidade'
import { Link } from '@/i18n/routing'
import { ArrowRight, Zap } from 'lucide-react'

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
    { '@type': 'ListItem', position: 3, name: 'Avaliação de Maturidade Digital', item: 'https://estetiacrm.com.br/ferramentas/avaliacao-maturidade-digital' },
  ],
}

const DIMENSIONS = [
  { icon: '📅', title: 'Agenda & Atendimento', desc: '3 perguntas sobre agendamento online, confirmação automática e recall de pacientes.' },
  { icon: '📋', title: 'Prontuário & Clínico', desc: '2 perguntas sobre registro de prontuários e documentação de evolução com fotos.' },
  { icon: '💬', title: 'Marketing & Comunicação', desc: '3 perguntas sobre WhatsApp Business, campanhas automáticas e coleta de feedback.' },
  { icon: '💰', title: 'Gestão & Compliance', desc: '2 perguntas sobre gestão financeira digital e adequação à LGPD.' },
]

export default function AvaliacaoMaturidadePage() {
  return (
    <>
      <Script
        id="breadcrumb-maturidade"
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
              <span className="text-[#489FB5]">Avaliação de Maturidade</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#489FB5]/30 bg-[#489FB5]/10 px-3 py-1 text-xs font-semibold text-[#489FB5] mb-5">
              <Zap className="h-3.5 w-3.5" />
              Quiz gratuito · Resultado imediato
            </div>
            <h1 className="font-serif text-white leading-tight mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Qual o nível digital<br />
              <span className="text-[#489FB5]">da sua clínica?</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl">
              10 perguntas, 4 dimensões, resultado em 2 minutos.
              Sem cadastro, sem e-mail — apenas o diagnóstico real e o que priorizar.
            </p>
          </div>
        </section>

        {/* Dimensions preview */}
        <div className="border-b border-[#0A1F3D]/8 bg-white">
          <div className="mx-auto max-w-5xl px-6 py-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {DIMENSIONS.map(({ icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="text-2xl mb-1.5">{icon}</div>
                <div className="text-xs font-bold text-[#0A1F3D] mb-1">{title}</div>
                <p className="text-[10px] text-[#64748B] leading-relaxed hidden sm:block">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quiz */}
        <section className="py-16 px-6">
          <div className="mx-auto max-w-3xl">
            <QuizMaturidade />
          </div>
        </section>

        {/* Why it matters */}
        <section className="py-14 px-6 bg-white">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-serif text-[#0A1F3D] text-2xl font-bold text-center mb-10">Por que avaliar a maturidade digital?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { emoji: '🎯', title: 'Priorize o que importa', desc: 'Com tantas ferramentas disponíveis, saber o que implementar primeiro é crucial. O diagnóstico mostra os gaps de maior impacto.' },
                { emoji: '📈', title: 'Benchmark do mercado', desc: 'Clínicas digitalmente maduras faturam em média 40% mais. Saiba onde você está nessa jornada.' },
                { emoji: '🛣️', title: 'Roadmap claro', desc: 'Em vez de tentar tudo de uma vez, receba um plano de ação sequencial e com foco no ROI.' },
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
        <section className="py-16 px-6 text-white text-center" style={{ backgroundColor: '#489FB5' }}>
          <div className="mx-auto max-w-xl">
            <h2 className="font-serif text-2xl font-bold mb-3">Pronto para evoluir sua clínica?</h2>
            <p className="text-white/80 mb-8">O Estetia reúne todas as funcionalidades que você precisa para atingir o nível Avançado — em uma plataforma só.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 font-bold text-sm hover:opacity-90 transition-opacity"
                style={{ color: '#489FB5' }}
              >
                Começar grátis 14 dias
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/ferramentas"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-8 py-3.5 font-semibold text-sm text-white hover:bg-white/10 transition-colors"
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
