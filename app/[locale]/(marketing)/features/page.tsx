import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Check, Gift } from 'lucide-react'
import { FEATURE_CATEGORIES, ALL_FEATURES } from '@/config/features-data'

import { buildLocaleAlternates } from '@/lib/seo/canonical'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'marketing.features.meta' })
  const alternates = buildLocaleAlternates(locale, '/features')
  return {
    title: t('title'),
    description: t('description'),
    keywords: [
      'software clínica estética 2026', 'agenda online clínica', 'prontuário eletrônico estética',
      'whatsapp clínica estética', 'recall automático pacientes', 'anamnese digital clínica',
      'estetia crm', 'gestão clínica dermato', 'lgpd clínica médica', 'tiss convênios',
    ],
    alternates,
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url: alternates.canonical,
      images: [{ url: 'https://estetiacrm.com.br/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('twitterTitle'),
      description: t('twitterDescription'),
    },
  }
}

// ─── Plan Row ─────────────────────────────────────────────────────────────────

function PlanRow({
  label, free, starter, pro, business,
}: {
  label: string
  free: string | boolean
  starter: string | boolean
  pro: string | boolean
  business: string | boolean
}) {
  return (
    <tr>
      <td className="py-3 px-4 font-medium">{label}</td>
      <td className="text-center py-3 px-4"><CellValue value={free} /></td>
      <td className="text-center py-3 px-4"><CellValue value={starter} /></td>
      <td className="text-center py-3 px-4"><CellValue value={pro} /></td>
      <td className="text-center py-3 px-4"><CellValue value={business} /></td>
    </tr>
  )
}

function CellValue({ value }: { value: string | boolean }) {
  if (value === true) return <Check className="h-4 w-4 text-green-500 mx-auto" />
  if (value === false) return <span className="text-muted-foreground">—</span>
  return <span className="text-muted-foreground">{value}</span>
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function FeaturesPage() {
  const t = await getTranslations('marketing.features')
  const tSections = await getTranslations('marketing.features.sections')

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://estetiacrm.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Funcionalidades', item: 'https://estetiacrm.com.br/features' },
    ],
  }

  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Estetia CRM',
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web, iOS, Android',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'BRL',
      lowPrice: '0',
      highPrice: '397',
      offerCount: '4',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '120',
    },
    description: 'Sistema completo para clínicas de estética: agenda inteligente, prontuário eletrônico, anamnese digital, WhatsApp Business, recall automático, TISS e LGPD.',
    featureList: ALL_FEATURES.map((f) => f.slug),
  }

  // plan comparison — typed accessors
  const pr = {
    contacts: t('planComparison.rows.contacts'),
    deals: t('planComparison.rows.deals'),
    pipelines: t('planComparison.rows.pipelines'),
    users: t('planComparison.rows.users'),
    whatsapp: t('planComparison.rows.whatsapp'),
    prospecting: t('planComparison.rows.prospecting'),
    emailAutomations: t('planComparison.rows.emailAutomations'),
    dealAutomations: t('planComparison.rows.dealAutomations'),
    agi: t('planComparison.rows.agi'),
    advancedAnalytics: t('planComparison.rows.advancedAnalytics'),
    customReports: t('planComparison.rows.customReports'),
    api: t('planComparison.rows.api'),
    googleCalendar: t('planComparison.rows.googleCalendar'),
    ads: t('planComparison.rows.ads'),
    n8n: t('planComparison.rows.n8n'),
    roundRobin: t('planComparison.rows.roundRobin'),
    sso: t('planComparison.rows.sso'),
    gpsCheckin: t('planComparison.rows.gpsCheckin'),
    pwa: t('planComparison.rows.pwa'),
    support: t('planComparison.rows.support'),
  }
  const pv = {
    contacts_free: t('planComparison.values.contacts_free'),
    contacts_starter: t('planComparison.values.contacts_starter'),
    contacts_pro: t('planComparison.values.contacts_pro'),
    contacts_business: t('planComparison.values.contacts_business'),
    deals_free: t('planComparison.values.deals_free'),
    deals_starter: t('planComparison.values.deals_starter'),
    deals_pro: t('planComparison.values.deals_pro'),
    deals_business: t('planComparison.values.deals_business'),
    pipelines_free: t('planComparison.values.pipelines_free'),
    pipelines_starter: t('planComparison.values.pipelines_starter'),
    pipelines_pro: t('planComparison.values.pipelines_pro'),
    pipelines_business: t('planComparison.values.pipelines_business'),
    users_free: t('planComparison.values.users_free'),
    users_starter: t('planComparison.values.users_starter'),
    users_pro: t('planComparison.values.users_pro'),
    users_business: t('planComparison.values.users_business'),
    whatsapp_starter: t('planComparison.values.whatsapp_starter'),
    whatsapp_pro: t('planComparison.values.whatsapp_pro'),
    whatsapp_business: t('planComparison.values.whatsapp_business'),
    prospecting_starter: t('planComparison.values.prospecting_starter'),
    prospecting_pro: t('planComparison.values.prospecting_pro'),
    prospecting_business: t('planComparison.values.prospecting_business'),
    emailAutomations_starter: t('planComparison.values.emailAutomations_starter'),
    emailAutomations_pro: t('planComparison.values.emailAutomations_pro'),
    emailAutomations_business: t('planComparison.values.emailAutomations_business'),
    dealAutomations_starter: t('planComparison.values.dealAutomations_starter'),
    dealAutomations_pro: t('planComparison.values.dealAutomations_pro'),
    dealAutomations_business: t('planComparison.values.dealAutomations_business'),
    support_free: t('planComparison.values.support_free'),
    support_starter: t('planComparison.values.support_starter'),
    support_pro: t('planComparison.values.support_pro'),
    support_business: t('planComparison.values.support_business'),
  }

  // category accent colors
  const CATEGORY_ACCENT: Record<string, { bg: string; text: string; border: string }> = {
    atendimento_clinico: { bg: 'bg-[#489FB5]/10', text: 'text-[#489FB5]', border: 'border-[#489FB5]/20' },
    comunicacao_ia:     { bg: 'bg-green-500/10',  text: 'text-green-600',  border: 'border-green-500/20' },
    gestao_compliance:  { bg: 'bg-[#C5A059]/10',  text: 'text-[#C5A059]', border: 'border-[#C5A059]/20' },
  }

  return (
    <>
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="software-app-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />

      <div className="bg-background">
        {/* Hero */}
        <div className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="outline" className="mb-4 text-primary border-primary/30">
                {t('hero.badge')}
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                {t('hero.title')}
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                {t('hero.subtitle')}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/register">
                    {t('hero.cta')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/pricing">{t('hero.ctaSecondary')}</Link>
                </Button>
              </div>
            </div>

            {/* Quick nav */}
            <div className="mt-16 flex flex-wrap justify-center gap-2">
              {FEATURE_CATEGORIES.map((cat) => (
                <Button
                  key={cat.menuKey}
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary"
                >
                  <a href={`#${cat.menuKey}`}>
                    {t(`nav.features_menu.${cat.menuKey}` as any)}
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Trial Banner */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-16">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-bold text-lg">7 dias grátis com acesso completo</p>
              <p className="text-sm text-muted-foreground">Sem cartão de crédito. Configure em 5 minutos.</p>
            </div>
            <Button asChild className="shrink-0">
              <Link href="/register">Começar grátis</Link>
            </Button>
          </div>
        </div>

        {/* Feature Categories */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-24 pb-24">
          {FEATURE_CATEGORIES.map((cat) => {
            const accent = CATEGORY_ACCENT[cat.menuKey] ?? { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20' }
            return (
              <section key={cat.menuKey} id={cat.menuKey} className="scroll-mt-20">
                <div className="text-center mb-12">
                  <span className={`inline-block text-xs font-semibold uppercase tracking-[0.2em] mb-3 ${accent.text}`}>
                    {t(`nav.features_menu.${cat.menuKey}` as any)}
                  </span>
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {t(`categoryTitles.${cat.menuKey}` as any)}
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {cat.sections.flatMap((sec) =>
                    sec.features.map((feature) => {
                      const name = tSections(`${sec.sectionKey}.${feature.featureKey}.name` as any)
                      const description = tSections(`${sec.sectionKey}.${feature.featureKey}.description` as any)
                      return (
                        <Link
                          key={feature.slug}
                          href={`/features/${feature.slug}`}
                          className={`group block rounded-xl border ${accent.border} bg-background p-5 hover:border-primary/40 hover:shadow-md transition-all`}
                        >
                          <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${accent.bg} ${accent.text} group-hover:scale-110 transition-transform`}>
                            <feature.icon className="h-5 w-5" />
                          </div>
                          <h3 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors">
                            {name}
                          </h3>
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                            {description}
                          </p>
                          <div className={`mt-3 flex items-center gap-1 text-xs font-medium ${accent.text} opacity-0 group-hover:opacity-100 transition-opacity`}>
                            Ver detalhes <ArrowRight className="h-3 w-3" />
                          </div>
                        </Link>
                      )
                    })
                  )}
                </div>
              </section>
            )
          })}
        </div>

        {/* Plan Comparison */}
        <div className="bg-muted/30 py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('planComparison.title')}</h2>
              <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('planComparison.subtitle')}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-left py-3 px-4 font-semibold w-1/3">{t('planComparison.col_feature')}</th>
                    <th className="text-center py-3 px-4 font-semibold">{t('planComparison.col_free')}</th>
                    <th className="text-center py-3 px-4 font-semibold">{t('planComparison.col_starter')}<br /><span className="text-xs text-muted-foreground font-normal">{t('planComparison.starter_price')}</span></th>
                    <th className="text-center py-3 px-4 font-semibold">{t('planComparison.col_pro')}<br /><span className="text-xs text-muted-foreground font-normal">{t('planComparison.pro_price')}</span></th>
                    <th className="text-center py-3 px-4 font-semibold">{t('planComparison.col_business')}<br /><span className="text-xs text-muted-foreground font-normal">{t('planComparison.business_price')}</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <PlanRow label={pr.contacts} free={pv.contacts_free} starter={pv.contacts_starter} pro={pv.contacts_pro} business={pv.contacts_business} />
                  <PlanRow label={pr.deals} free={pv.deals_free} starter={pv.deals_starter} pro={pv.deals_pro} business={pv.deals_business} />
                  <PlanRow label={pr.pipelines} free={pv.pipelines_free} starter={pv.pipelines_starter} pro={pv.pipelines_pro} business={pv.pipelines_business} />
                  <PlanRow label={pr.users} free={pv.users_free} starter={pv.users_starter} pro={pv.users_pro} business={pv.users_business} />
                  <PlanRow label={pr.whatsapp} free={false} starter={pv.whatsapp_starter} pro={pv.whatsapp_pro} business={pv.whatsapp_business} />
                  <PlanRow label={pr.prospecting} free={false} starter={pv.prospecting_starter} pro={pv.prospecting_pro} business={pv.prospecting_business} />
                  <PlanRow label={pr.emailAutomations} free={false} starter={pv.emailAutomations_starter} pro={pv.emailAutomations_pro} business={pv.emailAutomations_business} />
                  <PlanRow label={pr.dealAutomations} free={false} starter={pv.dealAutomations_starter} pro={pv.dealAutomations_pro} business={pv.dealAutomations_business} />
                  <PlanRow label={pr.agi} free={false} starter={false} pro={true} business={true} />
                  <PlanRow label={pr.advancedAnalytics} free={false} starter={false} pro={true} business={true} />
                  <PlanRow label={pr.customReports} free={false} starter={false} pro={false} business={true} />
                  <PlanRow label={pr.api} free={false} starter={false} pro={true} business={true} />
                  <PlanRow label={pr.googleCalendar} free={false} starter={true} pro={true} business={true} />
                  <PlanRow label={pr.ads} free={false} starter={false} pro={true} business={true} />
                  <PlanRow label={pr.n8n} free={false} starter={true} pro={true} business={true} />
                  <PlanRow label={pr.roundRobin} free={false} starter={false} pro={false} business={true} />
                  <PlanRow label={pr.sso} free={false} starter={false} pro={false} business={true} />
                  <PlanRow label={pr.gpsCheckin} free={true} starter={true} pro={true} business={true} />
                  <PlanRow label={pr.pwa} free={true} starter={true} pro={true} business={true} />
                  <PlanRow label={pr.support} free={pv.support_free} starter={pv.support_starter} pro={pv.support_pro} business={pv.support_business} />
                </tbody>
              </table>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/pricing">{t('planComparison.ctaPrimary')}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/indique">
                  <Gift className="w-4 h-4 mr-2" />
                  Indique e ganhe até 100% off
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="py-24">
          <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t('cta.title')}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t('cta.subtitle')}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/register">
                  {t('cta.button')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/pricing">{t('cta.buttonSecondary')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
