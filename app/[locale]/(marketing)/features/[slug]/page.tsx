import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { buildLocaleAlternates } from '@/lib/seo/canonical'
import Link from 'next/link'
import Script from 'next/script'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Lightbulb,
  Info,
  ChevronDown,
  User,
  Briefcase,
  Building2,
  HelpCircle,
  Sparkles,
} from 'lucide-react'
import { ALL_FEATURES, FEATURE_CATEGORIES, getFeatureBySlug } from '@/config/features-data'
import FeatureMockupSelector from '@/components/marketing/feature-mockups'

export function generateStaticParams() {
  return ALL_FEATURES.map((f) => ({ slug: f.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const feature = getFeatureBySlug(slug)
  if (!feature) return {}

  const t = await getTranslations({ locale, namespace: 'marketing.features.sections' })
  const name = t(`${feature.sectionKey}.${feature.featureKey}.name` as any)
  const description = t(`${feature.sectionKey}.${feature.featureKey}.description` as any)
  const alternates = buildLocaleAlternates(locale, `/features/${slug}`)

  return {
    title: `${name} | Estetia CRM`,
    description,
    alternates,
    openGraph: {
      title: `${name} — Estetia CRM`,
      description,
      url: alternates.canonical,
    },
  }
}

// Safely try a translation key — returns null if missing.
function tryT(t: any, key: string): string | null {
  try {
    const val = t(key)
    if (typeof val !== 'string') return null
    if (val === key) return null
    const lastSegment = key.split('.').pop()
    if (val === lastSegment) return null
    if (val.includes('marketing.features.sections.')) return null
    if (val.includes('.detail.')) return null
    return val
  } catch {
    return null
  }
}

// Color themes per section with premium palettes
const SECTION_THEMES: Record<string, { accent: string; accentBg: string; accentBorder: string; gradient: string }> = {
  atendimento: { 
    accent: 'text-[#489FB5]', 
    accentBg: 'bg-[#489FB5]/8 dark:bg-[#489FB5]/12', 
    accentBorder: 'border-[#489FB5]/20 dark:border-[#489FB5]/30', 
    gradient: 'from-[#489FB5]/8 via-transparent to-transparent' 
  },
  comunicacao: { 
    accent: 'text-[#5E5DF0]', 
    accentBg: 'bg-[#5E5DF0]/8 dark:bg-[#5E5DF0]/12', 
    accentBorder: 'border-[#5E5DF0]/20 dark:border-[#5E5DF0]/30', 
    gradient: 'from-[#5E5DF0]/8 via-transparent to-transparent' 
  },
  gestao: { 
    accent: 'text-[#C5A059]', 
    accentBg: 'bg-[#C5A059]/8 dark:bg-[#C5A059]/12', 
    accentBorder: 'border-[#C5A059]/20 dark:border-[#C5A059]/30', 
    gradient: 'from-[#C5A059]/8 via-transparent to-transparent' 
  },
}

const PERSONA_ICONS = [User, Briefcase, Building2]

export default async function FeatureDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const feature = getFeatureBySlug(slug)
  if (!feature) notFound()

  const t = await getTranslations('marketing.features')
  const tS = await getTranslations('marketing.features.sections')
  const dp = `${feature.sectionKey}.${feature.featureKey}.detail`

  const name = tS(`${feature.sectionKey}.${feature.featureKey}.name` as any)
  const description = tS(`${feature.sectionKey}.${feature.featureKey}.description` as any)
  const sectionTitle = tS(`${feature.sectionKey}.title` as any)
  const sectionSubtitle = tS(`${feature.sectionKey}.subtitle` as any)
  const theme = SECTION_THEMES[feature.sectionKey] || SECTION_THEMES.gestao

  // Detail data
  const headline = tryT(tS, `${dp}.headline` as any)
  const planInfo = tryT(tS, `${dp}.planInfo` as any)
  const howTitle = tryT(tS, `${dp}.howItWorks.title` as any)

  // Benefits with title + text
  type Benefit = { title: string; text: string }
  const benefits: Benefit[] = []
  for (let i = 1; i <= 6; i++) {
    const title = tryT(tS, `${dp}.benefits.${i}.title` as any)
    const text = tryT(tS, `${dp}.benefits.${i}.text` as any)
    if (title && text) benefits.push({ title, text })
    else break
  }

  // Use cases with persona + scenario
  type UseCase = { persona: string; scenario: string }
  const useCases: UseCase[] = []
  for (let i = 1; i <= 3; i++) {
    const persona = tryT(tS, `${dp}.useCases.${i}.persona` as any)
    const scenario = tryT(tS, `${dp}.useCases.${i}.scenario` as any)
    if (persona && scenario) useCases.push({ persona, scenario })
    else break
  }

  // How it works with title + text
  type Step = { title: string; text: string }
  const howSteps: Step[] = []
  for (let i = 1; i <= 4; i++) {
    const title = tryT(tS, `${dp}.howItWorks.${i}.title` as any)
    const text = tryT(tS, `${dp}.howItWorks.${i}.text` as any)
    if (title && text) howSteps.push({ title, text })
    else break
  }

  // FAQ
  type FAQ = { q: string; a: string }
  const faqs: FAQ[] = []
  for (let i = 1; i <= 5; i++) {
    const q = tryT(tS, `${dp}.faq.${i}.q` as any)
    const a = tryT(tS, `${dp}.faq.${i}.a` as any)
    if (q && a) faqs.push({ q, a })
    else break
  }

  // Sibling features
  const parentCategory = FEATURE_CATEGORIES.find((cat) =>
    cat.sections.some((sec) => sec.features.some((f) => f.slug === slug))
  )
  const parentSection = parentCategory?.sections.find((sec) =>
    sec.features.some((f) => f.slug === slug)
  )
  const siblingFeatures = parentSection?.features.filter((f) => f.slug !== slug) ?? []

  // Prev/next
  const idx = ALL_FEATURES.findIndex((f) => f.slug === slug)
  const prev = idx > 0 ? ALL_FEATURES[idx - 1] : null
  const next = idx < ALL_FEATURES.length - 1 ? ALL_FEATURES[idx + 1] : null

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://estetiacrm.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Funcionalidades', item: 'https://estetiacrm.com.br/features' },
      { '@type': 'ListItem', position: 3, name, item: `https://estetiacrm.com.br/features/${slug}` },
    ],
  }

  return (
    <>
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="bg-white text-[#0A1F3D] min-h-screen relative overflow-hidden dark:bg-slate-950 dark:text-slate-100">
        {/* ════════════════════════════════════════════════════════════
            GLOWS & PATTERNS BACKGROUND
           ════════════════════════════════════════════════════════════ */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:16px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none" />
        
        {/* Floating gradient glows */}
        <div className={`absolute top-[-10%] left-[-15%] w-[600px] h-[600px] rounded-full blur-[140px] opacity-40 pointer-events-none bg-gradient-to-br ${theme.gradient}`} />
        <div className="absolute top-[25%] right-[-15%] w-[500px] h-[500px] rounded-full blur-[130px] opacity-25 pointer-events-none bg-[#C5A059]/10 dark:bg-[#C5A059]/5" />

        {/* ════════════════════════════════════════════════════════════
            HERO — 2 columns, mockup on right, serif typography
           ════════════════════════════════════════════════════════════ */}
        <div className="relative pt-20 pb-20 sm:pt-28 sm:pb-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-10">
              <Link href="/features" className="hover:text-[#489FB5] transition-colors">
                Funcionalidades
              </Link>
              <span className="text-slate-300 dark:text-slate-800">/</span>
              <Link href={`/features#${feature.sectionKey}`} className="hover:text-[#489FB5] transition-colors">
                {sectionTitle}
              </Link>
              <span className="text-slate-300 dark:text-slate-800">/</span>
              <span className="text-[#0A1F3D] font-bold dark:text-white">{name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Text column */}
              <div className="lg:col-span-7 text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/25 bg-[#C5A059]/5 px-3.5 py-1 text-xs font-bold text-[#C5A059] mb-6">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059] animate-pulse" />
                  {sectionTitle}
                </div>

                <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-[#0A1F3D] dark:text-white leading-[1.1] mb-6">
                  {name}
                </h1>

                {headline && (
                  <p className="font-sans text-lg sm:text-xl font-medium text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                    {headline}
                  </p>
                )}

                <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400 mb-10 max-w-2xl">
                  {description}
                </p>

                {/* Call To Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="h-12 px-8 text-base bg-[#0A1F3D] hover:bg-[#162D54] text-white shadow-lg shadow-[#0A1F3D]/15 rounded-xl transition-all duration-300 hover:-translate-y-0.5 dark:bg-[#C5A059] dark:text-[#0A1F3D] dark:hover:bg-[#b8913f] dark:shadow-[#C5A059]/10">
                    <Link href="/register">
                      Testar Grátis
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-[#0A1F3D] dark:text-white dark:border-white/10 dark:hover:bg-slate-900 rounded-xl transition-all duration-300 hover:-translate-y-0.5">
                    <Link href="/precos">Ver Planos</Link>
                  </Button>
                </div>
              </div>

              {/* Mockup Column (Desktop) */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="hidden lg:block w-full max-w-[460px]">
                  <FeatureMockupSelector slug={slug} />
                </div>
              </div>
            </div>

            {/* Mockup (Mobile/Tablet) */}
            <div className="mt-12 lg:hidden w-full max-w-[460px] mx-auto">
              <FeatureMockupSelector slug={slug} />
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════
            BENEFITS — Glassmorphism Cards Grid
           ════════════════════════════════════════════════════════════ */}
        {benefits.length > 0 && (
          <div className="py-24 border-t border-slate-100 dark:border-slate-900 relative">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mb-16">
                <div className="inline-flex items-center gap-2 mb-3">
                  <div className="h-px w-6 bg-[#C5A059]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#C5A059]">Benefícios</span>
                </div>
                <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl text-[#0A1F3D] dark:text-white">
                  O que você ganha com a nossa {name}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {benefits.map((b, i) => (
                  <div 
                    key={i} 
                    className="group relative rounded-2xl border border-slate-100 bg-white/60 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-md hover:border-[#489FB5]/30 dark:border-white/5 dark:bg-slate-900/50 hover:-translate-y-0.5"
                  >
                    <div className="flex gap-4">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${theme.accentBg} ${theme.accent} border ${theme.accentBorder} mt-0.5 group-hover:scale-110 transition-transform duration-300`}>
                        <Check className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-[#0A1F3D] dark:text-white mb-1.5 group-hover:text-[#489FB5] transition-colors">
                          {b.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {b.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            HOW IT WORKS — Vertical timeline with golden indicators
           ════════════════════════════════════════════════════════════ */}
        {howSteps.length > 0 && (
          <div className="py-24 bg-slate-50/50 border-t border-slate-100 dark:bg-slate-900/20 dark:border-slate-900">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mb-16">
                <div className="inline-flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-[#C5A059]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#C5A059]">Metodologia</span>
                </div>
                <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl text-[#0A1F3D] dark:text-white">
                  {howTitle || 'Como funciona na prática'}
                </h2>
              </div>

              <div className="relative max-w-3xl mx-auto md:mx-0">
                {/* Vertical line with gradient */}
                <div className="absolute left-5 top-2 bottom-6 w-0.5 bg-gradient-to-b from-[#0A1F3D]/20 via-[#C5A059]/20 to-transparent hidden md:block dark:from-slate-800 dark:via-[#C5A059]/10" />

                <div className="space-y-12">
                  {howSteps.map((step, i) => (
                    <div key={i} className="relative flex flex-col md:flex-row gap-6 md:gap-8 group">
                      {/* Number circle */}
                      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0A1F3D] to-[#489FB5] text-white font-bold text-sm shadow-md transition-transform group-hover:scale-110 duration-300 dark:from-[#C5A059] dark:to-[#8B6E32] dark:text-[#0A1F3D]">
                        {i + 1}
                      </div>

                      <div className="pb-2">
                        <h3 className="font-bold text-lg text-[#0A1F3D] dark:text-white mb-2 group-hover:text-[#489FB5] transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                          {step.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            USE CASES — Persona cards with dynamic glow top borders
           ════════════════════════════════════════════════════════════ */}
        {useCases.length > 0 && (
          <div className="py-24 border-t border-slate-100 dark:border-slate-900">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mb-16">
                <div className="inline-flex items-center gap-2 mb-3">
                  <div className="h-px w-6 bg-[#C5A059]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#C5A059]">Casos de Uso</span>
                </div>
                <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl text-[#0A1F3D] dark:text-white">
                  Quem usa e como se beneficia no dia a dia
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {useCases.map((uc, i) => {
                  const PersonaIcon = PERSONA_ICONS[i % PERSONA_ICONS.length]
                  return (
                    <div
                      key={i}
                      className="group relative rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-xl hover:shadow-[#0A1F3D]/5 transition-all duration-300 hover:-translate-y-1.5 dark:border-white/5 dark:bg-slate-900"
                    >
                      {/* Hover border glow top */}
                      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-[#489FB5] to-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${theme.accentBg} ${theme.accent} border ${theme.accentBorder} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                        <PersonaIcon className="h-6 w-6" />
                      </div>

                      <div className="mb-3">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.accent}`}>
                          {uc.persona}
                        </span>
                      </div>

                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {uc.scenario}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            PLAN INFO — Elegant informative banner
           ════════════════════════════════════════════════════════════ */}
        {planInfo && (
          <div className="py-12 border-t border-slate-100 dark:border-slate-900 bg-slate-50/30 dark:bg-transparent">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className={`relative overflow-hidden rounded-2xl border ${theme.accentBorder} p-6 sm:p-8 bg-white/70 backdrop-blur-md dark:bg-slate-900/60`}>
                <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${theme.accentBg} ${theme.accent} border ${theme.accentBorder}`}>
                    <Info className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#0A1F3D] dark:text-white mb-0.5">Disponibilidade por plano</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{planInfo}</p>
                  </div>
                  <div className="sm:ml-auto shrink-0 mt-3 sm:mt-0">
                    <Button asChild variant="outline" size="sm" className="rounded-lg text-xs font-semibold border-slate-200 text-[#0A1F3D] hover:bg-slate-50 dark:border-slate-800 dark:text-white dark:hover:bg-slate-800">
                      <Link href="/precos">Comparar planos</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            FAQ — Clean fluid accordion
           ════════════════════════════════════════════════════════════ */}
        {faqs.length > 0 && (
          <div className="py-24 bg-slate-50/50 border-t border-slate-100 dark:bg-slate-900/20 dark:border-slate-900">
            <div className="mx-auto max-w-3xl px-6 lg:px-8">
              <div className="mb-16 text-center">
                <div className="inline-flex items-center gap-2 mb-3">
                  <div className="h-px w-6 bg-[#C5A059]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#C5A059]">Suporte</span>
                  <div className="h-px w-6 bg-[#C5A059]" />
                </div>
                <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl text-[#0A1F3D] dark:text-white">
                  Perguntas Frequentes
                </h2>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <details
                    key={i}
                    className="group rounded-2xl border border-slate-100 bg-white transition-all duration-200 hover:shadow-sm dark:border-slate-800/80 dark:bg-slate-900"
                  >
                    <summary className="flex items-center justify-between cursor-pointer p-5 text-sm font-bold text-[#0A1F3D] dark:text-white select-none">
                      <div className="flex items-center gap-3">
                        <HelpCircle className="h-4.5 w-4.5 text-[#489FB5] shrink-0" />
                        {faq.q}
                      </div>
                      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 transition-transform duration-300 group-open:rotate-180" />
                    </summary>
                    <div className="px-5 pb-5 pt-0 text-xs text-slate-600 dark:text-slate-400 leading-relaxed ml-7 border-t border-slate-50 pt-4 dark:border-slate-800/50">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            RELATED FEATURES — Sister features cards
           ════════════════════════════════════════════════════════════ */}
        {siblingFeatures.length > 0 && (
          <div className="py-24 border-t border-slate-100 dark:border-slate-900">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mb-16">
                <div className="inline-flex items-center gap-2 mb-3">
                  <div className="h-px w-6 bg-[#C5A059]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#C5A059]">{sectionTitle}</span>
                </div>
                <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl text-[#0A1F3D] dark:text-white">
                  Outras soluções para sua clínica
                </h2>
                <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-xl text-sm">{sectionSubtitle}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {siblingFeatures.map((sibling) => {
                  const SibIcon = sibling.icon
                  return (
                    <Link key={sibling.slug} href={`/features/${sibling.slug}`}>
                      <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 hover:shadow-lg hover:shadow-[#0A1F3D]/5 hover:border-[#489FB5]/30 transition-all duration-300 hover:-translate-y-1.5 h-full dark:border-white/5 dark:bg-slate-900">
                        {/* Soft card top line hover */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#489FB5]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${theme.accentBg} ${theme.accent} border ${theme.accentBorder} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          <SibIcon className="h-5 w-5" />
                        </div>
                        <h3 className="font-bold text-sm text-[#0A1F3D] dark:text-white mb-1.5 group-hover:text-[#489FB5] transition-colors">
                          {tS(`${sibling.sectionKey}.${sibling.featureKey}.name` as any)}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {tS(`${sibling.sectionKey}.${sibling.featureKey}.description` as any)}
                        </p>
                        <ArrowRight className="absolute top-5 right-5 h-4 w-4 text-slate-300 opacity-30 group-hover:opacity-100 group-hover:text-[#489FB5] group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            PREV / NEXT NAVIGATION
           ════════════════════════════════════════════════════════════ */}
        <div className="border-t border-slate-100 dark:border-slate-900">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8 flex justify-between items-center">
            {prev ? (
              <Link
                href={`/features/${prev.slug}`}
                className="group flex items-center gap-3 text-xs text-slate-500 hover:text-[#0A1F3D] dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4 text-slate-300 group-hover:-translate-x-1 group-hover:text-[#489FB5] transition-all" />
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Anterior</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{tS(`${prev.sectionKey}.${prev.featureKey}.name` as any)}</span>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`/features/${next.slug}`}
                className="group flex items-center gap-3 text-xs text-slate-500 hover:text-[#0A1F3D] dark:hover:text-white transition-colors"
              >
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Próxima</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{tS(`${next.sectionKey}.${next.featureKey}.name` as any)}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:translate-x-1 group-hover:text-[#489FB5] transition-all" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════
            FINAL CTA — Glassmorphism Premium Banner
           ════════════════════════════════════════════════════════════ */}
        <div className="py-24 border-t border-slate-100 dark:border-slate-900 bg-slate-50/40 dark:bg-slate-900/10 relative">
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
