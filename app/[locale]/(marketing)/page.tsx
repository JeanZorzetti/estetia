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

      <div className="min-h-screen bg-white text-[#0A1F3D] selection:bg-[#489FB5]/20">
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

          {/* 6. Pricing */}
          <section className="py-24 px-6 bg-[#EEF0F8]">
            <div className="mx-auto max-w-7xl">
              <div className="mb-16 text-center">
                <div className="inline-flex items-center gap-3 mb-5">
                  <div className="h-px w-8 bg-[#C5A059]" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A059]">Planos</span>
                  <div className="h-px w-8 bg-[#C5A059]" />
                </div>
                <h2 className="font-serif text-[#0A1F3D] tracking-tight leading-tight mb-4"
                  style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}>
                  {t('plans.title')}
                </h2>
                <p className="text-[#64748B] max-w-xl mx-auto">
                  Pague apenas pelos módulos que sua clínica usa. A partir de R$ 39/mês (Plataforma Base) + os módulos que você escolher.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ScenarioCard
                  icon="LayoutDashboard"
                  title="Clínica Solo"
                  subtitle="Para profissionais autônomos que estão começando a digitalizar a clínica."
                  modules={[
                    'Plataforma Base (agenda + LGPD)',
                    'Prontuário eletrônico',
                    'Controle de procedimentos',
                    'Pacotes e séries',
                  ]}
                  totalCents={16600}
                />
                <ScenarioCard
                  icon="Sparkles"
                  title="Clínica Média"
                  subtitle="Para clínicas com equipe, múltiplos procedimentos e comunicação ativa."
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
                <ScenarioCard
                  icon="Brain"
                  title="Dermato com Convênios"
                  subtitle="Para dermatologistas que atendem convênios e precisam de TISS/TUSS."
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

              <div className="mt-10 text-center">
                <Link
                  href="/precos"
                  className="inline-flex items-center gap-1.5 text-sm text-[#489FB5] hover:text-[#2A7A94] transition-colors font-medium"
                >
                  Monte seu plano →
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>

          {/* 8. Blog */}
          <section className="py-24 px-6 bg-white">
            <div className="mx-auto max-w-7xl">
              <div className="mb-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="h-px w-8 bg-[#C5A059]" />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A059]">Blog</span>
                  </div>
                  <h2 className="font-serif text-[#0A1F3D] tracking-tight leading-tight"
                    style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}>
                    {t('blog.title')}
                  </h2>
                  <p className="mt-3 text-[#64748B] max-w-md">{t('blog.subtitle')}</p>
                </div>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#489FB5] hover:text-[#2A7A94] transition-colors shrink-0"
                >
                  {t('blog.viewAll')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {blogPosts.length === 0 ? (
                <div className="rounded-2xl border border-[#0A1F3D]/8 bg-white p-16 text-center">
                  <div className="text-4xl mb-4">✍️</div>
                  <p className="text-[#64748B]">Conteúdo em breve — gestão de clínicas, LGPD, WhatsApp e mais.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {blogPosts.slice(0, 3).map((post) => (
                    <Link
                      key={post.slug}
                      href={{ pathname: '/blog/[slug]', params: { slug: post.slug } }}
                      className="group relative overflow-hidden rounded-2xl border border-[#0A1F3D]/8 bg-white transition-all duration-300 hover:border-[#C5A059]/40 hover:shadow-xl hover:shadow-[#0A1F3D]/8 hover:-translate-y-1"
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="font-serif text-base font-bold text-[#0A1F3D] mb-2 line-clamp-2 group-hover:text-[#C5A059] transition-colors duration-200 leading-snug">
                          {post.title}
                        </h3>
                        <p className="text-sm text-[#64748B] line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* 9. Final CTA — "Switch to a complete platform" */}
          <section className="py-24 px-6 bg-[#EEF0F8]">
            <div className="mx-auto max-w-4xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A059] mb-4">{t('cta.badge')}</p>
              <h2 className="font-serif text-[#0A1F3D] leading-tight tracking-tight mb-5"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
                {t('cta.title')}
              </h2>
              <p className="text-[#64748B] mb-10 max-w-lg mx-auto leading-relaxed text-lg">
                {t('cta.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                <Link href="/register" className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A1F3D] hover:bg-[#162D54] px-10 py-4 text-base font-bold text-white transition-all duration-200 shadow-xl shadow-[#0A1F3D]/15 hover:-translate-y-0.5">
                  {t('cta.btnPrimary')}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link href="/precos" className="inline-flex items-center justify-center rounded-xl border border-[#0A1F3D]/15 bg-[#EEF0F8] px-10 py-4 text-base font-medium text-[#0A1F3D] hover:border-[#0A1F3D]/25 hover:bg-[#E8EAF4] transition-colors">
                  {t('cta.btnSecondary')}
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-sm text-[#64748B]">
                {[t('cta.freeForever'), t('cta.supportPt')].map((item, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#489FB5]/15">
                      <svg className="h-2.5 w-2.5 text-[#489FB5]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </section>

        </div>
        <StickyCTA />
      </div>
    </>
  )
}
