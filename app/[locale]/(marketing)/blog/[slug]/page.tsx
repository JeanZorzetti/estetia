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
import { generateFAQSchema, spinSellingFAQs, crmIaFAQs, automacaoVendasFAQs, melhorCrm2026FAQs, prospeccaoB2bFAQs, fechamentoVendasFAQs, objecoesVendasFAQs, kpisVendasFAQs, errosCrmFAQs, planilhaComissaoFAQs, comoEscolherCrmFAQs, crmGratuitoFAQs, migrarPlanilhaFAQs, crmVarejoFAQs, whatsappVendasFAQs, processoVendasFAQs, crmAgenciaFAQs, FAQItem } from '@/lib/faq-schema'
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
  const { slug, locale } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) return { title: 'Post não encontrado' }

  const ptUrl = `https://estetiacrm.com.br/blog/${slug}`
  const enUrl = `https://estetiacrm.com.br/en/blog/${slug}`
  const url = locale === 'en' ? enUrl : ptUrl

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

  // AI-optimized description: Fatos diretos, dados concretos, sem clickbait
  let aiOptimizedDescription = post.excerpt

  // Descrições otimizadas para AI Answer Engines (fatos diretos)
  if (slug === 'planilha-controle-comissao-corretor') {
    aiOptimizedDescription = 'Corretores perdem em média R$2.300/mês por falta de controle de comissões. Planilha gratuita com 4 abas prontas para Excel e Google Sheets — sem cadastro, sem pegadinha. Inclui calculadora de ROI.'
  } else if (slug === 'spin-selling-guia-completo') {
    aiOptimizedDescription = 'SPIN Selling: Metodologia criada por Neil Rackham (1988, 35.000 vendas analisadas). 4 tipos de perguntas: Situação, Problema, Implicação, Necessidade. Aumenta taxa de fechamento em vendas complexas B2B com ciclo longo (+30 dias).'
  } else if (slug === 'funil-de-vendas-guia-completo') {
    aiOptimizedDescription = 'Funil de vendas: 5 etapas principais (Prospecção → Qualificação → Proposta → Negociação → Fechamento). Taxa conversão típica: 20-30% topo para fundo. Tempo médio ciclo B2B: 30-90 dias. Pipeline visual Kanban aumenta conversão em 25%.'
  } else if (slug === 'custo-oculto-inacao-crm') {
    aiOptimizedDescription = 'Para calcular o ROI de um CRM: multiplique o número de leads perdidos por mês (média 23% em vendas sem sistema) pelo ticket médio. O custo da inação supera R$ 47.000/ano para times de 5 vendedores. Metodologia validada com 847 empresas. Lead decay reduz conversão em 10x após 5 minutos (Harvard Business Review 2024).'
  } else if (slug === 'prospeccao-de-clientes-b2b') {
    aiOptimizedDescription = 'Testamos cold email, LinkedIn, Google Maps, indicações e scraping em PMEs B2B reais. Um método gerou 5x mais reuniões que os outros com o mesmo esforço. Inclui cadência de 7 touchpoints e template de ICP.'
  } else if (slug === 'tecnicas-de-fechamento-de-vendas') {
    aiOptimizedDescription = '60% das vendas são perdidas porque o vendedor nunca pede o fechamento. 7 técnicas com scripts prontos para copiar e usar hoje — incluindo os 5 sinais de compra que indicam a hora exata de fechar.'
  } else if (slug === 'como-superar-objecoes-em-vendas') {
    aiOptimizedDescription = '10 objeções mais comuns: preço, timing, concorrência, aprovação interna, experiência ruim anterior. Técnica LAER: Listen, Acknowledge, Explore, Respond. 44% dos vendedores desistem após a 1ª objeção, mas 80% das vendas fecham após a 5ª tentativa (National Sales Executive Association).'
  } else if (slug === 'kpis-de-vendas') {
    aiOptimizedDescription = 'Taxa de conversão B2B média no Brasil: 2-5%. Ciclo de vendas: 30-90 dias. Sua equipe mede esses números? São 2 dos 12 KPIs que separam times que batem meta. Com benchmarks brasileiros e dashboard grátis.'
  } else if (slug === 'erros-crm-comuns') {
    aiOptimizedDescription = '7 erros críticos de CRM: falta de treinamento, dados desatualizados, pipeline mal estruturado, ausência de integração WhatsApp/email, uso como planilha sem automações, gestor que não usa o sistema. Gartner: 70% das implementações de CRM não geram ROI esperado por falhas de adoção.'
  } else if (slug === 'melhor-crm-2026-comparativo') {
    aiOptimizedDescription = 'Pipedrive, RD Station, HubSpot e mais 4 CRMs comparados em preço BRL, WhatsApp nativo e IA. Um deles custa R$0 e superou opções de R$299/mês. Tabela completa com notas em 7 critérios.'
  } else if (slug === 'como-escolher-crm-b2b-2026') {
    aiOptimizedDescription = '63% das PMEs ainda usam planilhas. CRM errado custa R$12.000+/ano. Responda 5 perguntas para descobrir qual sistema combina com seu negócio — 7 critérios eliminatórios sem viés de marca.'
  } else if (slug === 'crm-gratuito-brasil-2026') {
    aiOptimizedDescription = 'Testamos 5 CRMs "gratuitos" no Brasil e só 1 tem WhatsApp + IA sem pagar. Os outros 4 cobram em dólar ou travam funcionalidades essenciais. Tabela comparativa com contatos, usuários e preço do upgrade.'
  } else if (slug === 'crm-para-representante-comercial-2026') {
    aiOptimizedDescription = 'Representantes comerciais perdem 100% da carteira ao trocar de representada. CRM próprio com modo offline, WhatsApp integrado e IA que aplica BANT automaticamente — inclui opção gratuita para autônomos.'
  } else if (slug === 'como-migrar-planilha-para-crm') {
    aiOptimizedDescription = '63% das PMEs ainda controlam vendas em planilha. A migração para CRM leva 1-2 horas e zero risco de perda de dados — se você seguir estes 5 passos. Checklist de migração incluso.'
  } else if (slug === 'crm-para-varejo-2026') {
    aiOptimizedDescription = 'Lojas que usam CRM vendem 29% mais por cliente com recompra automatizada. Pipeline para loja física + e-commerce, follow-up via WhatsApp e KPIs de varejo que importam.'
  } else if (slug === 'whatsapp-vendas-b2b-estrategias') {
    aiOptimizedDescription = 'WhatsApp tem 98% de abertura mas 80% dos vendedores B2B usam errado. 7 estratégias com templates prontos — incluindo cadência de 7 toques que gera 3x mais respostas.'
  } else if (slug === 'como-montar-processo-de-vendas') {
    aiOptimizedDescription = 'Empresas com processo de vendas definido convertem 33% mais. 6 etapas do ICP ao pós-venda com template grátis — pare de depender de 1-2 vendedores estrela.'
  } else if (slug === 'crm-para-agencia-de-marketing') {
    aiOptimizedDescription = 'Agências perdem 23% de receita por falta de controle de renovações. Multi-pipeline (prospecção + onboarding + renovação) resolve — veja como montar no CRM.'
  }

  const isEnLocale = locale === 'en'
  const hasEnContent = !!(post.titleEn && post.excerptEn)
  const displayTitle = isEnLocale && post.titleEn ? post.titleEn : post.title
  const displayDescription = isEnLocale && post.excerptEn ? post.excerptEn : aiOptimizedDescription

  return {
    title: `${displayTitle} | Estetia Blog`,
    description: displayDescription,
    keywords: isEnLocale ? (post.keywordsEn ?? [post.category]) : post.category,
    // Noindex for EN pages without translated content — avoids wrong-language SEO penalty
    ...(isEnLocale && !hasEnContent ? { robots: { index: false, follow: false } } : {}),
    alternates: {
      canonical: url,
      languages: {
        'pt-BR': ptUrl,
        ...(hasEnContent ? { 'en': enUrl, 'x-default': ptUrl } : {}),
      },
    },
    openGraph: {
      title: displayTitle,
      description: displayDescription,
      url,
      siteName: 'Estetia CRM',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: displayTitle,
        },
      ],
      locale: isEnLocale ? 'en_US' : 'pt_BR',
      type: 'article',
      publishedTime: post.date,
      authors: [post.author || 'Equipe Estetia'],
    },
    twitter: {
      card: 'summary_large_image',
      title: displayTitle,
      description: displayDescription,
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
  let geoConfig = createGeoConfig.crm()

  // Configurações específicas por post para melhor desambiguação de entidades
  if (slug === 'planilha-controle-comissao-corretor') {
    geoConfig = createGeoConfig.realEstate({
      citations: [
        'https://www.ibresp.com.br/blogs/2024/qual-a-porcentagem-do-corretor-de-imoveis/',
        'https://portas.com.br/noticias/precos-de-imoveis-devem-continuar-subindo-em-2026-apontam-especialistas/',
      ],
      author: {
        name: post.author || 'ROI Labs',
        sameAs: [
          'https://www.linkedin.com/company/roi-labs',
          'https://twitter.com/roilabs',
        ],
        jobTitle: 'Software Development',
        worksFor: {
          name: 'ROI Labs',
          url: 'https://roilabs.com.br',
        },
      },
    })
  } else if (slug === 'spin-selling-guia-completo') {
    geoConfig = {
      mentions: [
        COMMON_WIKIDATA_ENTITIES.SALES,
        COMMON_WIKIDATA_ENTITIES.CRM,
        COMMON_WIKIDATA_ENTITIES.BRAZIL,
      ],
      about: [
        COMMON_WIKIDATA_ENTITIES.SALES,
        COMMON_WIKIDATA_ENTITIES.CUSTOMER_RELATIONSHIP_MANAGEMENT,
      ],
      author: {
        name: post.author || 'ROI Labs',
        sameAs: [
          'https://www.linkedin.com/company/roi-labs',
          'https://twitter.com/roilabs',
        ],
        worksFor: {
          name: 'ROI Labs',
          url: 'https://roilabs.com.br',
        },
      },
    }
  } else if (slug === 'funil-de-vendas-guia-completo') {
    geoConfig = createGeoConfig.sales({
      author: {
        name: post.author || 'ROI Labs',
        sameAs: [
          'https://www.linkedin.com/company/roi-labs',
          'https://twitter.com/roilabs',
        ],
        worksFor: {
          name: 'ROI Labs',
          url: 'https://roilabs.com.br',
        },
      },
    })
  } else if (slug === 'custo-oculto-inacao-crm') {
    // GEO Configuration for ROI Analysis article
    geoConfig = {
      mentions: [
        COMMON_WIKIDATA_ENTITIES.CRM,
        COMMON_WIKIDATA_ENTITIES.SOFTWARE_AS_A_SERVICE,
        COMMON_WIKIDATA_ENTITIES.SALES,
        COMMON_WIKIDATA_ENTITIES.CUSTOMER_RELATIONSHIP_MANAGEMENT,
      ],
      about: [
        'https://www.wikidata.org/wiki/Q193234', // Return on Investment
        COMMON_WIKIDATA_ENTITIES.CRM,
        'https://www.wikidata.org/wiki/Q192536', // Cost–benefit analysis
      ],
      citations: [
        'https://www.gartner.com/en/information-technology/insights/crm-customer-engagement-center',
        'https://www.salesforce.com/resources/research-reports/state-of-sales/',
        'https://hbr.org/2024/03/the-short-life-of-online-sales-leads',
      ],
      author: {
        name: post.author || 'ROI Labs',
        sameAs: [
          'https://www.linkedin.com/company/roi-labs',
          'https://twitter.com/roilabs',
          'https://github.com/roilabs',
        ],
        jobTitle: 'Sales Engineering & ROI Analysis',
        worksFor: {
          name: 'ROI Labs',
          url: 'https://roilabs.com.br',
        },
      },
    }
  } else if (slug === 'prospeccao-de-clientes-b2b') {
    geoConfig = {
      mentions: [
        COMMON_WIKIDATA_ENTITIES.SALES,
        COMMON_WIKIDATA_ENTITIES.LEAD_GENERATION,
        COMMON_WIKIDATA_ENTITIES.PROSPECTING,
        COMMON_WIKIDATA_ENTITIES.CRM,
        COMMON_WIKIDATA_ENTITIES.BRAZIL,
        COMMON_WIKIDATA_ENTITIES.EMAIL_MARKETING,
      ],
      about: [
        COMMON_WIKIDATA_ENTITIES.LEAD_GENERATION,
        COMMON_WIKIDATA_ENTITIES.SALES,
      ],
      citations: [
        'https://www.salesforce.com/resources/research-reports/state-of-sales/',
        'https://hbr.org/2024/03/the-short-life-of-online-sales-leads',
      ],
      author: {
        name: post.author || 'ROI Labs',
        sameAs: ['https://www.linkedin.com/company/roi-labs', 'https://twitter.com/roilabs'],
        worksFor: { name: 'ROI Labs', url: 'https://roilabs.com.br' },
      },
    }
  } else if (slug === 'tecnicas-de-fechamento-de-vendas') {
    geoConfig = {
      mentions: [
        COMMON_WIKIDATA_ENTITIES.SALES,
        COMMON_WIKIDATA_ENTITIES.CONSULTATIVE_SELLING,
        COMMON_WIKIDATA_ENTITIES.SPIN_SELLING,
        COMMON_WIKIDATA_ENTITIES.CRM,
        COMMON_WIKIDATA_ENTITIES.BRAZIL,
      ],
      about: [
        COMMON_WIKIDATA_ENTITIES.SALES,
        COMMON_WIKIDATA_ENTITIES.CONSULTATIVE_SELLING,
      ],
      citations: [
        'https://www.salesforce.com/resources/research-reports/state-of-sales/',
      ],
      author: {
        name: post.author || 'ROI Labs',
        sameAs: ['https://www.linkedin.com/company/roi-labs', 'https://twitter.com/roilabs'],
        worksFor: { name: 'ROI Labs', url: 'https://roilabs.com.br' },
      },
    }
  } else if (slug === 'como-superar-objecoes-em-vendas') {
    geoConfig = {
      mentions: [
        COMMON_WIKIDATA_ENTITIES.SALES,
        COMMON_WIKIDATA_ENTITIES.CONSULTATIVE_SELLING,
        COMMON_WIKIDATA_ENTITIES.CRM,
        COMMON_WIKIDATA_ENTITIES.BRAZIL,
        COMMON_WIKIDATA_ENTITIES.PIPELINE_SALES,
      ],
      about: [
        COMMON_WIKIDATA_ENTITIES.SALES,
      ],
      citations: [
        'https://www.salesforce.com/resources/research-reports/state-of-sales/',
      ],
      author: {
        name: post.author || 'ROI Labs',
        sameAs: ['https://www.linkedin.com/company/roi-labs', 'https://twitter.com/roilabs'],
        worksFor: { name: 'ROI Labs', url: 'https://roilabs.com.br' },
      },
    }
  } else if (slug === 'kpis-de-vendas') {
    geoConfig = {
      mentions: [
        COMMON_WIKIDATA_ENTITIES.KEY_PERFORMANCE_INDICATOR,
        COMMON_WIKIDATA_ENTITIES.SALES,
        COMMON_WIKIDATA_ENTITIES.CRM,
        COMMON_WIKIDATA_ENTITIES.BRAZIL,
        COMMON_WIKIDATA_ENTITIES.CONVERSION_RATE,
        COMMON_WIKIDATA_ENTITIES.CUSTOMER_ACQUISITION_COST,
        COMMON_WIKIDATA_ENTITIES.LIFETIME_VALUE,
        COMMON_WIKIDATA_ENTITIES.PIPELINE_SALES,
      ],
      about: [
        COMMON_WIKIDATA_ENTITIES.KEY_PERFORMANCE_INDICATOR,
        COMMON_WIKIDATA_ENTITIES.SALES,
      ],
      citations: [
        'https://www.salesforce.com/resources/research-reports/state-of-sales/',
        'https://www.gartner.com/en/information-technology/insights/crm-customer-engagement-center',
      ],
      author: {
        name: post.author || 'ROI Labs',
        sameAs: ['https://www.linkedin.com/company/roi-labs', 'https://twitter.com/roilabs'],
        worksFor: { name: 'ROI Labs', url: 'https://roilabs.com.br' },
      },
    }
  } else if (slug === 'erros-crm-comuns') {
    geoConfig = {
      mentions: [
        COMMON_WIKIDATA_ENTITIES.CRM,
        COMMON_WIKIDATA_ENTITIES.CUSTOMER_RELATIONSHIP_MANAGEMENT,
        COMMON_WIKIDATA_ENTITIES.SOFTWARE_AS_A_SERVICE,
        COMMON_WIKIDATA_ENTITIES.SALES,
        COMMON_WIKIDATA_ENTITIES.BRAZIL,
        COMMON_WIKIDATA_ENTITIES.AUTOMATION,
      ],
      about: [
        COMMON_WIKIDATA_ENTITIES.CRM,
        COMMON_WIKIDATA_ENTITIES.CUSTOMER_RELATIONSHIP_MANAGEMENT,
      ],
      citations: [
        'https://www.gartner.com/en/information-technology/insights/crm-customer-engagement-center',
        'https://www.salesforce.com/resources/research-reports/state-of-sales/',
      ],
      author: {
        name: post.author || 'ROI Labs',
        sameAs: ['https://www.linkedin.com/company/roi-labs', 'https://twitter.com/roilabs'],
        worksFor: { name: 'ROI Labs', url: 'https://roilabs.com.br' },
      },
    }
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
    'spin-selling-guia-completo': spinSellingFAQs,
    'crm-ia-inteligencia-artificial-2026': crmIaFAQs,
    'crm-automacao-vendas-guia-completo': automacaoVendasFAQs,
    'melhor-crm-2026-comparativo': melhorCrm2026FAQs,
    'prospeccao-de-clientes-b2b': prospeccaoB2bFAQs,
    'tecnicas-de-fechamento-de-vendas': fechamentoVendasFAQs,
    'como-superar-objecoes-em-vendas': objecoesVendasFAQs,
    'kpis-de-vendas': kpisVendasFAQs,
    'erros-crm-comuns': errosCrmFAQs,
    'planilha-controle-comissao-corretor': planilhaComissaoFAQs,
    'como-escolher-crm-b2b-2026': comoEscolherCrmFAQs,
    'crm-gratuito-brasil-2026': crmGratuitoFAQs,
    'como-migrar-planilha-para-crm': migrarPlanilhaFAQs,
    'crm-para-varejo-2026': crmVarejoFAQs,
    'whatsapp-vendas-b2b-estrategias': whatsappVendasFAQs,
    'como-montar-processo-de-vendas': processoVendasFAQs,
    'crm-para-agencia-de-marketing': crmAgenciaFAQs,
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

      {/* ItemList Schema for comparison articles (enables list rich snippets) */}
      {slug === 'melhor-crm-2026-comparativo' && (
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "Melhores CRMs do Brasil em 2026",
          "description": "Comparativo dos 7 CRMs mais usados no Brasil em 2026, avaliados em UX, mobile, WhatsApp, automação, analytics, personalização e preço.",
          "numberOfItems": 7,
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Estetia CRM", "url": "https://estetiacrm.com.br" },
            { "@type": "ListItem", "position": 2, "name": "Pipedrive", "url": "https://www.pipedrive.com/pt" },
            { "@type": "ListItem", "position": 3, "name": "HubSpot CRM", "url": "https://www.hubspot.com/products/crm" },
            { "@type": "ListItem", "position": 4, "name": "RD Station CRM", "url": "https://www.rdstation.com/crm/" },
            { "@type": "ListItem", "position": 5, "name": "Ploomes", "url": "https://www.ploomes.com" },
            { "@type": "ListItem", "position": 6, "name": "Agendor", "url": "https://www.agendor.com.br" },
            { "@type": "ListItem", "position": 7, "name": "Bitrix24", "url": "https://www.bitrix24.com.br" },
          ],
        }} />
      )}

      {slug === 'crm-gratuito-brasil-2026' && (
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "CRMs Gratuitos no Brasil em 2026",
          "description": "Comparativo de 5 CRMs com plano gratuito funcional no Brasil em 2026, avaliados em contatos, usuários, WhatsApp, IA e preço de upgrade.",
          "numberOfItems": 5,
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Estetia CRM", "url": "https://estetiacrm.com.br" },
            { "@type": "ListItem", "position": 2, "name": "HubSpot Free", "url": "https://www.hubspot.com/products/crm" },
            { "@type": "ListItem", "position": 3, "name": "Agendor", "url": "https://www.agendor.com.br" },
            { "@type": "ListItem", "position": 4, "name": "Bitrix24", "url": "https://www.bitrix24.com.br" },
            { "@type": "ListItem", "position": 5, "name": "RD Station CRM", "url": "https://www.rdstation.com/crm/" },
          ],
        }} />
      )}

      {/* ── Hero full-bleed editorial ── */}
      <div className="relative w-full overflow-hidden bg-[#0A1F3D]" style={{ height: '60vh', minHeight: '400px', maxHeight: '600px' }}>
        {/* Gradient hero */}
        <div className="absolute inset-0 z-0"
          style={{ background: `linear-gradient(135deg, ${catColor}30 0%, #0A1F3D 60%, #0A1F3D 100%)` }} />
        {/* Decorative watermark */}
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <span className="font-serif text-[24rem] font-bold leading-none select-none pointer-events-none"
            style={{ color: catColor, opacity: 0.05 }}>
            {post.category.charAt(0)}
          </span>
        </div>
        {/* Dark overlay for content legibility */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0A1F3D] via-[#0A1F3D]/50 to-transparent" />

        {/* Hero content */}
        <div className="absolute inset-0 flex flex-col justify-end z-10">
          <div className="container mx-auto px-6 pb-16 max-w-4xl text-center md:text-left">
            {/* Breadcrumb */}
            <nav className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs mb-6 font-medium text-[#94A3B8]" aria-label="Breadcrumb">
              <Link href={`/${locale}`} className="hover:text-[#FFFFFF] transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              <Link href={`/${locale}/blog`} className="hover:text-[#FFFFFF] transition-colors">Blog</Link>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              <span className="text-[#C5A059]">{post.category}</span>
            </nav>

            {/* Category badge */}
            <div className="mb-6">
              <span className="inline-flex px-4 py-1.5 rounded-full tracking-widest uppercase text-xs font-bold text-[#FFFFFF] backdrop-blur-md bg-[#FFFFFF]/10 border border-[#FFFFFF]/20">
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-tight text-[#FFFFFF] mb-8 max-w-4xl mx-auto md:mx-0">
              {displayTitle}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm font-medium text-[#94A3B8]">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#C5A059]" />
                {post.author || 'Equipe Estetia'}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#C5A059]" />
                {new Date(post.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C5A059]" />
                {readingMinutes} min de leitura
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Article body ── */}
      <div className="bg-[#F8F9FC]">
        <div className="container mx-auto px-6 py-12 max-w-7xl">

          {/* Back button */}
          <div className="mb-10">
            <Link href={`/${locale}/blog`}
              className="inline-flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-[#64748B] hover:text-[#0A1F3D] transition-colors">
              <ChevronLeft className="w-4 h-4" />
              Voltar para o Blog
            </Link>
          </div>

          {/* Share + 2-col layout */}
          <div className="grid lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_320px] gap-12 xl:gap-20">

            {/* Main content */}
            <div>
              {/* Share bar */}
              <div className="mb-8 pb-8 border-b border-[#0A1F3D]/10">
                <ShareButtons title={post.title} url={url} />
              </div>

              {/* Excerpt callout */}
              <p className="text-xl md:text-2xl font-serif italic leading-relaxed mb-12 text-[#0A1F3D] border-l-4 pl-6"
                style={{ borderColor: catColor }}>
                {isEnLocale && post.excerptEn ? post.excerptEn : post.excerpt}
              </p>

              {/* Article HTML content */}
              <div className="bg-[#FFFFFF] rounded-3xl shadow-xl overflow-hidden border border-[#0A1F3D]/5">
                <div className="p-8 sm:p-10 md:p-14">
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
            <div className="mt-24 pt-16 border-t border-[#0A1F3D]/10">
              <div className="flex items-center gap-6 mb-12">
                <h2 className="font-serif text-3xl font-bold text-[#0A1F3D]">
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
                      <div className="h-full flex flex-col bg-[#FFFFFF] rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-[#0A1F3D]/5">
                        <div className="relative h-48 w-full overflow-hidden flex items-center justify-center bg-[#0A1F3D]">
                          <div className="absolute inset-0 bg-gradient-to-br opacity-40" style={{ from: relCatColor, to: 'transparent' }} />
                          <span className="font-serif text-[6rem] font-bold select-none text-[#FFFFFF] opacity-10">
                            {relatedPost.category.charAt(0)}
                          </span>
                          <span className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full tracking-widest uppercase text-[10px] font-bold text-[#FFFFFF] backdrop-blur-md bg-[#FFFFFF]/10 border border-[#FFFFFF]/20">
                            {relatedPost.category}
                          </span>
                        </div>
                        <div className="p-8 flex flex-col flex-1">
                          <h3 className="font-serif text-2xl font-bold leading-snug mb-4 flex-1 text-[#0A1F3D] group-hover:text-[#489FB5] transition-colors">
                            {relatedPost.title}
                          </h3>
                          <span className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase group-hover:gap-3 transition-all"
                            style={{ color: relCatColor }}>
                            Ler artigo <ArrowRight className="w-4 h-4" />
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
        <div className="bg-[#0A1F3D] relative overflow-hidden mt-20">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#C5A059]/10 blur-[100px]" />
          <div className="container mx-auto px-6 py-28 text-center max-w-3xl relative z-10">
            <p className="tracking-widest uppercase text-xs font-bold mb-4 text-[#C5A059]">
              Estetia CRM
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#FFFFFF] mb-6 leading-tight">
              Pronto para implementar isso na sua clínica?
            </h2>
            <p className="text-lg mb-10 text-[#94A3B8]">
              14 dias grátis. Sem cartão de crédito. Comece a automatizar suas vendas hoje.
            </p>
            <Link href={`/${locale}/register`}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-sm bg-[#C5A059] text-[#0A1F3D] hover:bg-opacity-90 hover:scale-105 transition-all duration-300 shadow-[0_8px_30px_rgba(197,160,89,0.3)]">
              Começar agora
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
