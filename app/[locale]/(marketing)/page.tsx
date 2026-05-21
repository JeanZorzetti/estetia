import { Metadata } from "next"
import { AnnouncementBar } from "@/components/marketing/announcement-bar"
import { Hero } from "@/components/marketing/hero"
import { Logos } from "@/components/marketing/logos"
import { SolutionsTabs } from "@/components/marketing/solutions-tabs"
import { FeaturesExpanded } from "@/components/marketing/features-expanded"
import { SocialProof } from "@/components/marketing/social-proof"
import { HomepageJsonLd } from "@/components/marketing/homepage-json-ld"
import { ScenarioCard } from "@/components/pricing/scenario-card"
import dynamic from "next/dynamic"

const StickyCTA = dynamic(() => import("@/components/marketing/sticky-cta").then(m => ({ default: m.StickyCTA })))
import { blogPosts } from "@/lib/blog-data"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/routing"
import { buildLocaleAlternates } from "@/lib/seo/canonical"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'marketing.home.meta' })
  const alternates = buildLocaleAlternates(locale, '', '')
  return {
    title: t('title'),
    description: t('description'),
    keywords: t.raw('keywords') as string[],
    alternates,
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url: alternates.canonical,
      images: [{ url: 'https://estetiacrm.com.br/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('ogTitle'),
      description: t('ogDescription'),
    },
  }
}

export default function LandingPage() {
  const t = useTranslations("marketing.home")
  const locale = useLocale()

  return (
    <>
      <HomepageJsonLd />

      <div className="min-h-screen bg-slate-50/40 text-[#0A1F3D] selection:bg-[#489FB5]/20 relative overflow-hidden">
        
        {/* DESIGN SYSTEM BACKGROUND INTEGRATION */}
        {/* Grain texture overlay */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none z-30" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: '128px 128px'
        }} />

        {/* Blueprint Linear Grid */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none z-0" style={{
            backgroundImage: `linear-gradient(to right, #0A1F3D 1px, transparent 1px), linear-gradient(to bottom, #0A1F3D 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
        }} />

        {/* Atmospheric Halos */}
        <div className="absolute top-0 right-[-10%] w-[1000px] h-[1000px] rounded-full pointer-events-none z-0 opacity-40 blur-[140px]"
            style={{ background: 'radial-gradient(circle, rgba(72,159,181,0.18) 0%, transparent 70%)' }} />
        <div className="absolute top-[25%] left-[-15%] w-[800px] h-[800px] rounded-full pointer-events-none z-0 opacity-30 blur-[120px]"
            style={{ background: 'radial-gradient(circle, rgba(197,160,89,0.15) 0%, transparent 70%)' }} />
        <div className="absolute top-[50%] right-[-10%] w-[900px] h-[900px] rounded-full pointer-events-none z-0 opacity-30 blur-[130px]"
            style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[10%] left-[-10%] w-[1000px] h-[1000px] rounded-full pointer-events-none z-0 opacity-40 blur-[140px]"
            style={{ background: 'radial-gradient(circle, rgba(197,160,89,0.18) 0%, transparent 70%)' }} />

        <div className="relative z-10">

          {/* 1. Announcement Bar */}
          <AnnouncementBar />

          {/* 2. Hero */}
          <Hero />

          {/* 2. Stats strip */}
          {locale === 'pt-BR' && <Logos />}

          {/* 3. Solutions Tabs — "See why Estetia is different" */}
          <SolutionsTabs />

          {/* 4. Features Expanded — 3 feature blocks */}
          <FeaturesExpanded />

          {/* 5. Social Proof + Awards — "Helping 120+ clinics" */}
          <SocialProof />

          {/* 6. Pricing Section - Revitalized */}
          <section id="pricing" className="py-32 px-6 relative overflow-hidden border-t border-[#0A1F3D]/5">
            <div className="absolute inset-0 bg-gradient-to-b from-[#EEF0F8]/60 via-white to-slate-50/20 -z-10" />
            <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none -z-10 opacity-30 blur-[100px]"
                style={{ background: 'radial-gradient(circle, rgba(72,159,181,0.08) 0%, transparent 70%)' }} />

            <div className="mx-auto max-w-7xl relative z-10">
              <div className="mb-20 text-center">
                <div className="inline-flex items-center gap-3 mb-6 bg-white/60 backdrop-blur-sm px-4 py-1.5 rounded-full border border-[#C5A059]/20 shadow-sm shadow-[#C5A059]/5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059] animate-pulse" />
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#C5A059]">{t('plans.badge' as any) || 'Planos sob medida'}</span>
                </div>
                <h2 className="font-serif text-[#0A1F3D] tracking-tight leading-tight mb-5"
                  style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                  {t('plans.title')}
                </h2>
                <p className="text-[#64748B] max-w-2xl mx-auto text-base leading-relaxed">
                  Pague apenas pelos módulos que sua clínica usa. A partir de R$ 39/mês (Plataforma Base) + os módulos de sua preferência para criar seu sistema perfeito.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                <div className="transition-all duration-300 hover:-translate-y-1">
                  <ScenarioCard
                    icon="LayoutDashboard"
                    title="Clínica Solo"
                    subtitle="Ideal para profissionais autônomos que buscam digitalizar e organizar seus atendimentos com facilidade."
                    modules={[
                      'Plataforma Base (agenda + LGPD)',
                      'Prontuário eletrônico',
                      'Controle de procedimentos',
                      'Pacotes e séries',
                    ]}
                    totalCents={16600}
                  />
                </div>
                <div className="transition-all duration-300 md:scale-[1.02] hover:-translate-y-1">
                  <ScenarioCard
                    icon="Sparkles"
                    title="Clínica Média"
                    subtitle="Para clínicas em expansão com equipe de atendimento, múltiplos profissionais e foco em retenção."
                    modules={[
                      'Plataforma Base (agenda + LGPD)',
                      'Prontuário eletrônico',
                      'Controle de procedimentos',
                      'Pacotes e séries',
                      'WhatsApp Evolution',
                      'Recall e reativação',
                      'Fotos clínicas (antes/depois)',
                    ]}
                    totalCents={36200}
                    highlight
                  />
                </div>
                <div className="transition-all duration-300 hover:-translate-y-1">
                  <ScenarioCard
                    icon="Brain"
                    title="Dermato com Convênios"
                    subtitle="Para médicos dermatologistas que conciliam atendimentos particulares e convênios médicos com inteligência."
                    modules={[
                      'Plataforma Base (agenda + LGPD)',
                      'Prontuário eletrônico',
                      'Controle de procedimentos',
                      'WhatsApp Cloud API (oficial)',
                      'Módulo TISS/TUSS',
                      'IA clínica',
                    ]}
                    totalCents={66000}
                  />
                </div>
              </div>

              <div className="mt-16 text-center">
                <Link
                  href="/precos"
                  className="group inline-flex items-center gap-2 text-base font-bold text-[#489FB5] hover:text-[#2A7A94] transition-all duration-300 px-6 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-[#489FB5]/15 hover:border-[#489FB5]/30 hover:shadow-lg hover:shadow-[#489FB5]/5"
                >
                  Configure seu plano personalizado
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </section>

          {/* 8. Blog Section - Revitalized */}
          <section className="py-32 px-6 relative overflow-hidden border-t border-[#0A1F3D]/5 bg-white/30 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl relative z-10">
              <div className="mb-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-3 mb-4 bg-[#C5A059]/10 px-3.5 py-1 rounded-full border border-[#C5A059]/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059]" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059]">Conteúdo Exclusivo</span>
                  </div>
                  <h2 className="font-serif text-[#0A1F3D] tracking-tight leading-tight"
                    style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                    {t('blog.title')}
                  </h2>
                  <p className="mt-3 text-[#64748B] max-w-lg text-base leading-relaxed">{t('blog.subtitle')}</p>
                </div>
                <Link
                  href="/blog"
                  className="group inline-flex items-center gap-2 text-sm font-bold text-[#489FB5] hover:text-[#2A7A94] transition-all duration-300 px-5 py-2.5 rounded-xl border border-[#489FB5]/15 bg-white hover:shadow-md shrink-0"
                >
                  {t('blog.viewAll')}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {blogPosts.length === 0 ? (
                <div className="rounded-3xl border border-[#0A1F3D]/8 bg-white/80 backdrop-blur-md p-20 text-center shadow-xl shadow-[#0A1F3D]/5">
                  <div className="text-5xl mb-4 animate-bounce">✍️</div>
                  <p className="text-[#64748B] text-lg font-medium">Conteúdo em breve — gestão de clínicas, marketing médico, LGPD e automação.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {blogPosts.slice(0, 3).map((post) => (
                    <Link
                      key={post.slug}
                      href={{ pathname: '/blog/[slug]', params: { slug: post.slug } }}
                      className="group relative overflow-hidden rounded-3xl border border-[#0A1F3D]/6 bg-white/70 backdrop-blur-md transition-all duration-500 hover:bg-white/95 hover:border-[#C5A059]/40 hover:shadow-2xl hover:shadow-[#0A1F3D]/8 hover:-translate-y-2"
                    >
                      {/* Top color accent strip */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#489FB5]/30 to-[#C5A059]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:blur-[1px]"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F3D]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                      
                      <div className="p-8">
                        <div className="flex items-center gap-3 mb-4 text-xs font-semibold text-[#64748B]">
                          <span className="uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#EEF0F8] text-[#0A1F3D] text-[9px]">
                            {post.category || 'Gestão'}
                          </span>
                          <span>•</span>
                          <span>{post.readTime || '5 min'} de leitura</span>
                        </div>
                        <h3 className="font-serif text-lg font-extrabold text-[#0A1F3D] mb-3 line-clamp-2 group-hover:text-[#C5A059] transition-colors duration-300 leading-snug">
                          {post.title}
                        </h3>
                        <p className="text-sm text-[#64748B] line-clamp-2 leading-relaxed font-medium">
                          {post.excerpt}
                        </p>
                        
                        <div className="mt-6 pt-4 border-t border-[#0A1F3D]/5 flex items-center gap-1.5 text-xs font-bold text-[#489FB5] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                          Ler artigo completo →
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* 9. Final CTA Section - Revitalized Monumental Layout */}
          <section className="py-32 px-6 relative overflow-hidden">
            {/* Monumental Deep Blue and Gold background container */}
            <div className="mx-auto max-w-6xl rounded-3xl overflow-hidden relative border border-[#C5A059]/25 shadow-2xl bg-gradient-to-br from-[#0A1F3D] via-[#122A4E] to-[#0A1F3D] py-20 px-8 sm:px-16 text-center">
              
              {/* Inner thin double border for editorial touch */}
              <div className="absolute inset-4 rounded-[20px] border border-white/5 pointer-events-none z-0" />
              <div className="absolute inset-5 rounded-[16px] border border-[#C5A059]/10 pointer-events-none z-0" />

              {/* Decorative radial glows */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none z-0 opacity-30 blur-[110px]"
                  style={{ background: 'radial-gradient(circle, rgba(197,160,89,0.22) 0%, transparent 65%)' }} />

              <div className="relative z-10 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-3 mb-6 bg-white/5 border border-white/10 rounded-full px-4.5 py-1.5 shadow-inner">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059] animate-pulse" />
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#C5A059]">{t('cta.badge')}</span>
                </div>
                
                <h2 className="font-serif text-white leading-tight tracking-tight mb-6"
                  style={{ fontSize: 'clamp(2.25rem, 5.5vw, 3.75rem)' }}>
                  {t('cta.title')}
                </h2>
                
                <p className="text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed text-base sm:text-lg">
                  {t('cta.subtitle')}
                </p>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-5 mb-10">
                  <Link 
                    href="/register" 
                    className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#AC863F] hover:from-[#D7B16A] hover:to-[#C5A059] px-10 py-4.5 text-base font-extrabold text-white transition-all duration-300 shadow-2xl shadow-[#C5A059]/20 hover:shadow-[#C5A059]/35 hover:-translate-y-0.5 w-full sm:w-auto"
                  >
                    {/* Inner gold glow effect */}
                    <div className="absolute inset-px rounded-[10px] bg-gradient-to-t from-black/10 via-transparent to-white/10 pointer-events-none" />
                    {t('cta.btnPrimary')}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link 
                    href="/precos" 
                    className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm px-10 py-4.5 text-base font-bold text-white hover:border-white/25 hover:bg-white/10 transition-all duration-300 w-full sm:w-auto"
                  >
                    {t('cta.btnSecondary')}
                  </Link>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-semibold text-slate-400">
                  {[t('cta.freeForever'), t('cta.supportPt')].map((item, i) => (
                    <span key={i} className="flex items-center gap-2">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#489FB5]/15 border border-[#489FB5]/20">
                        <svg className="h-3 w-3 text-[#489FB5]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

        </div>
        <StickyCTA />
      </div>
    </>
  )
}
