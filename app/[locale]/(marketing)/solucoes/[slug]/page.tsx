import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowLeft, Check, ChevronDown, MessageCircle, Quote } from 'lucide-react'
import { SOLUCOES, getSolucaoBySlug, getAllSolucaoSlugs } from '@/config/solucoes-data'
import { buildLocaleAlternates } from '@/lib/seo/canonical'

export function generateStaticParams() {
  return getAllSolucaoSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const solucao = getSolucaoBySlug(slug)
  if (!solucao) return {}

  const alternates = buildLocaleAlternates(locale, `/solucoes/${slug}`, `/solutions/${slug}`)
  return {
    title: solucao.seo.title,
    description: solucao.seo.description,
    keywords: solucao.seo.keywords,
    alternates,
    openGraph: {
      title: solucao.seo.title,
      description: solucao.seo.description,
      url: alternates.canonical,
      images: [{ url: 'https://estetiacrm.com.br/og-image.png', width: 1200, height: 630 }],
    },
  }
}

export default async function SolucaoPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { slug } = await params
  const solucao = getSolucaoBySlug(slug)
  if (!solucao) notFound()

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://estetiacrm.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Soluções', item: 'https://estetiacrm.com.br/solucoes' },
      { '@type': 'ListItem', position: 3, name: solucao.label, item: `https://estetiacrm.com.br/solucoes/${slug}` },
    ],
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Estetia CRM — ${solucao.label}`,
    description: solucao.seo.description,
    provider: {
      '@type': 'Organization',
      name: 'Estetia CRM',
      url: 'https://estetiacrm.com.br',
    },
    serviceType: 'Software as a Service',
    areaServed: { '@type': 'Country', name: 'Brazil' },
  }

  return (
    <>
      <Script id="breadcrumb-schema" type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </Script>
      <Script id="service-schema" type="application/ld+json">
        {JSON.stringify(serviceSchema)}
      </Script>

      {/* ─── Breadcrumb ───────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-[#0A1F3D]/8 px-6 py-3">
        <nav className="mx-auto max-w-5xl flex items-center gap-2 text-sm text-[#64748B]">
          <Link href="/" className="hover:text-[#0A1F3D] transition-colors">Início</Link>
          <span className="text-[#0A1F3D]/30">/</span>
          <Link href={'/solucoes' as any} className="hover:text-[#0A1F3D] transition-colors">Soluções</Link>
          <span className="text-[#0A1F3D]/30">/</span>
          <span className="font-medium text-[#0A1F3D]">{solucao.label}</span>
        </nav>
      </div>

      {/* ─── Hero ─────────────────────────────────────────────────────────────── */}
      <section
        className="relative py-20 px-6 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${solucao.colorLight} 0%, #EEF0F8 60%, white 100%)`,
        }}
      >
        {/* Decorative circle */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: solucao.color }}
        />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span
              className="inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white"
              style={{ backgroundColor: solucao.color }}
            >
              {solucao.hero.badge}
            </span>
            {solucao.badge && (
              <span className="inline-block rounded-full bg-[#C5A059]/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C5A059]">
                {solucao.badge}
              </span>
            )}
          </div>

          <div className="text-5xl mb-6">{solucao.emoji}</div>

          <h1 className="font-newsreader text-4xl sm:text-5xl md:text-6xl font-bold text-[#0A1F3D] leading-tight mb-6">
            {solucao.hero.headline}
          </h1>
          <p className="text-lg text-[#64748B] max-w-2xl mx-auto mb-10 leading-relaxed">
            {solucao.hero.subheadline}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="text-white px-8 border-0" style={{ backgroundColor: solucao.color }}>
              <Link href="/register">Começar gratuitamente</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-[#0A1F3D]/20 text-[#0A1F3D] hover:bg-white px-8">
              <Link href="/pricing">Ver planos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── Benefits ─────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="font-newsreader text-3xl sm:text-4xl font-bold text-[#0A1F3D] mb-4">
              Tudo que sua clínica precisa, em um só lugar
            </h2>
            <p className="text-[#64748B] max-w-xl mx-auto">
              Funcionalidades construídas para o dia a dia de clínicas de {solucao.label.toLowerCase()}.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {solucao.benefits.map((benefit, i) => {
              const Icon = benefit.icon
              return (
                <div
                  key={i}
                  className="rounded-xl border border-[#0A1F3D]/8 bg-white p-6 hover:shadow-md transition-shadow"
                  style={{ borderLeftColor: solucao.color, borderLeftWidth: 3 }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: solucao.colorLight }}
                  >
                    <Icon className="h-5 w-5" style={{ color: solucao.color }} />
                  </div>
                  <h3 className="font-semibold text-[#0A1F3D] mb-2 text-sm">{benefit.title}</h3>
                  <p className="text-[#64748B] text-sm leading-relaxed">{benefit.text}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── Use Cases ────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#EEF0F8]">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="font-newsreader text-3xl sm:text-4xl font-bold text-[#0A1F3D] mb-4">
              Casos reais de clínicas como a sua
            </h2>
            <p className="text-[#64748B] max-w-xl mx-auto">
              Resultados de clínicas de {solucao.label.toLowerCase()} que já usam o Estetia.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {solucao.useCases.map((uc, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#0A1F3D]/8 p-6 flex flex-col">
                <div
                  className="text-xs font-bold uppercase tracking-wider mb-4 px-3 py-1.5 rounded-full self-start text-white"
                  style={{ backgroundColor: solucao.color }}
                >
                  {uc.persona}
                </div>
                <p className="text-sm text-[#64748B] leading-relaxed mb-4 flex-1">
                  <span className="font-medium text-[#0A1F3D]">Situação: </span>
                  {uc.scenario}
                </p>
                <div
                  className="rounded-lg p-4 text-sm font-medium"
                  style={{ backgroundColor: solucao.colorLight, color: solucao.color }}
                >
                  <Check className="h-4 w-4 inline mr-2 mb-0.5" />
                  {uc.outcome}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Workflow ─────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="font-newsreader text-3xl sm:text-4xl font-bold text-[#0A1F3D] mb-4">
              Como funciona na sua clínica
            </h2>
            <p className="text-[#64748B] max-w-xl mx-auto">
              Do primeiro acesso ao atendimento automatizado em 4 etapas.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {solucao.workflow.map((step, i) => (
              <div key={i} className="relative">
                {/* Connector line (not on last item) */}
                {i < solucao.workflow.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-7 left-[calc(100%+0px)] w-6 h-0.5 z-10"
                    style={{ backgroundColor: solucao.color, opacity: 0.3 }}
                  />
                )}
                <div className="flex flex-col">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white mb-4 shrink-0"
                    style={{ backgroundColor: solucao.color }}
                  >
                    {step.number}
                  </div>
                  <h3 className="font-semibold text-[#0A1F3D] mb-2 text-sm">{step.title}</h3>
                  <p className="text-[#64748B] text-sm leading-relaxed">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Linked Features ──────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#EEF0F8]">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="font-newsreader text-3xl sm:text-4xl font-bold text-[#0A1F3D] mb-4">
              Funcionalidades incluídas
            </h2>
            <p className="text-[#64748B] max-w-xl mx-auto">
              Cada recurso foi pensado para as necessidades específicas de clínicas de {solucao.label.toLowerCase()}.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {solucao.features.map((feat) => (
              <Link
                key={feat.slug}
                href={`/features/${feat.slug}` as any}
                className="group flex items-start gap-4 bg-white rounded-xl border border-[#0A1F3D]/8 p-5 hover:shadow-md hover:border-[#0A1F3D]/20 transition-all"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: solucao.colorLight }}
                >
                  <ArrowRight
                    className="h-4 w-4 group-hover:translate-x-0.5 transition-transform"
                    style={{ color: solucao.color }}
                  />
                </div>
                <div>
                  <p className="font-semibold text-[#0A1F3D] text-sm mb-0.5">{feat.label}</p>
                  <p className="text-[#64748B] text-xs leading-relaxed">{feat.description}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href={'/features' as any}
              className="inline-flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all"
              style={{ color: solucao.color }}
            >
              Ver todas as funcionalidades
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Testimonial ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#0A1F3D]">
        <div className="mx-auto max-w-3xl text-center">
          <Quote className="h-10 w-10 mx-auto mb-6 opacity-40 text-white" />
          <blockquote className="font-newsreader text-xl sm:text-2xl text-white leading-relaxed mb-8 italic">
            "{solucao.testimonial.quote}"
          </blockquote>
          <div>
            <p className="font-semibold text-white">{solucao.testimonial.name}</p>
            <p className="text-white/60 text-sm mt-1">{solucao.testimonial.role} — {solucao.testimonial.clinic}</p>
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-14">
            <h2 className="font-newsreader text-3xl sm:text-4xl font-bold text-[#0A1F3D] mb-4">
              Perguntas frequentes
            </h2>
            <p className="text-[#64748B]">
              Dúvidas de clínicas de {solucao.label.toLowerCase()} sobre o Estetia.
            </p>
          </div>

          <div className="space-y-3">
            {solucao.faq.map((item, i) => (
              <details
                key={i}
                className="group rounded-xl border border-[#0A1F3D]/8 overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-6 py-5 hover:bg-[#EEF0F8]/60 transition-colors">
                  <span className="font-semibold text-[#0A1F3D] text-sm pr-4">{item.q}</span>
                  <ChevronDown className="h-4 w-4 text-[#64748B] shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-5">
                  <p className="text-[#64748B] text-sm leading-relaxed">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Final ────────────────────────────────────────────────────────── */}
      <section
        className="py-20 px-6"
        style={{
          background: `linear-gradient(135deg, ${solucao.colorLight} 0%, #EEF0F8 100%)`,
        }}
      >
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-4xl mb-4">{solucao.emoji}</div>
          <h2 className="font-newsreader text-3xl sm:text-4xl font-bold text-[#0A1F3D] mb-4">
            Pronto para transformar sua clínica de {solucao.label.toLowerCase()}?
          </h2>
          <p className="text-[#64748B] mb-8 leading-relaxed">
            Comece grátis por 14 dias. Sem cartão de crédito. Cancele quando quiser.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild size="lg"
              className="text-white px-10 border-0 text-base"
              style={{ backgroundColor: solucao.color }}
            >
              <Link href="/register">
                Criar conta grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-[#0A1F3D]/20 text-[#0A1F3D] hover:bg-white px-8">
              <Link href="/contact">
                <MessageCircle className="mr-2 h-4 w-4" />
                Falar com especialista
              </Link>
            </Button>
          </div>

          {/* Back to hub */}
          <div className="mt-8">
            <Link
              href={'/solucoes' as any}
              className="inline-flex items-center gap-2 text-sm text-[#64748B] hover:text-[#0A1F3D] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Ver todas as soluções
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
