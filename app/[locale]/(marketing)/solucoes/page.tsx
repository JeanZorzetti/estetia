import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check, MessageCircle, Star } from 'lucide-react'
import { SOLUCOES } from '@/config/solucoes-data'
import { buildLocaleAlternates } from '@/lib/seo/canonical'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const alternates = buildLocaleAlternates(locale, '/solucoes', '/solutions')
  return {
    title: 'Soluções por Especialidade | Estetia CRM',
    description:
      'CRM especializado para cada nicho da saúde estética: Estética, Dermatologia, Estética Corporal e redes Multi-unidade. Descubra como o Estetia se adapta ao seu tipo de clínica.',
    keywords: [
      'crm clinica estetica',
      'software dermatologia',
      'sistema estetica corporal',
      'crm multi-unidade clinica',
      'gestao clinica estetica',
      'software clinica dermato',
    ],
    alternates,
    openGraph: {
      title: 'Soluções por Especialidade | Estetia CRM',
      description:
        'Plataforma especializada para cada tipo de clínica de saúde estética. Encontre a solução certa para o seu negócio.',
      url: alternates.canonical,
      images: [{ url: 'https://estetiacrm.com.br/og-image.png', width: 1200, height: 630 }],
    },
  }
}

const TRUST_ITEMS = [
  { icon: Star, label: '4.9★ avaliação média', sub: 'App Store e Google Play' },
  { icon: Check, label: '+120 clínicas ativas', sub: 'em todo o Brasil' },
  { icon: Check, label: 'LGPD compliant', sub: 'Dados 100% no Brasil' },
  { icon: Check, label: 'Suporte humano', sub: 'WhatsApp em 2h úteis' },
]

export default async function SolucoesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://estetiacrm.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Soluções', item: 'https://estetiacrm.com.br/solucoes' },
    ],
  }

  return (
    <>
      <Script id="breadcrumb-schema" type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </Script>

      {/* ─── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="bg-[#EEF0F8] pt-16 pb-20 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full bg-[#0A1F3D]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#0A1F3D] mb-6">
            Feito para cada tipo de clínica
          </span>
          <h1 className="font-newsreader text-4xl sm:text-5xl md:text-6xl font-bold text-[#0A1F3D] leading-tight mb-6">
            A solução certa para{' '}
            <span className="italic text-[#489FB5]">o seu nicho</span>
          </h1>
          <p className="text-lg text-[#64748B] max-w-2xl mx-auto mb-10 leading-relaxed">
            O Estetia foi construído do zero para clínicas de saúde estética. Cada especialidade tem suas próprias exigências — escolha a solução que se encaixa no seu dia a dia.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-[#0A1F3D] hover:bg-[#162D54] text-white px-8">
              <Link href="/register">Começar grátis</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-[#0A1F3D]/20 text-[#0A1F3D] hover:bg-[#0A1F3D]/5 px-8">
              <Link href="/contact">
                <MessageCircle className="mr-2 h-4 w-4" />
                Falar com especialista
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── Solution Cards ───────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-6">
            {SOLUCOES.map((solucao) => (
              <div
                key={solucao.slug}
                className="group relative rounded-2xl border border-[#0A1F3D]/10 bg-white p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{ borderTopColor: solucao.color, borderTopWidth: 3 }}
              >
                {/* Badge */}
                {solucao.badge && (
                  <span
                    className="absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full text-white"
                    style={{ backgroundColor: solucao.color }}
                  >
                    {solucao.badge}
                  </span>
                )}

                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{ backgroundColor: solucao.colorLight }}
                  >
                    {solucao.emoji}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#0A1F3D]">{solucao.label}</h2>
                    <p className="text-sm text-[#64748B] mt-0.5">{solucao.hero.badge}</p>
                  </div>
                </div>

                {/* Subheadline */}
                <p className="text-[#64748B] text-sm leading-relaxed mb-6">
                  {solucao.hero.subheadline}
                </p>

                {/* Top 4 benefits */}
                <ul className="space-y-2 mb-8">
                  {solucao.benefits.slice(0, 4).map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-[#0A1F3D]">
                      <Check
                        className="h-4 w-4 mt-0.5 shrink-0"
                        style={{ color: solucao.color }}
                      />
                      <span>{b.title}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={`/solucoes/${solucao.slug}` as any}
                  className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                  style={{ color: solucao.color }}
                >
                  Ver solução completa
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Trust Strip ──────────────────────────────────────────────────────── */}
      <section className="py-12 px-6 bg-[#0A1F3D]">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {TRUST_ITEMS.map((item, i) => (
              <div key={i} className="text-center">
                <p className="text-white font-bold text-lg mb-0.5">{item.label}</p>
                <p className="text-white/60 text-sm">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Final ────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#EEF0F8]">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-newsreader text-3xl sm:text-4xl font-bold text-[#0A1F3D] mb-4">
            Não tem certeza qual se encaixa na sua clínica?
          </h2>
          <p className="text-[#64748B] mb-8 leading-relaxed">
            Nossos especialistas em gestão clínica analisam o seu cenário e indicam a melhor configuração gratuitamente. Sem compromisso.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-[#C5A059] hover:bg-[#8B6E32] text-white px-8 border-0">
              <Link href="/contact">
                <MessageCircle className="mr-2 h-4 w-4" />
                Falar com especialista
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-[#0A1F3D]/20 text-[#0A1F3D] hover:bg-white px-8">
              <Link href="/precos">Ver planos e preços</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
