import { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { notFound } from 'next/navigation'
import {
  blogPosts,
  getAllCategories,
  getPostsByCategory,
  slugifyCategory,
  getCategoryFromSlug,
  getCategoryColor,
} from '@/lib/blog/index'
import { ArrowLeft, ArrowRight, Clock, BookOpen } from 'lucide-react'

export function generateStaticParams() {
  const categories = getAllCategories()
  return categories.map((category) => ({
    category: slugifyCategory(category),
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>
}): Promise<Metadata> {
  const { category: categorySlug } = await params
  const categoryName = getCategoryFromSlug(categorySlug)

  if (!categoryName) return { title: 'Categoria não encontrada' }

  const posts = getPostsByCategory(categoryName)
  const title = `${categoryName} | Blog Estetia CRM`
  const description = `Artigos sobre ${categoryName.toLowerCase()} para clínicas de estética: ${posts
    .slice(0, 3)
    .map((p) => p.title)
    .join(', ')}.`

  const canonicalUrl = `https://estetiacrm.com.br/blog/categoria/${categorySlug}`

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { title, description, url: canonicalUrl },
  }
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>
}) {
  const { locale, category: categorySlug } = await params
  const categoryName = getCategoryFromSlug(categorySlug)

  if (!categoryName) notFound()

  const posts = getPostsByCategory(categoryName!)
  const allCategories = getAllCategories()
  const catColor = getCategoryColor(categoryName!)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://estetiacrm.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://estetiacrm.com.br/blog' },
      { '@type': 'ListItem', position: 3, name: categoryName, item: `https://estetiacrm.com.br/blog/categoria/${categorySlug}` },
    ],
  }

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `https://estetiacrm.com.br/blog/categoria/${categorySlug}`,
    name: `${categoryName} — Blog Estetia CRM`,
    description: `Artigos sobre ${categoryName!.toLowerCase()} para clínicas de estética.`,
    url: `https://estetiacrm.com.br/blog/categoria/${categorySlug}`,
    hasPart: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      url: `https://estetiacrm.com.br/blog/${post.slug}`,
      datePublished: post.date,
      dateModified: post.lastModified || post.date,
      author: { '@type': 'Person', name: post.author || 'Equipe Estetia' },
    })),
  }

  return (
    <>
      <Script id="breadcrumb-category-schema" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="collection-category-schema" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <div className="min-h-screen" style={{ backgroundColor: '#FAFBFC' }}>

        {/* Hero — navy com cor da categoria */}
        <section style={{ backgroundColor: '#0A1F3D' }} className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: `radial-gradient(circle at 20% 50%, ${catColor} 0%, transparent 50%)` }} />
          <div className="container mx-auto px-4 pt-28 pb-16 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Link href={`/${locale}/blog`}
                className="inline-flex items-center gap-1.5 text-sm mb-6 transition-opacity hover:opacity-100 opacity-60"
                style={{ color: '#C5A059' }}>
                <ArrowLeft className="w-3.5 h-3.5" />
                Voltar ao blog
              </Link>

              <div className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
                style={{ backgroundColor: `${catColor}20`, color: catColor, border: `1px solid ${catColor}40` }}>
                {categoryName}
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-3">
                {categoryName}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.55)' }}>
                {posts.length} {posts.length === 1 ? 'artigo' : 'artigos'} publicados
              </p>
            </div>
          </div>

          {/* Wave */}
          <div className="relative h-10 overflow-hidden">
            <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg"
              className="absolute bottom-0 w-full" preserveAspectRatio="none">
              <path d="M0 40L1440 40L1440 0C1200 28 960 40 720 40C480 40 240 28 0 0L0 40Z" fill="#FAFBFC" />
            </svg>
          </div>
        </section>

        {/* Category navigation */}
        <section className="sticky top-0 z-40 bg-white border-b"
          style={{ borderColor: 'rgba(10,31,61,0.08)' }}>
          <div className="container mx-auto px-4 py-3">
            <nav className="flex gap-2 overflow-x-auto scrollbar-hide" aria-label="Categorias do blog">
              <Link href={`/${locale}/blog`}>
                <span className="inline-flex whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                  style={{ color: '#64748B', border: '1.5px solid #E2E8F0' }}>
                  Todos
                </span>
              </Link>
              {allCategories.map((cat) => {
                const cc = getCategoryColor(cat)
                const isActive = cat === categoryName
                return (
                  <Link key={cat} href={`/${locale}/blog/categoria/${slugifyCategory(cat)}`}>
                    <span className="inline-flex whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                      style={isActive
                        ? { backgroundColor: cc, color: '#fff', border: `1.5px solid ${cc}` }
                        : { color: '#64748B', border: '1.5px solid #E2E8F0' }
                      }>
                      {cat}
                    </span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="container mx-auto px-4 py-14">
          {posts.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: `${catColor}12` }}>
                <BookOpen className="w-8 h-8" style={{ color: catColor }} />
              </div>
              <h2 className="font-serif text-2xl font-bold mb-3" style={{ color: '#0A1F3D' }}>
                Em breve
              </h2>
              <p className="mb-6" style={{ color: '#64748B' }}>
                Nenhum artigo publicado em {categoryName} ainda.
              </p>
              <Link href={`/${locale}/blog`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
                style={{ backgroundColor: '#0A1F3D', color: '#fff' }}>
                <ArrowLeft className="w-4 h-4" />
                Ver todos os artigos
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link key={post.slug} href={`/${locale}/blog/${post.slug}`} className="block h-full group">
                  <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    style={{ borderTop: `3px solid ${catColor}`, border: '1px solid rgba(10,31,61,0.07)' }}>

                    <div className="relative h-40 w-full overflow-hidden flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${catColor}12 0%, ${catColor}25 100%)` }}>
                      <span className="font-serif text-5xl font-bold select-none"
                        style={{ color: catColor, opacity: 0.15 }}>
                        {post.category.charAt(0)}
                      </span>
                      <span className="absolute bottom-3 left-4 text-xs font-bold tracking-widest uppercase"
                        style={{ color: catColor }}>
                        {post.category}
                      </span>
                    </div>

                    <div className="flex flex-col flex-1 p-6">
                      <span className="text-xs font-semibold tracking-wider uppercase mb-2"
                        style={{ color: catColor }}>
                        {post.category}
                      </span>

                      <h2 className="font-serif text-lg font-bold leading-snug mb-3 group-hover:opacity-75 transition-opacity flex-1"
                        style={{ color: '#0A1F3D' }}>
                        {post.title}
                      </h2>

                      <p className="text-sm leading-relaxed line-clamp-3 mb-5" style={{ color: '#64748B' }}>
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between mt-auto pt-4"
                        style={{ borderTop: '1px solid rgba(10,31,61,0.07)' }}>
                        <div className="flex items-center gap-1.5 text-xs" style={{ color: '#94A3B8' }}>
                          <Clock className="w-3.5 h-3.5" />
                          <span>{post.date}</span>
                        </div>
                        <span className="flex items-center gap-1 text-xs font-semibold transition-all group-hover:gap-2 duration-200"
                          style={{ color: catColor }}>
                          Ler
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  )
}
