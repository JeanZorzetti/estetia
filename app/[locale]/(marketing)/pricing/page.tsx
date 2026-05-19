'use client'

import Link from 'next/link'
import Script from 'next/script'
import { Check, Building2, Zap, TrendingUp, Clock, Users, DollarSign, ArrowRight } from 'lucide-react'
import { PricingToggle } from './pricing-toggle'
import { useTranslations } from 'next-intl'
import { PricingPageTracker } from '@/components/analytics/pricing-page-tracker'

const TIER_IDS = ['starter', 'pro', 'business'] as const
type TierId = typeof TIER_IDS[number]
const FEATURED_TIER: TierId = 'pro'

const CALCULATOR_LINKS = [
  { href: '/ferramentas/calculadora-roi', labelKey: 'calculators.links.roi', color: '#489FB5' },
  { href: '/ferramentas/calculadora-no-show', labelKey: 'calculators.links.no_show', color: '#E05A4E' },
  { href: '/ferramentas/calculadora-ltv', labelKey: 'calculators.links.ltv', color: '#C5A059' },
  { href: '/ferramentas/calculadora-precificacao', labelKey: 'calculators.links.pricing', color: '#0A1F3D' },
  { href: '/ferramentas/avaliacao-maturidade-digital', labelKey: 'calculators.links.maturity', color: '#489FB5' },
] as const

export default function PricingPage() {
  const t = useTranslations('marketing.pricing')

  const tiers = TIER_IDS.map((id) => ({
    id,
    name: t(`tiers.${id}.name`),
    href: '/register',
    priceMonthly: t(`tiers.${id}.price_monthly`),
    priceAnnual: t(`tiers.${id}.price_annual`),
    description: t(`tiers.${id}.description`),
    features: t.raw(`tiers.${id}.features`) as string[],
    featured: id === FEATURED_TIER,
  }))

  const faqPairs = [
    ['q1', 'a1'], ['q2', 'a2'], ['q3', 'a3'], ['q4', 'a4'],
    ['q5', 'a5'], ['q6', 'a6'], ['q7', 'a7'], ['q8', 'a8'],
  ] as const
  type FaqQ = 'q1'|'q2'|'q3'|'q4'|'q5'|'q6'|'q7'|'q8'
  type FaqA = 'a1'|'a2'|'a3'|'a4'|'a5'|'a6'|'a7'|'a8'

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://estetiacrm.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Planos', item: 'https://estetiacrm.com.br/pricing' },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqPairs.map(([qKey, aKey]) => ({
      '@type': 'Question',
      name: t(`faq.${qKey as FaqQ}`),
      acceptedAnswer: { '@type': 'Answer', text: t(`faq.${aKey as FaqA}`) },
    })),
  }

  const offersSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Estetia CRM Plans',
    itemListElement: tiers.map((tier, i) => ({
      '@type': 'Offer',
      name: tier.name,
      price: tier.priceMonthly.replace(/[^\d]/g, ''),
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      description: tier.description,
    })),
  }

  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Estetia CRM',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, iOS, Android',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'BRL',
      lowPrice: '149',
      highPrice: '799',
      offerCount: '3',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '12',
    },
  }

  return (
    <>
      <PricingPageTracker />
      <Script id="breadcrumb-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="offers-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offersSchema) }} />
      <Script id="software-app-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }} />

      <div className="bg-[#EEF0F8] min-h-screen">

        {/* Hero */}
        <section className="bg-[#0A1F3D] text-white py-20 px-6 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#489FB5]/30 bg-[#489FB5]/10 px-3 py-1 text-xs font-semibold mb-5" style={{ color: '#489FB5' }}>
              <Zap className="h-3.5 w-3.5" />
              {t('badge')}
            </div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: '#C5A059' }}>
              {t('tagline')}
            </div>
            <h1 className="font-serif text-white leading-tight mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              {t('title')}
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </div>
        </section>

        {/* Trial Banner */}
        <div className="border-b border-[#0A1F3D]/8 bg-white">
          <div className="mx-auto max-w-4xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 shrink-0" style={{ color: '#489FB5' }} />
              <div>
                <p className="font-semibold text-[#0A1F3D]">14 dias grátis com acesso PRO completo</p>
                <p className="text-sm text-[#64748B]">Sem cartão. Cancele a qualquer momento. Onboarding incluído.</p>
              </div>
            </div>
            <Link
              href="/register"
              className="shrink-0 inline-flex items-center gap-2 rounded-xl px-6 py-2.5 font-bold text-sm text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#0A1F3D' }}
            >
              Começar grátis
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Pricing Cards */}
        <section className="py-16 px-6">
          <div className="mx-auto max-w-5xl">
            <PricingToggle labelMonthly={t('labelMonthly')} labelAnnual={t('labelAnnual')}>
              {(isAnnual) => (
                <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-3">
                  {tiers.map((tier) => {
                    const price = isAnnual ? tier.priceAnnual : tier.priceMonthly
                    return (
                      <div
                        key={tier.id}
                        className={`relative rounded-2xl bg-white p-6 flex flex-col ${
                          tier.featured
                            ? 'shadow-xl ring-2 scale-[1.02] z-10'
                            : 'border border-[#0A1F3D]/8 shadow-sm'
                        }`}
                        style={tier.featured ? { border: '2px solid #C5A059' } : {}}
                      >
                        {tier.featured && (
                          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                            <div
                              className="rounded-full px-4 py-1 text-xs font-bold text-white shadow-lg"
                              style={{ backgroundColor: '#C5A059' }}
                            >
                              {t('mostPopular')}
                            </div>
                          </div>
                        )}

                        {/* Top border accent */}
                        <div
                          className="absolute top-0 left-6 right-6 h-0.5 rounded-b-full"
                          style={{ backgroundColor: tier.featured ? '#C5A059' : '#489FB5' }}
                        />

                        <div className="mb-4">
                          <h2 className="font-serif text-xl font-bold text-[#0A1F3D]">{tier.name}</h2>
                          <p className="text-xs text-[#64748B] mt-1">{tier.description}</p>
                        </div>

                        <div className="flex items-baseline gap-1 mb-1">
                          <span className="font-serif text-4xl font-bold text-[#0A1F3D]">{price}</span>
                          <span className="text-sm text-[#64748B]">{t('perMonth')}</span>
                        </div>
                        {isAnnual && (
                          <p className="text-xs text-[#64748B] mb-5">
                            {t('billedAnnually')} · <span className="line-through">{tier.priceMonthly}{t('perMonth')}</span>
                          </p>
                        )}
                        {!isAnnual && <div className="mb-5" />}

                        <ul className="space-y-2.5 text-sm text-[#64748B] mb-6 flex-1">
                          {tier.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-2.5">
                              <Check className="h-4 w-4 shrink-0 mt-0.5" style={{ color: '#489FB5' }} />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="space-y-3">
                          <Link
                            href={tier.href}
                            className="flex w-full items-center justify-center gap-2 rounded-xl py-3 font-bold text-sm transition-opacity hover:opacity-90"
                            style={
                              tier.featured
                                ? { backgroundColor: '#C5A059', color: '#fff' }
                                : { backgroundColor: '#0A1F3D', color: '#fff' }
                            }
                          >
                            {t('getStarted')}
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                          {tier.featured && (
                            <div className="flex items-center justify-center gap-1.5 text-xs text-[#64748B]">
                              <Check className="h-3.5 w-3.5" style={{ color: '#489FB5' }} />
                              <span>{t('guarantee')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </PricingToggle>

            {/* Enterprise */}
            <div className="mt-8 rounded-2xl border border-dashed border-[#0A1F3D]/15 bg-white p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Building2 className="h-8 w-8 text-[#64748B] shrink-0" />
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#0A1F3D]">{t('enterprise.name')}</h3>
                    <p className="text-sm text-[#64748B]">{t('enterprise.description')}</p>
                  </div>
                </div>
                <a
                  href="https://wa.me/5562998015884"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-[#0A1F3D]/20 px-6 py-2.5 text-sm font-semibold text-[#0A1F3D] hover:bg-[#0A1F3D]/5 transition-colors"
                >
                  {t('enterprise.cta')}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ROI Section */}
        <section className="py-14 px-6 bg-white">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-serif text-[#0A1F3D] text-2xl font-bold text-center mb-2">{t('roi.title')}</h2>
            <p className="text-center text-[#64748B] mb-10">{t('roi.subtitle')}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 rounded-2xl" style={{ backgroundColor: '#489FB5' + '15' }}>
                <div className="text-3xl font-bold mb-2" style={{ color: '#489FB5' }}>{t('roi.stat1Value')}</div>
                <div className="text-sm text-[#64748B]">{t('roi.stat1Label')}</div>
              </div>
              <div className="text-center p-6 rounded-2xl" style={{ backgroundColor: '#C5A059' + '15' }}>
                <div className="text-3xl font-bold mb-2" style={{ color: '#C5A059' }}>{t('roi.stat2Value')}</div>
                <div className="text-sm text-[#64748B]">{t('roi.stat2Label')}</div>
              </div>
              <div className="text-center p-6 rounded-2xl" style={{ backgroundColor: '#0A1F3D' + '08' }}>
                <div className="text-3xl font-bold mb-2 text-[#0A1F3D]">{t('roi.stat3Value')}</div>
                <div className="text-sm text-[#64748B]">{t('roi.stat3Label')}</div>
              </div>
            </div>
            <p className="text-center text-sm text-[#64748B]">💡 {t('roi.note')}</p>
          </div>
        </section>

        {/* Calculadoras */}
        <section className="py-14 px-6">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-8">
              <h2 className="font-serif text-[#0A1F3D] text-xl font-bold mb-2">{t('calculators.title')}</h2>
              <p className="text-sm text-[#64748B]">{t('calculators.subtitle')}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CALCULATOR_LINKS.map((calc) => (
                <Link
                  key={calc.href}
                  href={calc.href}
                  className="relative rounded-xl border border-[#0A1F3D]/8 bg-white px-4 py-3.5 text-center text-sm font-semibold text-[#0A1F3D] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
                >
                  <div className="absolute top-0 left-4 right-4 h-0.5 rounded-b-full" style={{ backgroundColor: calc.color }} />
                  <span>{t(calc.labelKey as any)}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14 px-6 bg-white">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-serif text-[#0A1F3D] text-2xl font-bold text-center mb-12">{t('faq.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {faqPairs.map(([qKey, aKey]) => (
                <div key={qKey}>
                  <h3 className="font-semibold text-[#0A1F3D] mb-2">{t(`faq.${qKey as FaqQ}`)}</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">{t(`faq.${aKey as FaqA}`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 px-6 text-white text-center" style={{ backgroundColor: '#0A1F3D' }}>
          <div className="mx-auto max-w-xl">
            <h2 className="font-serif text-2xl font-bold mb-3">{t('finalCta.title')}</h2>
            <p className="mb-8" style={{ color: 'rgba(255,255,255,0.7)' }}>{t('finalCta.subtitle')}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 font-bold text-sm transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#C5A059', color: '#0A1F3D' }}
              >
                {t('finalCta.btnPrimary')}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://wa.me/5562998015884"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-8 py-3.5 font-semibold text-sm text-white hover:bg-white/10 transition-colors"
              >
                {t('finalCta.btnSecondary')}
              </a>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}
