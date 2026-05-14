import { Metadata } from "next"
import { AnnouncementBar } from "@/components/marketing/announcement-bar"
import { Hero } from "@/components/marketing/hero"
import { Logos } from "@/components/marketing/logos"
import { SolutionsTabs } from "@/components/marketing/solutions-tabs"
import { FeaturesExpanded } from "@/components/marketing/features-expanded"
import { SocialProof } from "@/components/marketing/social-proof"
import dynamic from "next/dynamic"
import Script from "next/script"


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
  const isEn = locale === 'en'

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Estetia CRM",
    "applicationCategory": "BusinessApplication",
    "applicationSubCategory": "CRM",
    "operatingSystem": "Web, iOS, Android",
    "url": "https://estetiacrm.com.br",
    "description": "CRM completo para clínicas de estética e dermatologia: agenda inteligente, anamnese digital, recall automático via WhatsApp, LGPD compliance e prontuário eletrônico.",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "BRL",
      "lowPrice": "0",
      "highPrice": "597",
      "offerCount": "4",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": 4.8,
      "reviewCount": 127,
      "bestRating": 5,
      "worstRating": 1
    },
    "featureList": [
      "Pipeline Kanban visual com drag-and-drop",
      "WhatsApp integrado via Evolution API",
      "Estetia IA — Assistente clínico e de gestão",
      "Prospecção automática pelo Google Maps",
      "Automações de follow-up por email e WhatsApp",
      "Analytics PRO com previsão de receita",
      "Modo offline para vendedores externos",
      "API pública e webhooks"
    ],
    "screenshot": "https://estetiacrm.com.br/og-image.png",
    "softwareVersion": "2.0",
    "datePublished": "2024-01-01",
    "author": {
      "@type": "Organization",
      "name": "ROI Labs",
      "url": "https://roilabs.com.br"
    }
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Estetia CRM",
    "description": "CRM completo para clínicas de estética: agenda inteligente, anamnese digital, recall automático via WhatsApp, LGPD compliance e Estetia IA para gestão clínica.",
    "brand": {
      "@type": "Brand",
      "name": "ROI Labs"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "BRL",
      "lowPrice": "0",
      "highPrice": "597",
      "offerCount": "4",
      "availability": "https://schema.org/InStock",
      "url": "https://estetiacrm.com.br/pricing"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": 4.8,
      "reviewCount": 127,
      "bestRating": 5,
      "worstRating": 1
    },
    "review": [
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Carlos Silva" },
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
        "reviewBody": "Finalmente um CRM que não complica. Em 10 minutos já estava usando e fechando negócios mais rápido."
      },
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Mariana Souza" },
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
        "reviewBody": "O WhatsApp integrado economiza horas por semana. Meu time adora a simplicidade!"
      }
    ],
    "image": "https://estetiacrm.com.br/og-image.png",
    "url": "https://estetiacrm.com.br"
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "O que é o Estetia CRM?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Estetia CRM é uma plataforma completa de vendas com pipeline Kanban, WhatsApp integrado via Evolution API, IA comercial (Estetia IA), prospecção automática pelo Google Maps, automações de deals e email, analytics avançado e API pública. Feito para vendedores brasileiros."
        }
      },
      {
        "@type": "Question",
        "name": "O Estetia CRM é gratuito?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! O plano Gratuito inclui 250 contatos, 100 negócios e 1 pipeline sem prazo de expiração. Para mais recursos, oferecemos Starter (R$149/mês), Pro (R$297/mês) e Business (R$597/mês)."
        }
      },
      {
        "@type": "Question",
        "name": "Como funciona o WhatsApp integrado?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "O Estetia se conecta ao WhatsApp via API Oficial Meta. Envie lembretes de consulta, recall automático e confirmações diretamente do CRM, com inbox unificado e registro de histórico no prontuário."
        }
      },
      {
        "@type": "Question",
        "name": "Como funciona a prospecção pelo Google Maps?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Automatize o recall de pacientes. O Estetia envia lembretes de retorno, confirmações de agenda e mensagens personalizadas via WhatsApp. Cada plano inclui créditos mensais: Starter 75, Pro 300 e Business 1.500 leads/mês."
        }
      },
      {
        "@type": "Question",
        "name": "Posso cancelar quando quiser?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim, sem multas ou taxas. Cancele a qualquer momento e mantenha acesso até o fim do período pago. Garantia de 7 dias em todos os planos pagos."
        }
      }
    ]
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "ROI Labs - Estetia CRM",
    "url": "https://estetiacrm.com.br",
    "logo": "https://estetiacrm.com.br/logo.png",
    "image": "https://estetiacrm.com.br/og-image.png",
    "description": "CRM completo com pipeline Kanban, WhatsApp integrado, IA comercial, prospecção Google Maps e automações para vendedores brasileiros",
    "telephone": "+55-62-98344-3919",
    "email": "roilabs.ia@gmail.com",
    "areaServed": { "@type": "Country", "name": "Brasil" },
    "address": { "@type": "PostalAddress", "addressCountry": "BR", "addressRegion": "GO" },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      }
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+55-62-98344-3919",
      "contactType": "customer support",
      "availableLanguage": "Portuguese",
      "areaServed": "BR"
    },
    "sameAs": [
      "https://www.linkedin.com/company/roilabs",
      "https://twitter.com/roilabs"
    ],
    "priceRange": "R$ 0 - R$ 597/mês"
  };

  const plans = [
    {
      name: isEn ? 'Free' : 'Gratuito',
      price: 'R$ 0',
      period: isEn ? '' : '',
      description: isEn ? 'To test the CRM' : 'Para testar o CRM',
      features: isEn ? ['2 Users', '250 Contacts', '100 Deals', '1 Pipeline'] : ['2 Usuários', '250 Contatos', '100 Negócios', '1 Pipeline'],
      highlighted: false,
    },
    {
      name: 'Starter',
      price: 'R$ 149',
      period: isEn ? '/mo' : '/mês',
      description: isEn ? 'For small businesses' : 'Para pequenas empresas',
      features: isEn ? ['5 Users', '1,000 Contacts', 'WhatsApp', '75 leads/mo'] : ['5 Usuários', '1.000 Contatos', 'WhatsApp', '75 leads/mês'],
      highlighted: false,
    },
    {
      name: 'Pro',
      price: 'R$ 297',
      period: isEn ? '/mo' : '/mês',
      description: isEn ? 'For growing teams' : 'Para equipes em crescimento',
      features: isEn ? ['15 Users', '5,000 Contacts', 'Sales AI', '300 leads/mo'] : ['15 Usuários', '5.000 Contatos', 'IA Comercial', '300 leads/mês'],
      highlighted: true,
    },
    {
      name: 'Business',
      price: 'R$ 597',
      period: isEn ? '/mo' : '/mês',
      description: isEn ? 'For large operations' : 'Para grandes operações',
      features: isEn ? ['50 Users', 'Unlimited', 'Round-Robin', '1,500 leads/mo'] : ['50 Usuários', 'Ilimitado', 'Round-Robin', '1.500 leads/mês'],
      highlighted: false,
    },
  ]

  return (
    <>
      <Script
        id="software-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

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
                <p className="text-[#64748B] max-w-xl mx-auto">{t('plans.subtitle')}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`group relative rounded-2xl border p-7 flex flex-col transition-all duration-300 ${
                      plan.highlighted
                        ? 'border-[#C5A059] bg-[#0A1F3D] shadow-2xl shadow-[#0A1F3D]/25 scale-[1.02]'
                        : 'border-[#0A1F3D]/8 bg-[#EEF0F8] hover:border-[#0A1F3D]/20 hover:shadow-md hover:-translate-y-0.5'
                    }`}
                  >
                    {plan.highlighted && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                        <div className="rounded-full bg-gradient-to-r from-[#C5A059] to-[#8B6E32] px-4 py-1 text-xs font-bold text-white tracking-wide shadow-lg">
                          {t('plans.mostPopular')}
                        </div>
                      </div>
                    )}
                    {!plan.highlighted && (
                      <div className="absolute top-0 left-6 right-6 h-[2px] rounded-full bg-[#0A1F3D]/8 group-hover:bg-[#C5A059]/40 transition-colors duration-300" />
                    )}
                    <div className="mb-5">
                      <h3 className={`text-lg font-bold mb-1 ${plan.highlighted ? 'text-white' : 'text-[#0A1F3D]'}`}>
                        {plan.name}
                      </h3>
                      <p className={`text-sm ${plan.highlighted ? 'text-white/60' : 'text-[#64748B]'}`}>
                        {plan.description}
                      </p>
                    </div>
                    <div className="flex items-baseline gap-1 mb-7">
                      <span className={`font-serif font-bold ${plan.highlighted ? 'text-white' : 'text-[#0A1F3D]'}`}
                        style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)' }}>
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className={`text-sm ${plan.highlighted ? 'text-white/50' : 'text-[#64748B]'}`}>
                          {plan.period}
                        </span>
                      )}
                    </div>
                    <ul className="space-y-2.5 mb-8 flex-1">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2.5 text-sm">
                          <span className={`inline-flex h-4 w-4 items-center justify-center rounded-full shrink-0 ${
                            plan.highlighted ? 'bg-[#C5A059]/20' : 'bg-[#489FB5]/15'
                          }`}>
                            <svg className={`h-2.5 w-2.5 ${plan.highlighted ? 'text-[#C5A059]' : 'text-[#489FB5]'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                          <span className={plan.highlighted ? 'text-white/80' : 'text-[#64748B]'}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={plan.highlighted ? '/register' : '/pricing'}
                      className={`inline-flex h-11 items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 w-full ${
                        plan.highlighted
                          ? 'bg-[#C5A059] hover:bg-[#B8913F] text-[#0A1F3D] shadow-lg shadow-[#C5A059]/30 hover:-translate-y-0.5'
                          : 'bg-white border border-[#0A1F3D]/12 text-[#0A1F3D] hover:border-[#0A1F3D]/25 hover:shadow-sm'
                      }`}
                    >
                      {plan.price === 'R$ 0' || plan.price === '$ 0' ? t('plans.startFree') : t('plans.seeDetails')}
                    </Link>
                  </div>
                ))}
              </div>

              <div className="mt-10 text-center">
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-1.5 text-sm text-[#489FB5] hover:text-[#2A7A94] transition-colors font-medium"
                >
                  {t('plans.compareLink')}
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
                <Link href="/pricing" className="inline-flex items-center justify-center rounded-xl border border-[#0A1F3D]/15 bg-[#EEF0F8] px-10 py-4 text-base font-medium text-[#0A1F3D] hover:border-[#0A1F3D]/25 hover:bg-[#E8EAF4] transition-colors">
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
