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
    const STATIC_ROUTES: { pt: string; priority?: number }[] = [
        { pt: '' },
        { pt: '/features', priority: 0.9 },
        { pt: '/solucoes', priority: 0.9 },
        { pt: '/precos', priority: 0.9 },
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
        { pt: '/proposta' },
        { pt: '/vendas-automaticas', priority: 0.9 },
        { pt: '/ferramentas', priority: 0.9 },
        { pt: '/anuario' },
    ]

    const routes = STATIC_ROUTES.map(({ pt, priority }) => ({
        url: `${baseUrl}${pt}`,
        lastModified: lastSiteUpdate,
        changeFrequency: 'monthly' as const,
        priority: priority ?? (pt === '' ? 1 : 0.8),
    }))

    const posts = blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.lastModified || post.date),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    const helpArticlePages = helpArticles.map((article) => ({
        url: `${baseUrl}/help/${article.categorySlug}/${article.slug}`,
        lastModified: new Date(article.lastUpdated),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }))

    const calculatorPages = [
        '/ferramentas/calculadora-roi',
        '/ferramentas/calculadora-no-show',
        '/ferramentas/calculadora-ltv',
        '/ferramentas/calculadora-precificacao',
        '/ferramentas/avaliacao-maturidade-digital',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(CALCULATOR_LAST_MODIFIED),
        changeFrequency: 'monthly' as const,
        priority: 0.9,
    }))

    const blogCategoryPages = getAllCategories().map((category) => {
        const slug = slugifyCategory(category)
        return {
            url: `${baseUrl}/blog/categoria/${slug}`,
            lastModified: lastSiteUpdate,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }
    })

    const SOLUCAO_SLUGS = ['estetica', 'dermatologia', 'estetica-corporal', 'multi-unidade']
    const solucaoPages = SOLUCAO_SLUGS.map((slug) => ({
        url: `${baseUrl}/solucoes/${slug}`,
        lastModified: lastSiteUpdate,
        changeFrequency: 'monthly' as const,
        priority: 0.85,
    }))

    const vsSlugs = ['morelo', 'medidata', 'clinicare']
    const vsPages = vsSlugs.map((slug) => ({
        url: `${baseUrl}/vs/${slug}`,
        lastModified: lastSiteUpdate,
        changeFrequency: 'monthly' as const,
        priority: 0.85,
    }))

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
