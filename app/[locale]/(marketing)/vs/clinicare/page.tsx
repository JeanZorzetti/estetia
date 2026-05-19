import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { Check, X, ArrowRight } from 'lucide-react'
import { buildLocaleAlternates } from '@/lib/seo/canonical'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const alternates = buildLocaleAlternates(locale, '/vs/clinicare')
  return {
    title: 'Estetia CRM vs Clinicare — Comparativo Completo 2026',
    description: 'Compare Estetia CRM e Clinicare: funcionalidades, preços, LGPD para dados de saúde, IA e automação WhatsApp. Descubra o melhor software para clínicas de estética.',
    keywords: ['estetia vs clinicare', 'alternativa clinicare', 'melhor crm para clinica', 'clinicare comparativo 2026'],
    alternates,
    openGraph: {
      title: 'Estetia CRM vs Clinicare — Comparativo 2026',
      description: 'Compare funcionalidades e preços entre Estetia CRM e Clinicare para gestão de clínicas de estética e dermatologia.',
      url: alternates.canonical,
      images: [{ url: 'https://estetiacrm.com.br/og-image.png', width: 1200, height: 630 }],
    },
  }
}

const features = [
  { name: 'Prontuário eletrônico nativo', estetia: true, clinicare: true },
  { name: 'Anamnese digital com alertas de contraindicação', estetia: true, clinicare: false },
  { name: 'Recall automático via WhatsApp Business (API Oficial)', estetia: true, clinicare: false },
  { name: 'Predictor de no-show com IA', estetia: true, clinicare: false },
  { name: 'Integração TISS/TUSS para convênios', estetia: true, clinicare: true },
  { name: 'LGPD Art. 11 (dados sensíveis de saúde) nativo', estetia: true, clinicare: false },
  { name: 'Consentimento digital com assinatura eletrônica', estetia: true, clinicare: false },
  { name: 'Gestão multi-unidade consolidada', estetia: true, clinicare: true },
  { name: 'Agenda online com confirmação automática', estetia: true, clinicare: true },
  { name: 'Dashboard de KPIs clínicos em tempo real', estetia: true, clinicare: false },
  { name: 'Fotos antes/depois no prontuário', estetia: true, clinicare: true },
  { name: 'App mobile (iOS + Android)', estetia: true, clinicare: true },
  { name: 'API pública + webhooks', estetia: true, clinicare: false },
  { name: 'Plano gratuito disponível', estetia: true, clinicare: false },
]

const faqs = [
  {
    q: 'Quais são as vantagens do Estetia CRM em relação ao Clinicare?',
    a: 'O Estetia CRM oferece recursos que o Clinicare não possui de forma nativa: predictor de no-show com IA (reduz faltantes em até 60%), recall automático via WhatsApp Business com API Oficial Meta, anamnese digital com alertas de contraindicação específicos para procedimentos estéticos e LGPD Art. 11 integrado. Além disso, o Estetia tem plano gratuito permanente, enquanto o Clinicare não oferece essa opção.'
  },
  {
    q: 'O Clinicare é mais simples de usar que o Estetia CRM?',
    a: 'Ambos têm curva de aprendizado baixa. O Estetia CRM foi projetado especificamente para clínicas de estética — o onboarding inicial leva em média 30 minutos e a equipe começa a operar no mesmo dia. Nosso suporte via chat em português está disponível em todos os planos pagos.'
  },
  {
    q: 'O Estetia CRM é adequado para clínicas pequenas (1-2 profissionais)?',
    a: 'Sim. O plano Starter (R$149/mês) atende perfeitamente clínicas pequenas com até 5 profissionais. Inclui WhatsApp Business, agenda inteligente, anamnese digital e relatórios básicos. O plano gratuito permite testar sem limite de tempo antes de assinar.'
  },
  {
    q: 'Como funciona a migração do Clinicare para o Estetia CRM?',
    a: 'Exportamos seus dados do Clinicare (pacientes, prontuários, histórico de agenda) via CSV ou API e importamos no Estetia CRM. O processo é assistido pela nossa equipe sem custo adicional e leva entre 1 e 3 dias úteis.'
  },
]

export default async function VsClinicArePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  await params

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://estetiacrm.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Comparativos', item: 'https://estetiacrm.com.br/vs' },
      { '@type': 'ListItem', position: 3, name: 'Estetia vs Clinicare', item: 'https://estetiacrm.com.br/vs/clinicare' },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <Script id="breadcrumb-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main className="min-h-screen bg-white text-[#0A1F3D]">
        {/* Hero */}
        <section className="py-20 px-6 bg-[#EEF0F8] border-b border-[#0A1F3D]/8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#C5A059] mb-6">
              <span>Comparativo</span>
            </div>
            <h1 className="font-serif text-[#0A1F3D] leading-tight tracking-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
              Estetia CRM vs Clinicare
            </h1>
            <p className="text-[#64748B] text-lg max-w-2xl mx-auto mb-8">
              Compare as duas plataformas e veja por que clínicas de estética e dermatologia estão migrando do Clinicare para o Estetia CRM.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A1F3D] hover:bg-[#162D54] px-8 py-3.5 text-sm font-bold text-white transition-all">
                Testar Estetia grátis
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/pricing" className="inline-flex items-center justify-center rounded-xl border border-[#0A1F3D]/15 bg-white px-8 py-3.5 text-sm font-medium text-[#0A1F3D] hover:border-[#0A1F3D]/30 transition-colors">
                Ver planos e preços
              </Link>
            </div>
          </div>
        </section>

        {/* Pricing Comparison */}
        <section className="py-16 px-6">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-serif text-2xl font-bold text-[#0A1F3D] mb-8 text-center">Comparativo de Preços</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border-2 border-[#489FB5] bg-white p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-[#489FB5]/15 flex items-center justify-center">
                    <span className="text-[#489FB5] font-bold text-sm">E</span>
                  </div>
                  <span className="font-bold text-[#0A1F3D]">Estetia CRM</span>
                  <span className="ml-auto text-xs bg-[#489FB5]/15 text-[#489FB5] font-semibold px-2 py-0.5 rounded-full">Recomendado</span>
                </div>
                <div className="space-y-2 text-sm text-[#64748B]">
                  <div className="flex justify-between"><span>Gratuito</span><span className="font-semibold text-[#0A1F3D]">R$ 0/mês</span></div>
                  <div className="flex justify-between"><span>Starter</span><span className="font-semibold text-[#0A1F3D]">R$ 149/mês</span></div>
                  <div className="flex justify-between"><span>Pro</span><span className="font-semibold text-[#0A1F3D]">R$ 349/mês</span></div>
                  <div className="flex justify-between"><span>Business</span><span className="font-semibold text-[#0A1F3D]">R$ 799/mês</span></div>
                </div>
              </div>
              <div className="rounded-2xl border border-[#0A1F3D]/10 bg-[#EEF0F8] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-[#0A1F3D]/8 flex items-center justify-center">
                    <span className="text-[#64748B] font-bold text-sm">C</span>
                  </div>
                  <span className="font-bold text-[#0A1F3D]">Clinicare</span>
                </div>
                <div className="space-y-2 text-sm text-[#64748B]">
                  <div className="flex justify-between"><span>Solo</span><span className="font-semibold text-[#0A1F3D]">R$ 199/mês</span></div>
                  <div className="flex justify-between"><span>Clínica</span><span className="font-semibold text-[#0A1F3D]">R$ 349/mês</span></div>
                  <div className="flex justify-between"><span>Premium</span><span className="font-semibold text-[#0A1F3D]">R$ 599/mês</span></div>
                  <div className="text-xs text-[#94A3B8] pt-1">Sem plano gratuito. WhatsApp como add-on.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Table */}
        <section className="py-16 px-6 bg-[#EEF0F8]">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-serif text-2xl font-bold text-[#0A1F3D] mb-8 text-center">Comparativo de Funcionalidades</h2>
            <div className="rounded-2xl border border-[#0A1F3D]/8 bg-white overflow-hidden">
              <div className="grid grid-cols-3 bg-[#0A1F3D] text-white text-sm font-semibold">
                <div className="p-4">Funcionalidade</div>
                <div className="p-4 text-center text-[#489FB5]">Estetia CRM</div>
                <div className="p-4 text-center text-[#94A3B8]">Clinicare</div>
              </div>
              {features.map((f, i) => (
                <div key={f.name} className={`grid grid-cols-3 text-sm ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'} border-b border-[#0A1F3D]/5 last:border-0`}>
                  <div className="p-4 text-[#374151]">{f.name}</div>
                  <div className="p-4 flex justify-center">
                    {f.estetia ? <Check className="h-5 w-5 text-[#489FB5]" /> : <X className="h-5 w-5 text-[#CBD5E1]" />}
                  </div>
                  <div className="p-4 flex justify-center">
                    {f.clinicare ? <Check className="h-5 w-5 text-[#64748B]" /> : <X className="h-5 w-5 text-[#CBD5E1]" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-serif text-2xl font-bold text-[#0A1F3D] mb-8 text-center">Perguntas Frequentes</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-xl border border-[#0A1F3D]/8 bg-white p-6">
                  <h3 className="font-semibold text-[#0A1F3D] mb-2">{faq.q}</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6 bg-[#0A1F3D]">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif text-white text-2xl font-bold mb-4">Migre do Clinicare em até 3 dias úteis</h2>
            <p className="text-white/70 mb-8">Migração assistida, plano gratuito permanente e 7 dias de garantia em planos pagos.</p>
            <Link href="/register" className="inline-flex items-center gap-2 rounded-xl bg-[#C5A059] hover:bg-[#B8913F] px-10 py-4 text-sm font-bold text-[#0A1F3D] transition-all shadow-lg">
              Começar grátis agora
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
