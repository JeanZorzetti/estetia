import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  Check, 
  HelpCircle, 
  ChevronDown, 
  Plug, 
  Sparkles, 
  Zap, 
  Activity, 
  Users, 
  Code,
  Shield,
  Info
} from 'lucide-react'
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

// category accent colors matching clinical identity
const CATEGORY_ACCENT: Record<IntegrationCategory, { bg: string; text: string; border: string; dot: string }> = {
  mensageria:        { bg: 'bg-emerald-500/8 dark:bg-emerald-500/12',    text: 'text-emerald-600 dark:text-emerald-400',    border: 'border-slate-100 hover:border-emerald-500/30 dark:border-white/5 dark:hover:border-emerald-500/30',    dot: 'bg-emerald-500' },
  telefonia:         { bg: 'bg-cyan-500/8 dark:bg-cyan-500/12',     text: 'text-cyan-600 dark:text-cyan-400',     border: 'border-slate-100 hover:border-cyan-500/30 dark:border-white/5 dark:hover:border-cyan-500/30',     dot: 'bg-cyan-500' },
  calendarios:       { bg: 'bg-[#489FB5]/8 dark:bg-[#489FB5]/12',    text: 'text-[#489FB5]',    border: 'border-slate-100 hover:border-[#489FB5]/30 dark:border-white/5 dark:hover:border-[#489FB5]/30',    dot: 'bg-[#489FB5]' },
  'email-marketing': { bg: 'bg-orange-500/8 dark:bg-orange-500/12',   text: 'text-orange-600 dark:text-orange-400',   border: 'border-slate-100 hover:border-orange-500/30 dark:border-white/5 dark:hover:border-orange-500/30',   dot: 'bg-orange-500' },
  anuncios:          { bg: 'bg-blue-500/8 dark:bg-blue-500/12',     text: 'text-blue-600 dark:text-blue-400',     border: 'border-slate-100 hover:border-blue-500/30 dark:border-white/5 dark:hover:border-blue-500/30',     dot: 'bg-blue-500' },
  pagamentos:        { bg: 'bg-[#C5A059]/8 dark:bg-[#C5A059]/12',    text: 'text-[#C5A059]',    border: 'border-slate-100 hover:border-[#C5A059]/30 dark:border-white/5 dark:hover:border-[#C5A059]/30',    dot: 'bg-[#C5A059]' },
  nfse:              { bg: 'bg-amber-500/8 dark:bg-amber-500/12',    text: 'text-amber-600 dark:text-amber-400',    border: 'border-slate-100 hover:border-amber-500/30 dark:border-white/5 dark:hover:border-amber-500/30',    dot: 'bg-amber-500' },
  convenios:         { bg: 'bg-emerald-500/8 dark:bg-emerald-500/12',  text: 'text-emerald-600 dark:text-emerald-400',  border: 'border-slate-100 hover:border-emerald-500/30 dark:border-white/5 dark:hover:border-emerald-500/30',  dot: 'bg-emerald-500' },
  telemedicina:      { bg: 'bg-purple-500/8 dark:bg-purple-500/12',   text: 'text-purple-600 dark:text-purple-400',   border: 'border-slate-100 hover:border-purple-500/30 dark:border-white/5 dark:hover:border-purple-500/30',   dot: 'bg-purple-500' },
  erp:               { bg: 'bg-indigo-500/8 dark:bg-indigo-500/12',   text: 'text-indigo-600 dark:text-indigo-400',   border: 'border-slate-100 hover:border-indigo-500/30 dark:border-white/5 dark:hover:border-indigo-500/30',   dot: 'bg-indigo-500' },
  produtividade:     { bg: 'bg-slate-500/8 dark:bg-slate-500/12',    text: 'text-slate-600 dark:text-slate-400',    border: 'border-slate-100 hover:border-slate-500/30 dark:border-white/5 dark:hover:border-slate-500/30',    dot: 'bg-slate-500' },
  webhooks:          { bg: 'bg-violet-500/8 dark:bg-violet-500/12',   text: 'text-violet-600 dark:text-violet-400',   border: 'border-slate-100 hover:border-violet-500/30 dark:border-white/5 dark:hover:border-violet-500/30',   dot: 'bg-violet-500' },
  validacoes:        { bg: 'bg-teal-500/8 dark:bg-teal-500/12',     text: 'text-teal-600 dark:text-teal-400',     border: 'border-slate-100 hover:border-teal-500/30 dark:border-white/5 dark:hover:border-teal-500/30',     dot: 'bg-teal-500' },
}

export default async function IntegracoesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
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

  // Probe FAQ keys with t.has() (silent existence check) instead of calling
  // t() on possibly-missing keys, which logs MISSING_MESSAGE even inside a
  // try/catch and flooded the deploy log.
  const tHas = (t as unknown as { has?: (key: string) => boolean }).has
  const faqs: { q: string; a: string }[] = []
  for (let i = 1; i <= 6; i++) {
    if (typeof tHas === 'function' && !(tHas(`faq.${i}.q`) && tHas(`faq.${i}.a`))) break
    const q = t(`faq.${i}.q` as any)
    const a = t(`faq.${i}.a` as any)
    if (q && a && !q.includes('.faq.')) faqs.push({ q, a })
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
        <div className="absolute top-[-5%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[130px] opacity-35 pointer-events-none bg-gradient-to-br from-[#489FB5]/10 to-transparent" />
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[140px] opacity-25 pointer-events-none bg-gradient-to-br from-[#C5A059]/10 to-transparent" />
        <div className="absolute top-[50%] left-[-15%] w-[600px] h-[600px] rounded-full blur-[140px] opacity-20 pointer-events-none bg-gradient-to-br from-violet-500/10 to-transparent" />

        {/* ── Hero ── */}
        <div className="relative pt-24 pb-16 sm:pt-32 sm:pb-24">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/25 bg-[#C5A059]/5 px-3.5 py-1 text-xs font-bold text-[#C5A059] mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059] animate-pulse" />
                {t('hero.badge')}
              </div>

              <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-[#0A1F3D] dark:text-white leading-[1.1] mb-6">
                {t('hero.headline')}
              </h1>

              <p className="font-sans text-lg sm:text-xl font-medium text-slate-500 dark:text-slate-400 leading-relaxed mb-10 max-w-2xl mx-auto">
                {t('hero.subhead')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="h-12 px-8 text-base bg-[#0A1F3D] hover:bg-[#162D54] text-white shadow-lg shadow-[#0A1F3D]/15 rounded-xl transition-all duration-300 hover:-translate-y-0.5 dark:bg-[#C5A059] dark:text-[#0A1F3D] dark:hover:bg-[#b8913f] dark:shadow-[#C5A059]/10">
                  <Link href="/register">
                    {t('hero.ctaPrimary')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-[#0A1F3D] dark:text-white dark:border-white/10 dark:hover:bg-slate-900 rounded-xl transition-all duration-300 hover:-translate-y-0.5">
                  <Link href="/precos">{t('hero.ctaSecondary')}</Link>
                </Button>
              </div>
            </div>

            {/* Stats Bar — Re-engineered Glassmorphism cards */}
            <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
              {[
                { key: 'stat1', icon: Zap, iconColor: 'text-[#C5A059] bg-[#C5A059]/10' },
                { key: 'stat2', icon: Activity, iconColor: 'text-[#489FB5] bg-[#489FB5]/10' },
                { key: 'stat3', icon: Users, iconColor: 'text-violet-500 bg-violet-500/10' }
              ].map(({ key, icon: Icon, iconColor }) => (
                <div 
                  key={key} 
                  className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white/40 p-5 text-center backdrop-blur-md shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#489FB5]/20 hover:-translate-y-0.5 dark:border-white/5 dark:bg-slate-900/40"
                >
                  <div className={`mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${iconColor}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="font-serif text-2xl font-bold text-[#0A1F3D] dark:text-white mb-0.5">
                    {t(`hero.${key}.value` as any)}
                  </h4>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {t(`hero.${key}.label` as any)}
                  </p>
                </div>
              ))}
            </div>

            {/* Category quick-nav */}
            <div className="mt-16 flex flex-wrap gap-2.5 justify-center">
              {grouped.map(({ category, label }) => {
                const accent = CATEGORY_ACCENT[category]
                return (
                  <Link
                    key={category}
                    href={`#${category}`}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold transition-all shadow-sm bg-white/50 backdrop-blur-sm hover:shadow hover:-translate-y-0.5 ${accent.border} ${accent.text}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} />
                    {label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Integration Grid by category ── */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-28 space-y-28 relative z-10">
          {grouped.map(({ category, label, items }) => {
            const accent = CATEGORY_ACCENT[category]
            return (
              <section key={category} id={category} className="scroll-mt-24">
                {/* Category Header */}
                <div className="mb-10 border-b pb-4 dark:border-slate-800">
                  <div className="inline-flex items-center gap-2 mb-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} />
                    <span className={`text-xs font-bold uppercase tracking-[0.2em] ${accent.text}`}>
                      {label}
                    </span>
                  </div>
                  
                  <h2 className="font-serif text-2xl font-bold tracking-tight sm:text-3xl text-[#0A1F3D] dark:text-white">
                    {t(`categoryTitles.${category}` as any)}
                  </h2>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                        className={`group relative block rounded-2xl border ${accent.border} bg-white/60 dark:bg-slate-900/40 p-6 shadow-sm hover:shadow-xl hover:shadow-[#0A1F3D]/3 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5`}
                      >
                        {/* Soft card top line glow */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#489FB5]/40 to-[#C5A059]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />
                        
                        <div className="flex items-start gap-3.5">
                          <div className="shrink-0 group-hover:scale-110 transition-transform duration-300">
                            <IntegrationIcon icon={integration.icon} size="md" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="font-bold text-sm text-[#0A1F3D] group-hover:text-[#489FB5] dark:group-hover:text-[#C5A059] transition-colors dark:text-white truncate">
                                {integration.name}
                              </h3>
                              
                              {integration.isBrazilian && (
                                <span className="shrink-0 text-[8px] font-bold bg-green-500/10 text-green-600 border border-green-500/20 rounded px-1.5 py-0.5 tracking-wider uppercase">
                                  BR
                                </span>
                              )}
                              
                              {integration.status === 'soon' && (
                                <span className="shrink-0 text-[8px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded px-1.5 py-0.5 tracking-wider uppercase">
                                  Em breve
                                </span>
                              )}
                            </div>
                            
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                              {integration.shortDescription}
                            </p>
                          </div>
                        </div>
                        
                        {!isExternal && (
                          <div className={`mt-4 flex items-center gap-1 text-xs font-bold ${accent.text} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                            Ver detalhes <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
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

        {/* ── "Não encontrou?" block — Monumental Glassmorphism Container ── */}
        <div className="border-t border-slate-100 dark:border-slate-900 bg-slate-50/20 py-20 relative">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white p-10 sm:p-14 text-center shadow-xl shadow-[#0A1F3D]/2 dark:border-slate-800 dark:bg-slate-900/60 backdrop-blur-md">
              <div className="absolute top-0 right-0 w-60 h-60 rounded-full blur-[90px] opacity-10 bg-[#489FB5]" />
              <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full blur-[90px] opacity-10 bg-[#C5A059]" />

              <div className="relative z-10 flex flex-col items-center">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0A1F3D]/5 border border-[#0A1F3D]/10 text-[#0A1F3D] dark:bg-white/5 dark:border-white/10 dark:text-white shadow-inner">
                  <Plug className="h-6 w-6 text-[#C5A059]" />
                </div>
                
                <h2 className="font-serif text-2xl font-bold tracking-tight text-[#0A1F3D] dark:text-white">
                  {t('notFound.title')}
                </h2>
                
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  {t('notFound.subtitle')}
                </p>
                
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center w-full max-w-sm">
                  <Button asChild variant="outline" className="h-11 border-slate-200 hover:bg-slate-50 text-[#0A1F3D] dark:text-white dark:border-white/10 dark:hover:bg-slate-900 rounded-xl transition-all shadow-sm">
                    <Link href="/integracoes/api-webhooks">{t('notFound.ctaApi')}</Link>
                  </Button>
                  <Button asChild className="h-11 bg-[#0A1F3D] hover:bg-[#162D54] text-white rounded-xl shadow-md transition-all dark:bg-[#C5A059] dark:text-[#0A1F3D] dark:hover:bg-[#b8913f]">
                    <Link href="/register">{t('notFound.ctaSuggest')}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── FAQ ── */}
        {faqs.length > 0 && (
          <div className="py-24 border-t border-slate-100 dark:border-slate-900 bg-slate-50/20">
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

        {/* ── Final CTA — Glassmorphism Premium Banner ── */}
        <div className="py-24 border-t border-slate-100 dark:border-slate-900 bg-slate-50/40 dark:bg-slate-900/10 relative overflow-hidden">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white p-10 sm:p-14 text-center shadow-2xl shadow-[#0A1F3D]/5 dark:border-slate-800 dark:bg-slate-900">
              <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[110px] opacity-15 pointer-events-none bg-[#489FB5]" />
              <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full blur-[90px] opacity-10 pointer-events-none bg-[#C5A059]" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/5 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-6">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-medium">Gratuito para começar</span>
                </div>

                <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl text-[#0A1F3D] dark:text-white mb-4">
                  Pronto para conectar sua clínica?
                </h2>
                
                <p className="mt-4 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  56 integrações nativas prontas para uso. Ative instantaneamente as que fazem sentido para o seu negócio.
                </p>
                
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="h-12 px-8 text-base bg-[#0A1F3D] hover:bg-[#162D54] text-white shadow-xl shadow-[#0A1F3D]/25 rounded-xl transition-all hover:-translate-y-0.5 dark:bg-[#C5A059] dark:text-[#0A1F3D] dark:hover:bg-[#b8913f] dark:shadow-[#C5A059]/10">
                    <Link href="/register">
                      Começar Grátis Agora
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base border-slate-200 text-[#0A1F3D] hover:bg-slate-50 rounded-xl transition-all hover:-translate-y-0.5 dark:border-slate-800 dark:text-white dark:hover:bg-slate-900">
                    <Link href="/precos">Ver Planos</Link>
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
