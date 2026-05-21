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
      <section className="relative overflow-hidden bg-[#0A1F3D] py-12 md:py-20 border-b border-[#FFFFFF]/5">
        {/* Fine-line Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none z-0" />
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-7xl border-x border-[#FFFFFF]/5 pointer-events-none z-0" />

        {/* Ambient Atmos Glows */}
        <div className="absolute -top-48 -right-48 w-[600px] h-[600px] rounded-full bg-[#C5A059]/10 blur-[130px] pointer-events-none" />
        <div className="absolute -bottom-36 -left-36 w-[500px] h-[500px] rounded-full bg-[#489FB5]/10 blur-[120px] pointer-events-none" />

        <div className="relative z-10 container mx-auto px-6 pt-24 pb-12 text-center max-w-4xl">
          {/* VIP Glass Badge */}
          <div className="inline-flex items-center gap-2.5 px-4.5 py-2 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/5 text-[#C5A059] tracking-[0.2em] uppercase text-[10px] font-bold mb-8 backdrop-blur-md shadow-[0_4px_20px_rgba(197,160,89,0.1)]">
            <Rss className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{t('hero.badge')}</span>
          </div>

          {/* Monumental Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-[4rem] font-bold text-[#FFFFFF] leading-[1.1] mb-6 tracking-tight">
            {t('hero.title')}
          </h1>

          <p className="font-serif italic text-lg md:text-xl leading-relaxed text-[#94A3B8] max-w-2xl mx-auto mb-14">
            {t('hero.subtitle')}
          </p>

          {/* Stats Suspended Glass Panel */}
          <div className="max-w-2xl mx-auto rounded-[2rem] border border-[#FFFFFF]/15 bg-[#FFFFFF]/5 backdrop-blur-xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            <div className="grid grid-cols-3 gap-6 relative">
              {/* Dividers */}
              <div className="absolute inset-y-0 left-1/3 w-px bg-gradient-to-b from-transparent via-[#FFFFFF]/10 to-transparent" />
              <div className="absolute inset-y-0 left-2/3 w-px bg-gradient-to-b from-transparent via-[#FFFFFF]/10 to-transparent" />

              {[
                { value: '5', label: 'artigos' },
                { value: '5', label: 'categorias' },
                { value: '2×', label: 'por mês' },
              ].map(({ value, label }) => (
                <div key={label} className="text-center group">
                  <div className="font-serif text-3xl sm:text-4xl font-bold text-[#C5A059] transition-transform duration-300 group-hover:scale-110">{value}</div>
                  <div className="tracking-[0.15em] uppercase text-[10px] sm:text-xs font-bold text-[#94A3B8] mt-2">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Transition Gradient */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#F8F9FC] to-transparent pointer-events-none" />
      </section>

      {/* ── Interactive island (filters + posts) ── */}
      <div className="-mt-12 relative z-20 pb-20">
        <BlogClientContent
          sortedPosts={sortedPosts}
          allCategoryLabel={allCategoryLabel}
          locale={locale}
        />
      </div>

      {/* ── CTA Final ── */}
      <section className="relative overflow-hidden bg-[#0A1F3D] border-t border-[#FFFFFF]/5">
        {/* Fine-line Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none z-0" />

        {/* Ambient Atmos Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-[#C5A059]/10 blur-[130px] pointer-events-none" />

        <div className="relative z-10 container mx-auto px-6 py-28 text-center max-w-3xl">
          {/* Small Gold Badge */}
          <p className="tracking-[0.2em] uppercase text-[10px] font-bold text-[#C5A059] mb-4">
            Estetia CRM
          </p>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#FFFFFF] mb-6 leading-tight max-w-2xl mx-auto">
            Implemente o que aprendeu aqui na sua clínica
          </h2>

          <p className="mb-12 text-base md:text-lg leading-relaxed text-[#94A3B8] max-w-lg mx-auto">
            Anamnese digital, recall automatizado, KPIs em tempo real — tudo em um só lugar.
          </p>

          {/* Premium VIP Button */}
          <div className="relative inline-block group">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#C5A059] to-[#C5A059]/50 opacity-40 blur-md group-hover:opacity-75 transition duration-500" />
            <Link href={`/${locale}/register`}
              className="relative inline-flex items-center justify-center gap-3 px-8 py-4.5 rounded-full font-bold text-sm bg-[#C5A059] text-[#0A1F3D] hover:bg-opacity-95 hover:scale-[1.02] transition-all duration-300 shadow-[0_8px_30px_rgba(197,160,89,0.3)]">
              <span>Experimentar grátis por 14 dias</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <p className="mt-6 text-[10px] text-[#64748B] font-bold tracking-[0.1em] uppercase">
            Sem cartão de crédito · Cancele quando quiser
          </p>
        </div>
      </section>

    </div>
  )
}
