import { notFound } from 'next/navigation'
import Link from 'next/link'
import { blogPosts } from '@/lib/blog-data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShareButtons } from '@/components/blog/share-buttons'
import { TableOfContents } from '@/components/blog/table-of-contents'
import { BlogContentWrapper } from '@/components/blog/blog-content-wrapper'
import { generateFAQSchema, spinSellingClinicaFAQs, noShowClinicaFAQs, lgpdClinicaFAQs, anamneseDigitalFAQs, kpisClinicaFAQs, estetiaHomepageFAQs, FAQItem } from '@/lib/faq-schema'
import { generateArticleSchema, COMMON_WIKIDATA_ENTITIES, createGeoConfig } from '@/lib/geo/schema-generator'
import { getHowToSchema } from '@/lib/howto-schemas'
import { JsonLd } from '@/components/seo/json-ld'
import { Metadata } from 'next'
import { ChevronLeft, ChevronRight, Calendar, Clock, User, ArrowRight } from 'lucide-react'
import { getCategoryColor } from '@/lib/blog/index'
import { getRelatedPostsByEntities, processBlogPost } from '@/lib/nlp/blog-processor'
import { RelatedLinksBar } from '@/components/blog/related-links-bar'
import { NewsletterCTA } from '@/components/blog/newsletter-cta'

interface BlogPostPageProps {
  params: Promise<{
    locale: string
    slug: string
  }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) return { title: 'Post não encontrado' }

  const url = `https://estetiacrm.com.br/blog/${slug}`

  // OG Image dinâmica para todos os posts (branded com título + categoria)
  const ogParams = new URLSearchParams({ title: post.title, category: post.category })
  let imageUrl = `https://estetiacrm.com.br/api/og/blog?${ogParams.toString()}`

  // Override específico: post com calculadora ROI usa OG image customizada
  if (slug === 'custo-oculto-inacao-crm') {
    const roiParams = new URLSearchParams({
      roi: '94282',
      title: 'O Custo Oculto da Inação no CRM',
      scenario: 'realista',
    })
    imageUrl = `https://estetiacrm.com.br/api/og?${roiParams.toString()}`
  }

  // AI-optimized descriptions for each Estetia post (fatos diretos para LLMs)
  let aiOptimizedDescription = post.excerpt

  if (slug === 'spin-selling-para-clinicas-de-estetica') {
    aiOptimizedDescription = 'SPIN Selling adaptado para consultas de avaliação estética: 12 perguntas-modelo (Situação, Problema, Implicação, Necessidade) que aumentam a conversão de avaliações em até 40% sem pressão de venda. Inclui script de consulta e exemplos para procedimentos de alto ticket.'
  } else if (slug === 'como-reduzir-no-show-em-clinicas-de-estetica') {
    aiOptimizedDescription = 'No-show médio em clínicas de estética: 15-30% das consultas. Clínicas com confirmação automática via WhatsApp + no-show predictor IA reduzem cancelamentos em 35-45%. Inclui cálculo de perda financeira e lista de espera automática.'
  } else if (slug === 'lgpd-para-clinicas-de-estetica-guia-2026') {
    aiOptimizedDescription = 'LGPD Art. 11 classifica dados de saúde como sensíveis. Clínicas de estética e dermatologia precisam de: consentimento específico para fotos, criptografia de prontuários, DPO designado, política de privacidade publicada. Multas de até 2% do faturamento ou R$50M.'
  } else if (slug === 'anamnese-digital-clinica-de-estetica') {
    aiOptimizedDescription = 'Anamnese digital reduz tempo de espera na recepção, elimina papel, gera alertas automáticos de contraindicações (gravidez, anticoagulantes, lúpus) e tem validade jurídica pela Lei 14.063/2020. Paciente preenche pelo celular antes da consulta.'
  } else if (slug === 'kpis-essenciais-clinica-de-estetica') {
    aiOptimizedDescription = '5 KPIs prioritários para clínicas de estética: taxa de ocupação (ideal 80-90%), no-show (meta < 10%), recompra em 90 dias (saudável > 40%), LTV por paciente, ticket médio por procedimento. Dashboard em tempo real no Estetia CRM.'
  }

  return {
    title: `${post.title} | Estetia Blog`,
    description: aiOptimizedDescription,
    keywords: post.category,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: aiOptimizedDescription,
      url,
      siteName: 'Estetia CRM',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: 'pt_BR',
      type: 'article',
      publishedTime: post.date,
      authors: [post.author || 'Equipe Estetia'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: aiOptimizedDescription,
      images: [imageUrl],
      creator: '@roilabs',
    },
  }
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug, locale } = await params
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }

  const isEnLocale = locale === 'en'
  const displayTitle = isEnLocale && post.titleEn ? post.titleEn : post.title
  const displayContent = isEnLocale && post.contentEn ? post.contentEn : post.content

  // Optional: Auto-process blog post in background (production only)
  // This ensures all posts are eventually processed without manual intervention
  if (process.env.NODE_ENV === 'production' && process.env.ENABLE_AUTO_NLP === 'true') {
    processBlogPost(slug).catch((error) => {
      console.error(`[Auto-NLP] Failed to process ${slug}:`, error)
    })
  }

  // Get related posts using knowledge graph (semantic similarity)
  // Falls back to random posts if knowledge graph not yet populated
  const relatedPosts = await getRelatedPostsByEntities(slug, 2)

  const url = `https://estetiacrm.com.br/blog/${slug}`
  const rawImage = post.image || '/logo.png'
  const imageUrl = rawImage.startsWith('http') ? rawImage : `https://estetiacrm.com.br${rawImage}`

  // GEO-optimized JSON-LD Schema with Wikidata entity disambiguation
  const estetiaAuthor = {
    name: post.author || 'Equipe Estetia',
    sameAs: ['https://www.linkedin.com/company/roi-labs'],
    worksFor: { name: 'ROI Labs', url: 'https://roilabs.com.br' },
  }

  let geoConfig = createGeoConfig.aestheticMedicine({ author: estetiaAuthor })

  if (slug === 'spin-selling-para-clinicas-de-estetica') {
    geoConfig = createGeoConfig.aestheticMedicine({
      mentions: [
        COMMON_WIKIDATA_ENTITIES.AESTHETIC_MEDICINE,
        COMMON_WIKIDATA_ENTITIES.CRM,
        COMMON_WIKIDATA_ENTITIES.BRAZIL,
        COMMON_WIKIDATA_ENTITIES.SPIN_SELLING,
        COMMON_WIKIDATA_ENTITIES.CONSULTATIVE_SELLING,
        COMMON_WIKIDATA_ENTITIES.SALES,
      ],
      about: [COMMON_WIKIDATA_ENTITIES.AESTHETIC_MEDICINE, COMMON_WIKIDATA_ENTITIES.SALES],
      author: estetiaAuthor,
    })
  } else if (slug === 'como-reduzir-no-show-em-clinicas-de-estetica') {
    geoConfig = createGeoConfig.aestheticMedicine({
      mentions: [
        COMMON_WIKIDATA_ENTITIES.AESTHETIC_MEDICINE,
        COMMON_WIKIDATA_ENTITIES.CRM,
        COMMON_WIKIDATA_ENTITIES.BRAZIL,
        COMMON_WIKIDATA_ENTITIES.APPOINTMENT_SCHEDULING,
        COMMON_WIKIDATA_ENTITIES.WHATSAPP,
      ],
      about: [COMMON_WIKIDATA_ENTITIES.AESTHETIC_MEDICINE, COMMON_WIKIDATA_ENTITIES.APPOINTMENT_SCHEDULING],
      author: estetiaAuthor,
    })
  } else if (slug === 'lgpd-para-clinicas-de-estetica-guia-2026') {
    geoConfig = createGeoConfig.lgpdHealth({
      citations: [
        'https://www.gov.br/anpd/pt-br',
        'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm',
      ],
      author: estetiaAuthor,
    })
  } else if (slug === 'anamnese-digital-clinica-de-estetica') {
    geoConfig = createGeoConfig.aestheticMedicine({
      mentions: [
        COMMON_WIKIDATA_ENTITIES.AESTHETIC_MEDICINE,
        COMMON_WIKIDATA_ENTITIES.ELECTRONIC_HEALTH_RECORD,
        COMMON_WIKIDATA_ENTITIES.GENERAL_DATA_PROTECTION,
        COMMON_WIKIDATA_ENTITIES.BRAZIL,
        COMMON_WIKIDATA_ENTITIES.BOTULINUM_TOXIN,
      ],
      about: [COMMON_WIKIDATA_ENTITIES.ELECTRONIC_HEALTH_RECORD, COMMON_WIKIDATA_ENTITIES.AESTHETIC_MEDICINE],
      author: estetiaAuthor,
    })
  } else if (slug === 'kpis-essenciais-clinica-de-estetica') {
    geoConfig = createGeoConfig.clinicKpis({ author: estetiaAuthor })
  }

  const articleSchema = generateArticleSchema(post, {
    ...geoConfig,
    canonicalUrl: url,
    imageUrl,
  })

  // BreadcrumbList JSON-LD for Google Rich Results
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://estetiacrm.com.br" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://estetiacrm.com.br/blog" },
      { "@type": "ListItem", "position": 3, "name": post.title, "item": url }
    ]
  }

  // FAQ Schema for posts with FAQ sections (for Featured Snippets)
  const faqDataMap: Record<string, FAQItem[]> = {
    'spin-selling-para-clinicas-de-estetica': spinSellingClinicaFAQs,
    'como-reduzir-no-show-em-clinicas-de-estetica': noShowClinicaFAQs,
    'lgpd-para-clinicas-de-estetica-guia-2026': lgpdClinicaFAQs,
    'anamnese-digital-clinica-de-estetica': anamneseDigitalFAQs,
    'kpis-essenciais-clinica-de-estetica': kpisClinicaFAQs,
  }
  const faqSchema = faqDataMap[slug] ? generateFAQSchema(faqDataMap[slug], url) : null

  const catColor = getCategoryColor(post.category)
  const readingWords = displayContent.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length
  const readingMinutes = Math.max(3, Math.ceil(readingWords / 200))

  return (
    <>
      {/* GEO-optimized JSON-LD Schema with Wikidata entity disambiguation */}
      <JsonLd data={articleSchema} />

      {/* BreadcrumbList JSON-LD for Rich Results */}
      <JsonLd data={breadcrumbSchema} />

      {/* FAQ Schema for Featured Snippets (if available) */}
      {faqSchema && <JsonLd data={faqSchema} />}

      {/* HowTo Schema for tutorial articles */}
      {(() => { const h = getHowToSchema(slug); return h ? <JsonLd data={h} /> : null })()}


      {/* ── Hero full-bleed editorial ── */}
      <div className="relative w-full overflow-hidden bg-[#0A1F3D]" style={{ height: '62vh', minHeight: '450px', maxHeight: '650px' }}>
        {/* Fine-line Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:45px_45px] pointer-events-none z-0 opacity-60" />

        {/* Ambient Gradient Hero */}
        <div className="absolute inset-0 z-0"
          style={{ background: `linear-gradient(135deg, ${catColor}25 0%, #0A1F3D 55%, #0A1F3D 100%)` }} />

        {/* Decorative Watermark */}
        <div className="absolute inset-0 flex items-center justify-center z-0 select-none pointer-events-none">
          <span className="font-serif text-[28rem] font-bold leading-none"
            style={{ color: catColor, opacity: 0.06 }}>
            {post.category.charAt(0)}
          </span>
        </div>

        {/* Dark overlay for content legibility */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0A1F3D] via-[#0A1F3D]/50 to-transparent" />

        {/* Hero content */}
        <div className="absolute inset-0 flex flex-col justify-end z-10">
          <div className="container mx-auto px-6 pb-16 max-w-5xl text-center md:text-left">
            {/* Breadcrumb in luxury pills */}
            <nav className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-[10px] mb-8 font-bold tracking-[0.15em] uppercase text-[#94A3B8]" aria-label="Breadcrumb">
              <Link href={`/${locale}`} className="hover:text-white transition-colors bg-white/5 border border-white/10 px-3 py-1 rounded-full backdrop-blur-md">Home</Link>
              <ChevronRight className="w-3 h-3 opacity-45" />
              <Link href={`/${locale}/blog`} className="hover:text-white transition-colors bg-white/5 border border-white/10 px-3 py-1 rounded-full backdrop-blur-md">Blog</Link>
              <ChevronRight className="w-3 h-3 opacity-45" />
              <span className="text-[#C5A059] bg-[#C5A059]/10 border border-[#C5A059]/20 px-3 py-1 rounded-full backdrop-blur-md">{post.category}</span>
            </nav>

            {/* Category badge */}
            <div className="mb-6">
              <span className="inline-flex px-4 py-1.5 rounded-full tracking-[0.2em] uppercase text-[10px] font-bold text-white backdrop-blur-md bg-white/10 border border-white/20 shadow-md">
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[3.5rem] font-bold leading-[1.15] text-[#FFFFFF] mb-8 max-w-4xl mx-auto md:mx-0 tracking-tight">
              {displayTitle}
            </h1>

            {/* Meta badges in premium chips */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[10px] font-bold tracking-[0.1em] text-[#94A3B8] uppercase">
              <span className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                <User className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{post.author || 'Equipe Estetia'}</span>
              </span>
              <span className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{new Date(post.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </span>
              <span className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{readingMinutes} min de leitura</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Article body ── */}
      <div className="bg-[#F8F9FC]">
        <div className="container mx-auto px-6 py-16 max-w-7xl">

          {/* Back button */}
          <div className="mb-12">
            <Link href={`/${locale}/blog`}
              className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#64748B] hover:text-[#0A1F3D] transition-colors hover:scale-[1.02] duration-300">
              <ChevronLeft className="w-4 h-4 text-[#C5A059]" />
              <span>Voltar para o Blog</span>
            </Link>
          </div>

          {/* Share + 2-col layout */}
          <div className="grid lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_320px] gap-12 xl:gap-20">

            {/* Main content */}
            <div>
              {/* Share bar */}
              <div className="mb-10 pb-8 border-b border-[#0A1F3D]/10">
                <ShareButtons title={post.title} url={url} />
              </div>

              {/* Excerpt callout (Suntuoso painel translúcido) */}
              <div className="backdrop-blur-md bg-white/40 border border-white/60 p-8 sm:p-10 rounded-[2rem] shadow-[0_15px_35px_rgba(0,0,0,0.02)] mb-12 relative overflow-hidden"
                style={{ borderLeft: `6px solid ${catColor}` }}>
                {/* Micro-glow inside callout */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[40px] pointer-events-none"
                  style={{ backgroundColor: `${catColor}15` }} />
                <p className="text-lg md:text-xl font-serif italic leading-relaxed text-[#0A1F3D] relative z-10">
                  {isEnLocale && post.excerptEn ? post.excerptEn : post.excerpt}
                </p>
              </div>

              {/* Article HTML content (Painel de alta costura em vidro fosco) */}
              <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white/50 overflow-hidden">
                <div className="p-8 sm:p-12 md:p-16">
                  <BlogContentWrapper content={displayContent} slug={slug} />
                </div>
              </div>

              {/* Internal Linking Bar */}
              <div className="mt-12">
                <RelatedLinksBar currentSlug={slug} relatedSlugs={post.relatedSlugs} />
              </div>

              {/* Newsletter CTA */}
              <div className="mt-12">
                <NewsletterCTA />
              </div>
            </div>

            {/* TOC sidebar */}
            <div className="lg:sticky lg:top-32 h-fit">
              <TableOfContents content={displayContent} />
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-28 pt-20 border-t border-[#0A1F3D]/10">
              <div className="flex items-center gap-6 mb-12">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A1F3D]">
                  Continue lendo
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-[#0A1F3D]/20 to-transparent" />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {relatedPosts.map((relatedPost) => {
                  const relCatColor = getCategoryColor(relatedPost.category)
                  return (
                    <Link key={relatedPost.slug} href={`/${locale}/blog/${relatedPost.slug}`}
                      className="block group">
                      <div className="h-full flex flex-col bg-white/60 hover:bg-white backdrop-blur-md rounded-[2.2rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(0,0,0,0.06)] border border-white/40 hover:border-[#C5A059]/40 relative">
                        {/* Sub-glow */}
                        <div className="absolute inset-x-0 top-0 h-[2px]" style={{ backgroundColor: relCatColor }} />

                        <div className="relative h-48 w-full overflow-hidden flex items-center justify-center bg-[#0A1F3D]">
                          <div className="absolute inset-0 bg-gradient-to-br opacity-40 transition-transform duration-700 ease-out group-hover:scale-105" style={{ from: relCatColor, to: 'transparent' }} />
                          <span className="font-serif text-[6rem] font-bold select-none text-white opacity-10">
                            {relatedPost.category.charAt(0)}
                          </span>
                          <span className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full tracking-[0.15em] uppercase text-[9px] font-bold text-white backdrop-blur-md bg-[#0A1F3D]/40 border border-white/20">
                            {relatedPost.category}
                          </span>
                        </div>

                        <div className="p-8 flex flex-col flex-1">
                          <h3 className="font-serif text-xl sm:text-2xl font-bold leading-snug mb-4 flex-1 text-[#0A1F3D] group-hover:text-[#489FB5] transition-colors duration-300">
                            {relatedPost.title}
                          </h3>
                          <span className="flex items-center gap-1.5 text-xs font-bold tracking-[0.15em] uppercase group-hover:gap-2.5 transition-all duration-300"
                            style={{ color: relCatColor }}>
                            <span>Ler artigo</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Final CTA — full width navy */}
        <div className="bg-[#0A1F3D] relative overflow-hidden mt-24 border-t border-white/5">
          {/* Fine-line Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none z-0" />

          {/* Ambient Atmos Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-[#C5A059]/10 blur-[130px] pointer-events-none" />

          <div className="container mx-auto px-6 py-28 text-center max-w-3xl relative z-10">
            <p className="tracking-[0.2em] uppercase text-[10px] font-bold mb-4 text-[#C5A059]">
              Estetia CRM
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight max-w-2xl mx-auto">
              Pronto para implementar isso na sua clínica?
            </h2>
            <p className="text-base md:text-lg mb-12 text-[#94A3B8] max-w-lg mx-auto">
              14 dias grátis. Sem cartão de crédito. Comece a automatizar suas vendas hoje.
            </p>

            <div className="relative inline-block group">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#C5A059] to-[#C5A059]/50 opacity-40 blur-md group-hover:opacity-75 transition duration-500" />
              <Link href={`/${locale}/register`}
                className="relative inline-flex items-center justify-center gap-3 px-8 py-4.5 rounded-full font-bold text-sm bg-[#C5A059] text-[#0A1F3D] hover:bg-opacity-95 hover:scale-[1.02] transition-all duration-300 shadow-[0_8px_30px_rgba(197,160,89,0.3)]">
                <span>Começar agora</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
