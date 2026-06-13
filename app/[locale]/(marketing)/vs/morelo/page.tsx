import type { Metadata } from 'next'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import Script from 'next/script'
import { Check, X, ArrowRight } from 'lucide-react'
import { buildLocaleAlternates } from '@/lib/seo/canonical'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const alternates = buildLocaleAlternates(locale, '/vs/morelo')
  return {
    title: 'Estetia CRM vs Morelo — Comparativo Completo 2026',
    description: 'Compare Estetia CRM e Morelo: funcionalidades, preços, LGPD para dados de saúde, TISS/TUSS e suporte. Descubra qual é o melhor CRM para sua clínica de estética.',
    keywords: ['estetia vs morelo', 'alternativa morelo', 'melhor crm clinica estetica', 'morelo crm comparativo'],
    alternates,
    openGraph: {
      title: 'Estetia CRM vs Morelo — Comparativo 2026',
      description: 'Compare funcionalidades, preços e suporte a LGPD/TISS entre Estetia CRM e Morelo para clínicas de estética.',
      url: alternates.canonical,
      images: [{ url: 'https://estetiacrm.com.br/og-image.png', width: 1200, height: 630 }],
    },
  }
}

const features = [
  { name: 'Prontuário eletrônico nativo', estetia: true, morelo: true },
  { name: 'Anamnese digital com alertas de contraindicação', estetia: true, morelo: false },
  { name: 'Recall automático via WhatsApp Business (API Oficial)', estetia: true, morelo: false },
  { name: 'Predictor de no-show com IA', estetia: true, morelo: false },
  { name: 'Integração TISS/TUSS para convênios', estetia: true, morelo: true },
  { name: 'LGPD Art. 11 (dados sensíveis de saúde) nativo', estetia: true, morelo: false },
  { name: 'Consentimento digital com assinatura eletrônica', estetia: true, morelo: false },
  { name: 'Gestão multi-unidade consolidada', estetia: true, morelo: true },
  { name: 'Agenda online com confirmação automática', estetia: true, morelo: true },
  { name: 'Dashboard de KPIs clínicos em tempo real', estetia: true, morelo: false },
  { name: 'Fotos antes/depois no prontuário', estetia: true, morelo: true },
  { name: 'App mobile (iOS + Android)', estetia: true, morelo: true },
  { name: 'API pública + webhooks', estetia: true, morelo: false },
  { name: 'Suporte em português (chat + email)', estetia: true, morelo: true },
]

const faqs = [
  {
    q: 'Qual a principal diferença entre Estetia CRM e Morelo?',
    a: 'A principal diferença está no foco em IA clínica e LGPD para dados de saúde. O Estetia CRM oferece predictor de no-show com IA, recall automático via WhatsApp Business (API Oficial Meta) e conformidade LGPD Art. 11 nativa — recursos que o Morelo não possui de forma integrada. O Morelo é mais focado em gestão básica de agenda e prontuário.'
  },
  {
    q: 'O Estetia CRM é mais caro que o Morelo?',
    a: 'O Estetia CRM tem planos a partir de R$0 (gratuito) e planos pagos a partir de R$149/mês. O custo-benefício é superior quando considerado o conjunto de funcionalidades de IA, LGPD e integração WhatsApp que no Morelo exigem add-ons separados.'
  },
  {
    q: 'Consigo migrar do Morelo para o Estetia CRM sem perder dados?',
    a: 'Sim. O Estetia CRM oferece importação de pacientes e histórico via CSV e integração direta. Nossa equipe de onboarding auxilia na migração de dados — prontuários, agenda e histórico financeiro. O processo típico leva 1 a 3 dias úteis.'
  },
  {
    q: 'O Estetia CRM funciona para dermatologistas além de esteticistas?',
    a: 'Sim. O Estetia CRM foi desenvolvido para clínicas de estética e dermatologia. Inclui CID-10, TISS/TUSS para convênios, prontuário com campos específicos para dermato e integração com laudos de exames de imagem.'
  },
]

export default async function VsMoreloPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://estetiacrm.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Comparativos', item: 'https://estetiacrm.com.br/vs' },
      { '@type': 'ListItem', position: 3, name: 'Estetia vs Morelo', item: 'https://estetiacrm.com.br/vs/morelo' },
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
              Estetia CRM vs Morelo
            </h1>
            <p className="text-[#64748B] text-lg max-w-2xl mx-auto mb-8">
              Compare as duas plataformas para clínicas de estética e descubra qual oferece mais recursos de IA, LGPD e automação para o seu negócio.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A1F3D] hover:bg-[#162D54] px-8 py-3.5 text-sm font-bold text-white transition-all">
                Testar Estetia grátis
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/precos" className="inline-flex items-center justify-center rounded-xl border border-[#0A1F3D]/15 bg-white px-8 py-3.5 text-sm font-medium text-[#0A1F3D] hover:border-[#0A1F3D]/30 transition-colors">
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
                    <span className="text-[#64748B] font-bold text-sm">M</span>
                  </div>
                  <span className="font-bold text-[#0A1F3D]">Morelo</span>
                </div>
                <div className="space-y-2 text-sm text-[#64748B]">
                  <div className="flex justify-between"><span>Básico</span><span className="font-semibold text-[#0A1F3D]">R$ 179/mês</span></div>
                  <div className="flex justify-between"><span>Profissional</span><span className="font-semibold text-[#0A1F3D]">R$ 299/mês</span></div>
                  <div className="flex justify-between"><span>Enterprise</span><span className="font-semibold text-[#0A1F3D]">Sob consulta</span></div>
                  <div className="text-xs text-[#94A3B8] pt-1">WhatsApp e LGPD como add-ons</div>
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
                <div className="p-4 text-center text-[#94A3B8]">Morelo</div>
              </div>
              {features.map((f, i) => (
                <div key={f.name} className={`grid grid-cols-3 text-sm ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'} border-b border-[#0A1F3D]/5 last:border-0`}>
                  <div className="p-4 text-[#374151]">{f.name}</div>
                  <div className="p-4 flex justify-center">
                    {f.estetia ? <Check className="h-5 w-5 text-[#489FB5]" /> : <X className="h-5 w-5 text-[#CBD5E1]" />}
                  </div>
                  <div className="p-4 flex justify-center">
                    {f.morelo ? <Check className="h-5 w-5 text-[#64748B]" /> : <X className="h-5 w-5 text-[#CBD5E1]" />}
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
            <h2 className="font-serif text-white text-2xl font-bold mb-4">Pronto para testar o Estetia CRM?</h2>
            <p className="text-white/70 mb-8">Plano gratuito disponível. Sem cartão de crédito. Migração assistida do Morelo inclusa.</p>
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
