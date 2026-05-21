import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { buildLocaleAlternates } from '@/lib/seo/canonical'
import Link from 'next/link'
import Script from 'next/script'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowRight,
  ArrowLeft,
  Check,
  ChevronDown,
  HelpCircle,
  ExternalLink,
  User,
  Briefcase,
  Building2,
} from 'lucide-react'
import {
  DETAILED_INTEGRATIONS,
  getDetailedBySlug,
  getDashboardIntegrationById,
  MARKETING_CATEGORY_LABELS,
  type IntegrationCategory,
} from '@/config/integrations-marketing'
import { IntegrationIcon } from '@/components/marketing/integration-icon-client'

export function generateStaticParams() {
  return DETAILED_INTEGRATIONS.map((i) => ({ slug: i.landingSlug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const detailed = getDetailedBySlug(slug)
  if (!detailed) return {}

  const t = await getTranslations({ locale, namespace: 'marketing.integrations' })
  const name = t(`items.${detailed.i18nKey}.name` as any)
  const description = t(`items.${detailed.i18nKey}.shortDesc` as any)
  const alternates = buildLocaleAlternates(locale, `/integracoes/${slug}`)

  return {
    title: `${name} | Integrações Estetia CRM`,
    description,
    alternates,
    openGraph: {
      title: `${name} — Estetia CRM`,
      description,
      url: alternates.canonical,
    },
  }
}

type TFunc = (key: string, ...args: any[]) => string
function tryTSafe(t: TFunc, key: string): string | null {
  try {
    const val = t(key as any)
    if (typeof val !== 'string') return null
    if (val === key) return null
    const lastSegment = key.split('.').pop()
    if (val === lastSegment) return null
    if (val.includes('marketing.integrations.')) return null
    if (val.includes('.detail.')) return null
    return val
  } catch {
    return null
  }
}

const CATEGORY_THEMES: Record<IntegrationCategory, { accent: string; accentBg: string; accentBorder: string; gradient: string }> = {
  mensageria:        { accent: 'text-green-600',    accentBg: 'bg-green-500/10',    accentBorder: 'border-green-500/20',    gradient: 'from-green-500/5 via-emerald-500/5 to-transparent' },
  telefonia:         { accent: 'text-cyan-600',     accentBg: 'bg-cyan-500/10',     accentBorder: 'border-cyan-500/20',     gradient: 'from-cyan-500/5 via-teal-500/5 to-transparent' },
  calendarios:       { accent: 'text-[#489FB5]',   accentBg: 'bg-[#489FB5]/10',   accentBorder: 'border-[#489FB5]/20',   gradient: 'from-[#489FB5]/5 via-teal-500/5 to-transparent' },
  'email-marketing': { accent: 'text-orange-600',   accentBg: 'bg-orange-500/10',   accentBorder: 'border-orange-500/20',   gradient: 'from-orange-500/5 via-amber-500/5 to-transparent' },
  anuncios:          { accent: 'text-blue-600',     accentBg: 'bg-blue-500/10',     accentBorder: 'border-blue-500/20',     gradient: 'from-blue-500/5 via-indigo-500/5 to-transparent' },
  pagamentos:        { accent: 'text-[#C5A059]',   accentBg: 'bg-[#C5A059]/10',   accentBorder: 'border-[#C5A059]/20',   gradient: 'from-[#C5A059]/5 via-amber-500/5 to-transparent' },
  nfse:              { accent: 'text-amber-600',    accentBg: 'bg-amber-500/10',    accentBorder: 'border-amber-500/20',    gradient: 'from-amber-500/5 via-yellow-500/5 to-transparent' },
  convenios:         { accent: 'text-emerald-600',  accentBg: 'bg-emerald-500/10',  accentBorder: 'border-emerald-500/20',  gradient: 'from-emerald-500/5 via-green-500/5 to-transparent' },
  telemedicina:      { accent: 'text-purple-600',   accentBg: 'bg-purple-500/10',   accentBorder: 'border-purple-500/20',   gradient: 'from-purple-500/5 via-violet-500/5 to-transparent' },
  erp:               { accent: 'text-indigo-600',   accentBg: 'bg-indigo-500/10',   accentBorder: 'border-indigo-500/20',   gradient: 'from-indigo-500/5 via-blue-500/5 to-transparent' },
  produtividade:     { accent: 'text-slate-600',    accentBg: 'bg-slate-500/10',    accentBorder: 'border-slate-500/20',    gradient: 'from-slate-500/5 via-gray-500/5 to-transparent' },
  webhooks:          { accent: 'text-violet-600',   accentBg: 'bg-violet-500/10',   accentBorder: 'border-violet-500/20',   gradient: 'from-violet-500/5 via-purple-500/5 to-transparent' },
  validacoes:        { accent: 'text-teal-600',     accentBg: 'bg-teal-500/10',     accentBorder: 'border-teal-500/20',     gradient: 'from-teal-500/5 via-emerald-500/5 to-transparent' },
}

const FALLBACK_THEME = CATEGORY_THEMES['webhooks']

const PERSONA_ICONS = [User, Briefcase, Building2]

export default async function IntegrationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const detailed = getDetailedBySlug(slug)
  if (!detailed) notFound()

  const dashboardIntegration = getDashboardIntegrationById(detailed.dashboardId)

  const t = await getTranslations('marketing.integrations')
  const dp = `items.${detailed.i18nKey}.detail`

  const category = dashboardIntegration?.category
  const theme = category ? (CATEGORY_THEMES[category] ?? FALLBACK_THEME) : FALLBACK_THEME
  const categoryLabel = category ? MARKETING_CATEGORY_LABELS[category] : 'Integração'

  const name = t(`items.${detailed.i18nKey}.name` as any)
  const shortDesc = t(`items.${detailed.i18nKey}.shortDesc` as any)
  const headline = tryTSafe(t as TFunc, `${dp}.headline`)

  type Benefit = { title: string; text: string }
  const benefits: Benefit[] = []
  for (let i = 1; i <= 6; i++) {
    const title = tryTSafe(t as TFunc, `${dp}.benefits.${i}.title`)
    const text = tryTSafe(t as TFunc, `${dp}.benefits.${i}.text`)
    if (title && text) benefits.push({ title, text })
    else break
  }

  type Step = { title: string; text: string }
  const howSteps: Step[] = []
  for (let i = 1; i <= 5; i++) {
    const title = tryTSafe(t as TFunc, `${dp}.howItWorks.${i}.title`)
    const text = tryTSafe(t as TFunc, `${dp}.howItWorks.${i}.text`)
    if (title && text) howSteps.push({ title, text })
    else break
  }

  type UseCase = { persona: string; scenario: string }
  const useCases: UseCase[] = []
  for (let i = 1; i <= 3; i++) {
    const persona = tryTSafe(t as TFunc, `${dp}.useCases.${i}.persona`)
    const scenario = tryTSafe(t as TFunc, `${dp}.useCases.${i}.scenario`)
    if (persona && scenario) useCases.push({ persona, scenario })
    else break
  }

  type FAQ = { q: string; a: string }
  const faqs: FAQ[] = []
  for (let i = 1; i <= 5; i++) {
    const q = tryTSafe(t as TFunc, `${dp}.faq.${i}.q`)
    const a = tryTSafe(t as TFunc, `${dp}.faq.${i}.a`)
    if (q && a) faqs.push({ q, a })
    else break
  }

  const planInfo = tryTSafe(t as TFunc, `${dp}.planInfo`)

  const idx = DETAILED_INTEGRATIONS.findIndex((i) => i.landingSlug === slug)
  const prev = idx > 0 ? DETAILED_INTEGRATIONS[idx - 1] : null
  const next = idx < DETAILED_INTEGRATIONS.length - 1 ? DETAILED_INTEGRATIONS[idx + 1] : null

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://estetiacrm.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Integrações', item: 'https://estetiacrm.com.br/integracoes' },
      { '@type': 'ListItem', position: 3, name, item: `https://estetiacrm.com.br/integracoes/${slug}` },
    ],
  }

  return (
    <>
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="bg-background min-h-screen">
        {/* ── Hero ── */}
        <div className="relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} pointer-events-none`} />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-30 pointer-events-none bg-primary/10" />

          <div className="relative py-24 sm:py-32">
            <div className="mx-auto max-w-5xl px-6 lg:px-8">
              <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-10">
                <Link href="/integracoes" className="hover:text-foreground transition-colors">
                  Integrações
                </Link>
                <span className="text-muted-foreground/50">/</span>
                <span className="text-foreground font-medium">{name}</span>
              </nav>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-start">
                <div>
                  <Badge className={`mb-6 ${theme.accentBg} ${theme.accent} border-0 font-medium px-3 py-1`}>
                    {categoryLabel}
                  </Badge>
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1]">
                    {name}
                  </h1>
                  {headline && (
                    <p className="mt-6 text-xl sm:text-2xl font-medium text-muted-foreground/80 leading-relaxed max-w-2xl">
                      {headline}
                    </p>
                  )}
                  <p className="mt-6 text-base leading-relaxed text-muted-foreground max-w-2xl">
                    {shortDesc}
                  </p>
                  {dashboardIntegration?.costNote && (
                    <p className="mt-3 text-sm text-muted-foreground/70 flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${theme.accentBg.replace('/10', '')}`} />
                      {dashboardIntegration.costNote}
                    </p>
                  )}
                  <div className="mt-10 flex flex-col sm:flex-row gap-4">
                    <Button asChild size="lg" className="h-12 px-8 text-base">
                      <Link href="/register">
                        Testar Grátis
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base">
                      <Link href="/pricing">Ver Planos</Link>
                    </Button>
                  </div>
                </div>

                {dashboardIntegration && (
                  <div className={`hidden lg:flex h-40 w-40 items-center justify-center rounded-3xl border ${theme.accentBorder}`} style={{ backgroundColor: `${dashboardIntegration.cardBgColor}1A` }}>
                    <IntegrationIcon icon={dashboardIntegration.icon} size="xl" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Benefits ── */}
        {benefits.length > 0 && (
          <div className="py-24 border-t">
            <div className="mx-auto max-w-5xl px-6 lg:px-8">
              <div className="mb-14">
                <Badge variant="outline" className="mb-4">Benefícios</Badge>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">O que você ganha</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {benefits.map((b, i) => (
                  <div key={i} className="group flex gap-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${theme.accentBg} mt-1 group-hover:scale-110 transition-transform duration-200`}>
                      <Check className={`h-5 w-5 ${theme.accent}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base mb-1">{b.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{b.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── How it works ── */}
        {howSteps.length > 0 && (
          <div className="py-24 bg-muted/30 border-t">
            <div className="mx-auto max-w-5xl px-6 lg:px-8">
              <div className="mb-14">
                <Badge variant="outline" className="mb-4">Passo a passo</Badge>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Como ativar e usar</h2>
              </div>
              <div className="relative">
                <div className="absolute left-5 top-0 bottom-0 w-px bg-border hidden md:block" />
                <div className="space-y-10">
                  {howSteps.map((step, i) => (
                    <div key={i} className="relative flex gap-6 md:gap-8">
                      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/20">
                        {i + 1}
                      </div>
                      <div className="pb-2">
                        <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                        <p className="text-muted-foreground leading-relaxed max-w-xl">{step.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Use cases ── */}
        {useCases.length > 0 && (
          <div className="py-24 border-t">
            <div className="mx-auto max-w-5xl px-6 lg:px-8">
              <div className="mb-14">
                <Badge variant="outline" className="mb-4">Casos de uso</Badge>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Quem usa e como</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {useCases.map((uc, i) => {
                  const PersonaIcon = PERSONA_ICONS[i % PERSONA_ICONS.length]
                  return (
                    <div key={i} className="group relative rounded-2xl border bg-background p-6 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${theme.accentBg} mb-5 group-hover:scale-110 transition-transform`}>
                        <PersonaIcon className={`h-6 w-6 ${theme.accent}`} />
                      </div>
                      <div className="mb-3">
                        <span className={`text-xs font-semibold uppercase tracking-wider ${theme.accent}`}>
                          {uc.persona}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{uc.scenario}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Plan info ── */}
        {planInfo && (
          <div className="py-12 border-t">
            <div className="mx-auto max-w-5xl px-6 lg:px-8">
              <div className={`relative overflow-hidden rounded-2xl border ${theme.accentBorder} p-6 sm:p-8`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div>
                    <p className="font-semibold text-sm mb-1">Disponibilidade por plano</p>
                    <p className="text-sm text-muted-foreground">{planInfo}</p>
                  </div>
                  <div className="sm:ml-auto shrink-0">
                    <Button asChild variant="outline" size="sm">
                      <Link href="/pricing">Comparar planos</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Help center link ── */}
        {detailed.helpArticleSlug && (
          <div className="py-10 border-t">
            <div className="mx-auto max-w-5xl px-6 lg:px-8">
              <div className={`rounded-xl border ${theme.accentBorder} ${theme.accentBg} p-5 flex items-center justify-between gap-4`}>
                <div>
                  <p className="font-semibold text-sm">Precisa do passo a passo técnico?</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Consulte o guia completo de configuração no nosso centro de ajuda.
                  </p>
                </div>
                <Button asChild variant="outline" size="sm" className="shrink-0">
                  <Link href={`/help/integracoes/${detailed.helpArticleSlug}`}>
                    Ver guia
                    <ExternalLink className="ml-2 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ── FAQ ── */}
        {faqs.length > 0 && (
          <div className="py-24 bg-muted/30 border-t">
            <div className="mx-auto max-w-3xl px-6 lg:px-8">
              <div className="mb-14 text-center">
                <Badge variant="outline" className="mb-4">FAQ</Badge>
                <h2 className="text-3xl font-bold tracking-tight">Perguntas frequentes</h2>
              </div>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <details key={i} className="group rounded-xl border bg-background hover:shadow-sm transition-all">
                    <summary className="flex items-center justify-between cursor-pointer p-5 text-sm font-medium select-none">
                      <div className="flex items-center gap-3">
                        <HelpCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                        {faq.q}
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 group-open:rotate-180" />
                    </summary>
                    <div className="px-5 pb-5 pt-0 text-sm text-muted-foreground leading-relaxed ml-7">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Other integrations ── */}
        <div className="py-24 border-t">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <div className="mb-10">
              <Badge variant="outline" className="mb-4">Explore mais</Badge>
              <h2 className="text-2xl font-bold tracking-tight">Outras integrações</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {DETAILED_INTEGRATIONS.filter((i) => i.landingSlug !== slug).map((other) => {
                const otherDash = getDashboardIntegrationById(other.dashboardId)
                const otherCategory = otherDash?.category
                const otherTheme = otherCategory ? (CATEGORY_THEMES[otherCategory] ?? FALLBACK_THEME) : FALLBACK_THEME
                return (
                  <Link
                    key={other.landingSlug}
                    href={`/integracoes/${other.landingSlug}`}
                    className="group flex flex-col items-center gap-3 rounded-xl border bg-background p-4 hover:border-primary/30 hover:shadow-md transition-all text-center"
                  >
                    {otherDash ? (
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${otherTheme.accentBg} group-hover:scale-110 transition-transform overflow-hidden`}>
                        <IntegrationIcon icon={otherDash.icon} size="sm" />
                      </div>
                    ) : (
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${otherTheme.accentBg} group-hover:scale-110 transition-transform`} />
                    )}
                    <span className="text-xs font-medium group-hover:text-primary transition-colors line-clamp-2">
                      {t(`items.${other.i18nKey}.name` as any)}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Prev / Next nav ── */}
        <div className="border-t">
          <div className="mx-auto max-w-5xl px-6 lg:px-8 py-8 flex justify-between items-center">
            {prev ? (
              <Link href={`/integracoes/${prev.landingSlug}`} className="group flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <div className="text-left">
                  <span className="text-xs text-muted-foreground/60 block">Anterior</span>
                  <span className="font-medium">{t(`items.${prev.i18nKey}.name` as any)}</span>
                </div>
              </Link>
            ) : <div />}
            {next ? (
              <Link href={`/integracoes/${next.landingSlug}`} className="group flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <div className="text-right">
                  <span className="text-xs text-muted-foreground/60 block">Próxima</span>
                  <span className="font-medium">{t(`items.${next.i18nKey}.name` as any)}</span>
                </div>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : <div />}
          </div>
        </div>

        {/* ── Final CTA ── */}
        <div className="py-24 border-t bg-muted/20">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl border bg-background p-10 sm:p-14 text-center shadow-xl shadow-primary/5">
              <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] opacity-20 pointer-events-none bg-primary" />
              <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full blur-[80px] opacity-10 pointer-events-none bg-primary" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-sm text-green-600 mb-6">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-medium">Gratuito para sempre</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Pronto para transformar sua clínica?
                </h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-lg mx-auto">
                  Comece grátis por 14 dias. Sem cartão de crédito, sem compromisso.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/20">
                    <Link href="/register">
                      Começar Grátis Agora
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base">
                    <Link href="/pricing">Ver Planos</Link>
                  </Button>
                </div>
                <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-green-500" />
                    Sem cartão de crédito
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-green-500" />
                    5 min para configurar
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
