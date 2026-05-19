import { MetadataRoute } from 'next'
import { blogPosts, getAllCategories, slugifyCategory } from '@/lib/blog-data'
import { helpArticles } from '@/lib/help-articles'
import { CALCULATOR_LAST_MODIFIED } from '@/config/calculator-metadata'

export default function sitemap(): MetadataRoute.Sitemap {
    const rawUrl = process.env.NEXT_PUBLIC_APP_URL || ''
    // Never use localhost in the sitemap — always fall back to the real domain
    const baseUrl = rawUrl.startsWith('http') && !rawUrl.includes('localhost')
        ? rawUrl
        : 'https://estetiacrm.com.br'

    // Data da última atualização significativa do site
    // Atualizar manualmente quando houver mudanças reais nas páginas estáticas
    const lastSiteUpdate = new Date('2026-05-19')

    // Static routes
    // Priorização Hierárquica (Seção 7.2):
    // - Homepage (1.0): Ponto central da marca
    // - Ferramentas/Conversão (0.9): Ativos de engajamento e conversão
    // - Demais páginas (0.8): Conteúdo de suporte
    // Helper to build alternates for a PT-BR path and its EN equivalent
    const withAlternates = (ptPath: string, enPath?: string) => {
        const enRoute = enPath ?? ptPath // same path if no EN equivalent
        return {
            alternates: {
                languages: {
                    'pt-BR': `${baseUrl}${ptPath}`,
                    'en': `${baseUrl}/en${enRoute}`,
                    'x-default': `${baseUrl}${ptPath}`,
                },
            },
        }
    }

    const STATIC_ROUTES: { pt: string; en?: string; priority?: number }[] = [
        { pt: '' },
        { pt: '/features', priority: 0.9 },
        { pt: '/solucoes', en: '/solutions', priority: 0.9 },
        { pt: '/pricing', priority: 0.9 },
        { pt: '/blog' },
        { pt: '/about' },
        { pt: '/help' },
        { pt: '/privacy' },
        { pt: '/terms' },
        { pt: '/changelog' },
        { pt: '/community' },
        { pt: '/contact' },
        { pt: '/download' },
        { pt: '/followup' },
        { pt: '/proposta', en: '/proposal' },
        { pt: '/vendas-automaticas', en: '/automatic-sales', priority: 0.9 },
        { pt: '/fundadores', en: '/founders', priority: 0.9 },
        { pt: '/ferramentas', en: '/tools', priority: 0.9 },
        { pt: '/anuario', en: '/yearbook' },
    ]

    const routes = STATIC_ROUTES.map(({ pt, en, priority }) => ({
        url: `${baseUrl}${pt}`,
        lastModified: lastSiteUpdate,
        changeFrequency: 'monthly' as const,
        priority: priority ?? (pt === '' ? 1 : 0.8),
        ...withAlternates(pt, en),
    }))

    // Dynamic blog posts
    // Priority 0.8: Conteúdo de suporte e autoridade (Seção 7.2)
    // lastModified: Usa data de modificação quando disponível, senão usa data de publicação
    // Isso sinaliza para crawlers que o conteúdo está "vivo" e deve ser reprocessado
    const posts = blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.lastModified || post.date),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
        ...withAlternates(`/blog/${post.slug}`),
    }))

    // Help articles — com alternates EN (/en/help/[category]/[slug])
    const helpArticlePages = helpArticles.map((article) => ({
        url: `${baseUrl}/help/${article.categorySlug}/${article.slug}`,
        lastModified: new Date(article.lastUpdated),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
        ...withAlternates(
            `/help/${article.categorySlug}/${article.slug}`,
            `/help/${article.categorySlug}/${article.slug}`
        ),
    }))

    // Calculadoras — mapeamento PT→EN conforme i18n/routing.ts
    const calculatorMap: Record<string, string> = {
        '/ferramentas/calculadora-roi': '/tools/roi-calculator',
        '/ferramentas/calculadora-no-show': '/tools/no-show-calculator',
        '/ferramentas/calculadora-ltv': '/tools/ltv-calculator',
        '/ferramentas/calculadora-precificacao': '/tools/pricing-calculator',
        '/ferramentas/avaliacao-maturidade-digital': '/tools/digital-maturity-assessment',
    }
    const calculatorPages = Object.entries(calculatorMap).map(([ptRoute, enRoute]) => ({
        url: `${baseUrl}${ptRoute}`,
        lastModified: new Date(CALCULATOR_LAST_MODIFIED),
        changeFrequency: 'monthly' as const,
        priority: 0.9,
        ...withAlternates(ptRoute, enRoute),
    }))

    // Blog category pages — com alternates EN (/en/blog/category/[slug])
    const blogCategoryPages = getAllCategories().map((category) => {
        const slug = slugifyCategory(category)
        return {
            url: `${baseUrl}/blog/categoria/${slug}`,
            lastModified: lastSiteUpdate,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
            ...withAlternates(`/blog/categoria/${slug}`, `/blog/category/${slug}`),
        }
    })

    // Solucoes persona landing pages
    const SOLUCAO_SLUGS = ['estetica', 'dermatologia', 'estetica-corporal', 'multi-unidade']
    const solucaoPages = SOLUCAO_SLUGS.map((slug) => ({
        url: `${baseUrl}/solucoes/${slug}`,
        lastModified: lastSiteUpdate,
        changeFrequency: 'monthly' as const,
        priority: 0.85,
        ...withAlternates(`/solucoes/${slug}`, `/solutions/${slug}`),
    }))

    // Competitor comparison pages (/vs/[competitor])
    const vsSlugs = ['morelo', 'medidata', 'clinicare']
    const vsPages = vsSlugs.map((slug) => ({
        url: `${baseUrl}/vs/${slug}`,
        lastModified: lastSiteUpdate,
        changeFrequency: 'monthly' as const,
        priority: 0.85,
        ...withAlternates(`/vs/${slug}`),
    }))

    // Feature landing pages
    const featureSlugs = [
        'agenda-inteligente', 'anamnese-digital', 'prontuario-eletronico', 'evolucao-fotos',
        'whatsapp-business', 'recall-automatico', 'estetia-ia', 'marketing-clinico',
        'financeiro-tiss', 'analytics-pro', 'multi-unidade', 'lgpd-seguranca', 'mobile-app',
    ]
    const featurePages = featureSlugs.map((slug) => ({
        url: `${baseUrl}/features/${slug}`,
        lastModified: lastSiteUpdate,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
        ...withAlternates(`/features/${slug}`),
    }))

    return [
        ...routes,
        ...posts,
        ...blogCategoryPages,
        ...helpArticlePages,
        ...calculatorPages,
        ...solucaoPages,
        ...featurePages,
        ...vsPages,
    ]
}
