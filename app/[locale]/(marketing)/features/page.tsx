import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  Check, 
  Gift, 
  Sparkles, 
  Clock, 
  Zap, 
  HelpCircle, 
  ChevronRight, 
  TrendingUp, 
  Users, 
  Info,
  DollarSign
} from 'lucide-react'
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
    <tr className="hover:bg-[#EEF0F8]/30 dark:hover:bg-slate-900/30 transition-colors border-b border-slate-100 dark:border-slate-800/50 last:border-none">
      <td className="py-4 px-5 font-semibold text-sm text-slate-800 dark:text-slate-200">{label}</td>
      <td className="text-center py-4 px-4 text-slate-500 dark:text-slate-400"><CellValue value={free} /></td>
      <td className="text-center py-4 px-4 text-slate-500 dark:text-slate-400"><CellValue value={starter} /></td>
      {/* PRO highlighted column cell */}
      <td className="text-center py-4 px-4 bg-[#C5A059]/4 dark:bg-[#C5A059]/2 border-x border-[#C5A059]/10 font-semibold text-[#C5A059] dark:text-[#ebd2a0]">
        <CellValue value={pro} isPro />
      </td>
      <td className="text-center py-4 px-4 text-slate-500 dark:text-slate-400"><CellValue value={business} /></td>
    </tr>
  )
}

function CellValue({ value, isPro }: { value: string | boolean; isPro?: boolean }) {
  if (value === true) {
    return (
      <Check className={`h-4.5 w-4.5 mx-auto font-bold ${
        isPro ? 'text-[#C5A059] dark:text-[#ebd2a0]' : 'text-emerald-500'
      }`} />
    )
  }
  if (value === false) return <span className="text-slate-300 dark:text-slate-800 font-light">—</span>
  return <span className={`text-xs ${isPro ? 'font-bold' : 'font-medium'}`}>{value}</span>
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function FeaturesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

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
    deals_pro: t('planComparison.values.contacts_pro'), // Fallback if missing or similar
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

  // category accent colors matching clinical identity
  const CATEGORY_ACCENT: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    atendimento_clinico: { 
      bg: 'bg-[#489FB5]/8 dark:bg-[#489FB5]/12', 
      text: 'text-[#489FB5]', 
      border: 'border-slate-100 hover:border-[#489FB5]/30 dark:border-white/5 dark:hover:border-[#489FB5]/30',
      glow: 'from-[#489FB5]/8 via-transparent to-transparent'
    },
    comunicacao_ia: { 
      bg: 'bg-emerald-500/8 dark:bg-emerald-500/12', 
      text: 'text-emerald-600 dark:text-emerald-400', 
      border: 'border-slate-100 hover:border-emerald-500/30 dark:border-white/5 dark:hover:border-emerald-500/30',
      glow: 'from-emerald-500/8 via-transparent to-transparent'
    },
    gestao_compliance: { 
      bg: 'bg-[#C5A059]/8 dark:bg-[#C5A059]/12', 
      text: 'text-[#C5A059]', 
      border: 'border-slate-100 hover:border-[#C5A059]/30 dark:border-white/5 dark:hover:border-[#C5A059]/30',
      glow: 'from-[#C5A059]/8 via-transparent to-transparent'
    },
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

      <div className="bg-white text-[#0A1F3D] min-h-screen relative overflow-hidden dark:bg-slate-950 dark:text-slate-100">
        {/* ════════════════════════════════════════════════════════════
            GLOWS & PATTERNS BACKGROUND
           ════════════════════════════════════════════════════════════ */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:16px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none" />
        
        {/* Floating gradient glows */}
        <div className="absolute top-[-5%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[130px] opacity-30 pointer-events-none bg-gradient-to-br from-[#489FB5]/10 to-transparent" />
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[140px] opacity-25 pointer-events-none bg-gradient-to-br from-[#C5A059]/10 to-transparent" />

        {/* ════════════════════════════════════════════════════════════
            HERO — Serif typography and modern glass badges
           ════════════════════════════════════════════════════════════ */}
        <div className="relative pt-24 pb-16 sm:pt-32 sm:pb-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/25 bg-[#C5A059]/5 px-3.5 py-1 text-xs font-bold text-[#C5A059] mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059] animate-pulse" />
                {t('hero.badge')}
              </div>
              
              <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-[#0A1F3D] dark:text-white leading-[1.1] mb-6">
                {t('hero.title')}
              </h1>
              
              <p className="font-sans text-lg sm:text-xl font-medium text-slate-500 dark:text-slate-400 leading-relaxed mb-10 max-w-2xl mx-auto">
                {t('hero.subtitle')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="h-12 px-8 text-base bg-[#0A1F3D] hover:bg-[#162D54] text-white shadow-lg shadow-[#0A1F3D]/15 rounded-xl transition-all duration-300 hover:-translate-y-0.5 dark:bg-[#C5A059] dark:text-[#0A1F3D] dark:hover:bg-[#b8913f] dark:shadow-[#C5A059]/10">
                  <Link href="/register">
                    {t('hero.cta')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-[#0A1F3D] dark:text-white dark:border-white/10 dark:hover:bg-slate-900 rounded-xl transition-all duration-300 hover:-translate-y-0.5">
                  <Link href="/precos">{t('hero.ctaSecondary')}</Link>
                </Button>
              </div>
            </div>

            {/* Quick nav with refined glassmorphism pills */}
            <div className="mt-20 flex flex-wrap justify-center gap-3">
              {FEATURE_CATEGORIES.map((cat) => (
                <Link
                  key={cat.menuKey}
                  href={`#${cat.menuKey}`}
                  className="rounded-full backdrop-blur-md bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-white/5 px-5 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:border-[#489FB5]/40 hover:text-[#489FB5] dark:hover:text-white transition-all shadow-sm hover:shadow"
                >
                  {t(`nav.features_menu.${cat.menuKey}` as any)}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════
            TRIAL BANNER — Glassmorphism Box
           ════════════════════════════════════════════════════════════ */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-20">
          <div className="relative overflow-hidden rounded-3xl border border-[#C5A059]/20 bg-gradient-to-r from-white/80 to-[#EEF0F8]/40 dark:from-slate-900/80 dark:to-slate-950/40 p-6 sm:p-8 shadow-xl shadow-[#0A1F3D]/2 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[60px] opacity-10 bg-[#C5A059]" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20">
                <Gift className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#0A1F3D] dark:text-white">7 dias grátis com acesso completo</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Sem compromisso e sem precisar de cartão de crédito. Configure em instantes.</p>
              </div>
            </div>
            <Button asChild size="lg" className="relative z-10 shrink-0 h-11 px-6 bg-[#0A1F3D] hover:bg-[#162D54] text-white shadow-md rounded-xl transition-all duration-300 hover:-translate-y-0.5 dark:bg-[#C5A059] dark:text-[#0A1F3D] dark:hover:bg-[#b8913f] dark:shadow-[#C5A059]/10">
              <Link href="/register">Começar Grátis</Link>
            </Button>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════
            FEATURE CATEGORIES — Elegant Glass Grid
           ════════════════════════════════════════════════════════════ */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-28 pb-28">
          {FEATURE_CATEGORIES.map((cat) => {
            const accent = CATEGORY_ACCENT[cat.menuKey] ?? { 
              bg: 'bg-primary/10', 
              text: 'text-primary', 
              border: 'border-primary/20', 
              glow: 'from-primary/10 via-transparent to-transparent' 
            }
            return (
              <section key={cat.menuKey} id={cat.menuKey} className="scroll-mt-24">
                {/* Section Header */}
                <div className="text-center mb-16 relative">
                  {/* Subtle dynamic glow under title */}
                  <div className={`absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-20 rounded-full blur-2xl opacity-15 bg-gradient-to-r ${accent.glow}`} />
                  
                  <div className="inline-flex items-center gap-2 mb-3">
                    <div className="h-px w-6 bg-[#C5A059]" />
                    <span className={`text-xs font-bold uppercase tracking-[0.2em] ${accent.text}`}>
                      {t(`nav.features_menu.${cat.menuKey}` as any)}
                    </span>
                    <div className="h-px w-6 bg-[#C5A059]" />
                  </div>
                  <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl text-[#0A1F3D] dark:text-white">
                    {t(`categoryTitles.${cat.menuKey}` as any)}
                  </h2>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {cat.sections.flatMap((sec) =>
                    sec.features.map((feature) => {
                      const name = tSections(`${sec.sectionKey}.${feature.featureKey}.name` as any)
                      const description = tSections(`${sec.sectionKey}.${feature.featureKey}.description` as any)
                      return (
                        <Link
                          key={feature.slug}
                          href={`/features/${feature.slug}`}
                          className={`group relative block rounded-2xl border ${accent.border} bg-white/60 dark:bg-slate-900/40 p-6 shadow-sm hover:shadow-xl hover:shadow-[#0A1F3D]/3 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5`}
                        >
                          {/* Soft border gradient glow */}
                          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#489FB5]/40 to-[#C5A059]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />
                          
                          <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl ${accent.bg} ${accent.text} border ${accent.border} group-hover:scale-110 transition-transform duration-300`}>
                            <feature.icon className="h-5 w-5" />
                          </div>
                          
                          <h3 className="font-bold text-base text-[#0A1F3D] dark:text-white mb-2 group-hover:text-[#489FB5] transition-colors">
                            {name}
                          </h3>
                          
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                            {description}
                          </p>
                          
                          <div className={`mt-4 flex items-center gap-1 text-xs font-bold ${accent.text} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                            Ver detalhes <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
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

        {/* ════════════════════════════════════════════════════════════
            PLAN COMPARISON — Sophisticated Golden Table
           ════════════════════════════════════════════════════════════ */}
        <div className="py-24 border-t border-slate-100 dark:border-slate-900 bg-slate-50/30 dark:bg-transparent">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-[#C5A059]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#C5A059]">Preços</span>
              </div>
              <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl text-[#0A1F3D] dark:text-white">
                {t('planComparison.title')}
              </h2>
              <p className="mt-4 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
                {t('planComparison.subtitle')}
              </p>
            </div>

            {/* Premium Table Container */}
            <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white/60 shadow-xl shadow-[#0A1F3D]/2 backdrop-blur-md p-2 dark:border-slate-800 dark:bg-slate-900/60">
              <table className="w-full text-sm border-collapse min-w-[750px]">
                <thead>
                  <tr className="border-b-2 border-slate-100 dark:border-slate-800/80">
                    <th className="text-left py-4 px-5 font-bold text-slate-800 dark:text-white w-[30%]">
                      {t('planComparison.col_feature')}
                    </th>
                    <th className="text-center py-4 px-4 font-bold text-slate-800 dark:text-white">
                      {t('planComparison.col_free')}
                    </th>
                    <th className="text-center py-4 px-4 font-bold text-slate-800 dark:text-white">
                      {t('planComparison.col_starter')}
                      <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                        {t('planComparison.starter_price')}
                      </span>
                    </th>
                    {/* RECOMMENDED PRO PLAN HEADER */}
                    <th className="text-center py-4 px-4 bg-[#C5A059]/6 dark:bg-[#C5A059]/4 border-x border-t border-[#C5A059]/20 rounded-t-2xl font-bold text-[#C5A059] relative">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#C5A059] to-[#8B6E32] px-2 py-0.5 text-[8px] font-bold text-white uppercase tracking-wider shadow-sm">
                        Recomendado
                      </div>
                      <span className="dark:text-[#ebd2a0]">{t('planComparison.col_pro')}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                        {t('planComparison.pro_price')}
                      </span>
                    </th>
                    <th className="text-center py-4 px-4 font-bold text-slate-800 dark:text-white">
                      {t('planComparison.col_business')}
                      <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                        {t('planComparison.business_price')}
                      </span>
                    </th>
                  </tr>
                </thead>
                
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
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

            {/* Table CTAs */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-12 px-8 text-base bg-[#0A1F3D] hover:bg-[#162D54] text-white shadow-lg rounded-xl transition-all duration-300 hover:-translate-y-0.5 dark:bg-[#C5A059] dark:text-[#0A1F3D] dark:hover:bg-[#b8913f] dark:shadow-[#C5A059]/10">
                <Link href="/precos">{t('planComparison.ctaPrimary')}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-[#0A1F3D] dark:text-white dark:border-white/10 dark:hover:bg-slate-900 rounded-xl transition-all duration-300 hover:-translate-y-0.5">
                <Link href="/indique">
                  <Gift className="w-4 h-4 mr-2 text-[#C5A059]" />
                  Indique e ganhe até 100% off
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════
            FINAL CTA — Glassmorphism Premium Banner
           ════════════════════════════════════════════════════════════ */}
        <div className="py-24 border-t border-slate-100 dark:border-slate-900 bg-slate-50/40 dark:bg-slate-900/10 relative overflow-hidden">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white p-10 sm:p-14 text-center shadow-2xl shadow-[#0A1F3D]/5 dark:border-slate-800 dark:bg-slate-900">
              {/* Internal subtle glow backgrounds */}
              <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[110px] opacity-15 pointer-events-none bg-[#489FB5]" />
              <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full blur-[90px] opacity-10 pointer-events-none bg-[#C5A059]" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/5 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-6">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-medium">Gratuito e Sem Compromisso</span>
                </div>

                <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl text-[#0A1F3D] dark:text-white mb-4">
                  {t('cta.title')}
                </h2>
                <p className="mt-4 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  {t('cta.subtitle')}
                </p>

                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="h-12 px-8 text-base bg-[#0A1F3D] hover:bg-[#162D54] text-white shadow-xl shadow-[#0A1F3D]/25 rounded-xl transition-all hover:-translate-y-0.5 dark:bg-[#C5A059] dark:text-[#0A1F3D] dark:hover:bg-[#b8913f] dark:shadow-[#C5A059]/10">
                    <Link href="/register">
                      {t('cta.button')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base border-slate-200 text-[#0A1F3D] hover:bg-slate-50 rounded-xl transition-all hover:-translate-y-0.5 dark:border-slate-800 dark:text-white dark:hover:bg-slate-900">
                    <Link href="/precos">{t('cta.buttonSecondary')}</Link>
                  </Button>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-emerald-500" />
                    Sem cartão de crédito
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <span className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-emerald-500" />
                    Configuração em 5 minutos
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
