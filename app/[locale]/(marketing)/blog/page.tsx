import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { blogPosts } from '@/lib/blog/index'
import { Rss, ArrowRight } from 'lucide-react'
import { BlogClientContent } from './blog-client'

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('marketing.blog')
  const allCategoryLabel = t('categories.all')

  const sortedPosts = [...blogPosts]
    .filter(post => !post.archived)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="min-h-screen bg-[#F8F9FC]">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#0A1F3D]">
        {/* Gold glow — top right */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#C5A059]/10 blur-3xl" />
        {/* Teal glow — bottom left */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#489FB5]/10 blur-3xl" />

        <div className="relative z-10 container mx-auto px-6 pt-36 pb-20 text-center max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/10 text-[#C5A059] tracking-widest uppercase text-xs font-bold mb-8">
            <Rss className="w-3.5 h-3.5" />
            {t('hero.badge')}
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-[#FFFFFF] leading-tight mb-6">
            {t('hero.title')}
          </h1>

          <p className="font-serif italic text-lg leading-relaxed text-[#94A3B8] max-w-lg mx-auto">
            {t('hero.subtitle')}
          </p>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-10 mt-16 border-t border-[#FFFFFF]/10 pt-8">
            {[
              { value: '5', label: 'artigos' },
              { value: '5', label: 'categorias' },
              { value: '2×', label: 'por mês' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="font-serif text-3xl font-bold text-[#C5A059]">{value}</div>
                <div className="tracking-widest uppercase text-xs font-bold text-[#94A3B8] mt-2">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Transition to content */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#F8F9FC] to-transparent pointer-events-none" />
      </section>

      {/* ── Interactive island (filters + posts) ── */}
      <div className="-mt-8 relative z-20 pb-20">
        <BlogClientContent
          sortedPosts={sortedPosts}
          allCategoryLabel={allCategoryLabel}
          locale={locale}
        />
      </div>

      {/* ── CTA Final ── */}
      <section className="relative overflow-hidden bg-[#0A1F3D]">
        {/* Gold glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#C5A059]/10 blur-[100px]" />

        <div className="relative z-10 container mx-auto px-6 py-28 text-center max-w-2xl">
          <p className="tracking-widest uppercase text-xs font-bold text-[#C5A059] mb-4">
            Estetia CRM
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#FFFFFF] mb-6 leading-tight">
            Implemente o que aprendeu aqui na sua clínica
          </h2>
          <p className="mb-12 text-base md:text-lg leading-relaxed text-[#94A3B8] max-w-lg mx-auto">
            Anamnese digital, recall automatizado, KPIs em tempo real — tudo em um só lugar.
          </p>
          <Link href={`/${locale}/register`}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-sm bg-[#C5A059] text-[#0A1F3D] hover:bg-opacity-90 hover:scale-105 transition-all duration-300 shadow-[0_8px_30px_rgba(197,160,89,0.3)]">
            Experimentar grátis por 14 dias
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="mt-6 text-xs text-[#64748B] font-medium">
            Sem cartão de crédito · Cancele quando quiser
          </p>
        </div>
      </section>

    </div>
  )
}
