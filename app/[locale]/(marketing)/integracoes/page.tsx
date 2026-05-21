import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Check, HelpCircle, ChevronDown, Plug } from 'lucide-react'
import {
  ALL_INTEGRATIONS,
  CATEGORY_ORDER,
  MARKETING_CATEGORY_LABELS,
  getLandingSlugForDashboardId,
  type IntegrationCategory,
} from '@/config/integrations-marketing'
import { IntegrationIcon } from '@/components/marketing/integration-icon-client'
import { buildLocaleAlternates } from '@/lib/seo/canonical'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'marketing.integrations.meta' })
  const alternates = buildLocaleAlternates(locale, '/integracoes')
  return {
    title: t('title'),
    description: t('description'),
    keywords: [
      'integração CRM clínica estética', 'whatsapp clínica dermatologia', 'google calendar clínica',
      'TISS convênios médicos', 'NFS-e clínica estética', 'mercado pago clínica',
      'n8n automação clínica', 'API CRM clínica', 'webhooks CRM saúde', 'estetia crm integrações',
      'asaas clínica', 'stripe clínica', 'google ads clínica estética', 'meta ads clínica',
      'zapier clínica', 'instagram direct clínica',
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

const CATEGORY_ACCENT: Record<IntegrationCategory, { bg: string; text: string; border: string; dot: string }> = {
  mensageria:        { bg: 'bg-green-500/10',    text: 'text-green-600',    border: 'border-green-500/20',    dot: 'bg-green-500' },
  telefonia:         { bg: 'bg-cyan-500/10',     text: 'text-cyan-600',     border: 'border-cyan-500/20',     dot: 'bg-cyan-500' },
  calendarios:       { bg: 'bg-[#489FB5]/10',    text: 'text-[#489FB5]',    border: 'border-[#489FB5]/20',    dot: 'bg-[#489FB5]' },
  'email-marketing': { bg: 'bg-orange-500/10',   text: 'text-orange-600',   border: 'border-orange-500/20',   dot: 'bg-orange-500' },
  anuncios:          { bg: 'bg-blue-500/10',     text: 'text-blue-600',     border: 'border-blue-500/20',     dot: 'bg-blue-500' },
  pagamentos:        { bg: 'bg-[#C5A059]/10',    text: 'text-[#C5A059]',    border: 'border-[#C5A059]/20',    dot: 'bg-[#C5A059]' },
  nfse:              { bg: 'bg-amber-500/10',    text: 'text-amber-600',    border: 'border-amber-500/20',    dot: 'bg-amber-500' },
  convenios:         { bg: 'bg-emerald-500/10',  text: 'text-emerald-600',  border: 'border-emerald-500/20',  dot: 'bg-emerald-500' },
  telemedicina:      { bg: 'bg-purple-500/10',   text: 'text-purple-600',   border: 'border-purple-500/20',   dot: 'bg-purple-500' },
  erp:               { bg: 'bg-indigo-500/10',   text: 'text-indigo-600',   border: 'border-indigo-500/20',   dot: 'bg-indigo-500' },
  produtividade:     { bg: 'bg-slate-500/10',    text: 'text-slate-600',    border: 'border-slate-500/20',    dot: 'bg-slate-500' },
  webhooks:          { bg: 'bg-violet-500/10',   text: 'text-violet-600',   border: 'border-violet-500/20',   dot: 'bg-violet-500' },
  validacoes:        { bg: 'bg-teal-500/10',     text: 'text-teal-600',     border: 'border-teal-500/20',     dot: 'bg-teal-500' },
}

export default async function IntegracoesPage() {
  const t = await getTranslations('marketing.integrations')

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://estetiacrm.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Integrações', item: 'https://estetiacrm.com.br/integracoes' },
    ],
  }

  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: MARKETING_CATEGORY_LABELS[cat],
    items: ALL_INTEGRATIONS.filter((i) => i.category === cat),
  })).filter((g) => g.items.length > 0)

  const faqs: { q: string; a: string }[] = []
  for (let i = 1; i <= 6; i++) {
    try {
      const q = t(`faq.${i}.q` as any)
      const a = t(`faq.${i}.a` as any)
      if (q && a && !q.includes('.faq.')) faqs.push({ q, a })
    } catch { break }
  }

  return (
    <>
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="bg-background">
        {/* ── Hero ── */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#489FB5]/5 via-violet-500/5 to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 pointer-events-none bg-primary/10" />

          <div className="relative py-24 sm:py-32">
            <div className="mx-auto max-w-5xl px-6 lg:px-8">
              <div className="mx-auto max-w-3xl text-center">
                <Badge variant="outline" className="mb-4 text-primary border-primary/30">
                  {t('hero.badge')}
                </Badge>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                  {t('hero.headline')}
                </h1>
                <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
                  {t('hero.subhead')}
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="h-12 px-8 text-base">
                    <Link href="/register">
                      {t('hero.ctaPrimary')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base">
                    <Link href="/pricing">{t('hero.ctaSecondary')}</Link>
                  </Button>
                </div>
              </div>

              {/* Stats bar */}
              <div className="mt-16 grid grid-cols-3 gap-4 max-w-xl mx-auto text-center">
                {(['stat1', 'stat2', 'stat3'] as const).map((key) => (
                  <div key={key} className="rounded-xl border bg-background/80 p-4">
                    <p className="text-2xl font-bold text-primary">{t(`hero.${key}.value` as any)}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t(`hero.${key}.label` as any)}</p>
                  </div>
                ))}
              </div>

              {/* Category quick-nav */}
              <div className="mt-10 flex flex-wrap gap-2 justify-center">
                {grouped.map(({ category, label }) => {
                  const accent = CATEGORY_ACCENT[category]
                  return (
                    <a
                      key={category}
                      href={`#${category}`}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${accent.border} ${accent.text} ${accent.bg} hover:opacity-80`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} />
                      {label}
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Integration Grid by category ── */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24 space-y-20">
          {grouped.map(({ category, label, items }) => {
            const accent = CATEGORY_ACCENT[category]
            return (
              <section key={category} id={category} className="scroll-mt-20">
                <div className="mb-8">
                  <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${accent.text}`}>
                    {label}
                  </span>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight">
                    {t(`categoryTitles.${category}` as any)}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {items.map((integration) => {
                    const landingSlug = getLandingSlugForDashboardId(integration.id)
                    const href = landingSlug
                      ? `/integracoes/${landingSlug}`
                      : `/register?ref=integration:${integration.id}`
                    const isExternal = !landingSlug

                    return (
                      <Link
                        key={integration.id}
                        href={href}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        className={`group block rounded-xl border ${accent.border} bg-background p-5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5`}
                      >
                        <div className="flex items-start gap-3">
                          <IntegrationIcon icon={integration.icon} size="md" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h3 className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
                                {integration.name}
                              </h3>
                              {integration.isBrazilian && (
                                <span className="shrink-0 text-[10px] font-medium bg-green-500/10 text-green-600 border border-green-500/20 rounded px-1 py-0.5">
                                  BR
                                </span>
                              )}
                              {integration.status === 'soon' && (
                                <span className="shrink-0 text-[10px] font-medium bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded px-1 py-0.5">
                                  Em breve
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                              {integration.shortDescription}
                            </p>
                          </div>
                        </div>
                        {!isExternal && (
                          <div className={`mt-3 flex items-center gap-1 text-xs font-medium ${accent.text} opacity-0 group-hover:opacity-100 transition-opacity`}>
                            Ver detalhes <ArrowRight className="h-3 w-3" />
                          </div>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>

        {/* ── "Não encontrou?" block ── */}
        <div className="border-t bg-muted/30 py-16">
          <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Plug className="h-7 w-7 text-primary" />
              </div>
            </div>
            <h2 className="text-xl font-bold">{t('notFound.title')}</h2>
            <p className="mt-2 text-muted-foreground text-sm max-w-md mx-auto">
              {t('notFound.subtitle')}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="outline">
                <Link href="/integracoes/api-webhooks">{t('notFound.ctaApi')}</Link>
              </Button>
              <Button asChild>
                <Link href="/register">{t('notFound.ctaSuggest')}</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* ── FAQ ── */}
        {faqs.length > 0 && (
          <div className="py-24 border-t">
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

        {/* ── Final CTA ── */}
        <div className="py-24 border-t bg-muted/20">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl border bg-background p-10 sm:p-14 text-center shadow-xl shadow-primary/5">
              <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] opacity-20 pointer-events-none bg-primary" />
              <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full blur-[80px] opacity-10 pointer-events-none bg-primary" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-sm text-green-600 mb-6">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-medium">Gratuito para começar</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Pronto para conectar sua clínica?
                </h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-lg mx-auto">
                  56 integrações nativas. Ative as que fazem sentido para o seu negócio.
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
                    Configure em 5 minutos
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
