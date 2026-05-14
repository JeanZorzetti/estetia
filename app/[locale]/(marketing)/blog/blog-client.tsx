'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import type { BlogPost } from '@/lib/blog-types'
import { getAllCategories, slugifyCategory, getCategoryColor } from '@/lib/blog/index'
import { ArrowRight, Clock, BookOpen, Calendar, ChevronRight } from 'lucide-react'

function getReadingMinutes(content: string): number {
  const words = content.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length
  return Math.max(3, Math.ceil(words / 200))
}

function PostCover({ src, alt, color, category }: { src: string; alt: string; color: string; category: string }) {
  const isPlaceholder = !src || src.endsWith('/og-image.png') || src.endsWith('/logo.png')
  if (!isPlaceholder) {
    return <Image src={src} alt={alt} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" unoptimized />
  }
  return (
    <div className="w-full h-full flex flex-col justify-end p-8 transition-transform duration-700 group-hover:scale-105"
      style={{ backgroundColor: color }}>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <span className="relative z-10 font-serif text-sm font-bold tracking-widest uppercase text-[#FFFFFF]/80">
        {category}
      </span>
    </div>
  )
}

interface BlogClientContentProps {
  sortedPosts: BlogPost[]
  allCategoryLabel: string
  locale: string
}

export function BlogClientContent({ sortedPosts, allCategoryLabel, locale }: BlogClientContentProps) {
  const t = useTranslations('marketing.blog')
  const isEn = locale === 'en'
  const [selectedCategory, setSelectedCategory] = useState(allCategoryLabel)

  const uniqueCategories = Array.from(new Set(sortedPosts.map(p => p.category)))
  const categories = [allCategoryLabel, ...uniqueCategories]

  const filteredPosts = selectedCategory === allCategoryLabel
    ? sortedPosts
    : sortedPosts.filter(p => p.category === selectedCategory)

  const featuredPost = filteredPosts[0]
  // cap at 6 so the grid (3 cols) always fills evenly
  const recentPosts = filteredPosts.slice(1, 7)

  return (
    <>
      {/* ── Category Filter ── */}
      <div className="sticky top-0 z-40 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#0A1F3D]/10 shadow-sm py-4">
        <div className="container mx-auto px-6">

          {/* Pills row */}
          <div className="relative">
            <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
              {categories.map((category) => {
                const isAll = category === allCategoryLabel
                const color = isAll ? '#0A1F3D' : getCategoryColor(category)
                const isActive = selectedCategory === category
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className="flex items-center gap-2 whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex-shrink-0"
                    style={isActive
                      ? { backgroundColor: color, color: '#FFFFFF', boxShadow: `0 4px 12px ${color}40` }
                      : { color: '#64748B', backgroundColor: '#F8F9FC', border: '1px solid #0A1F3D15' }
                    }
                  >
                    {!isAll && (
                      <span className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: isActive ? '#FFFFFF' : color }} />
                    )}
                    {category}
                  </button>
                )
              })}
            </div>
            {/* Right fade hint */}
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#FFFFFF] to-transparent pointer-events-none md:hidden" />
          </div>

          {/* SEO nav hidden visually but good for crawlers */}
          <nav className="hidden" aria-label="Categorias">
            {getAllCategories().map(cat => (
              <Link key={cat} href={`/${locale}/blog/categoria/${slugifyCategory(cat)}`}>
                {cat}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl pt-12">

        {/* ── Featured Post ── */}
        {featuredPost && (
          <div className="pb-16">
            <div className="flex items-center gap-4 mb-8">
              <span className="tracking-widest uppercase text-xs font-bold text-[#C5A059]">
                {t('featured.label')}
              </span>
              <div className="flex-1 h-px bg-[#0A1F3D]/10" />
            </div>

            <Link href={`/${locale}/blog/${featuredPost.slug}`} className="block group">
              <div className="rounded-[2rem] overflow-hidden grid lg:grid-cols-[55fr_45fr] bg-[#FFFFFF] shadow-lg hover:shadow-2xl transition-all duration-500 border border-[#0A1F3D]/5"
                style={{
                  minHeight: '440px',
                }}>

                {/* Left: visual */}
                <div className="relative overflow-hidden min-h-[320px] lg:min-h-0 bg-[#0A1F3D]">
                  <PostCover
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    color={getCategoryColor(featuredPost.category)}
                    category={featuredPost.category}
                  />
                  {/* Category pill */}
                  <div className="absolute top-6 left-6 z-20">
                    <span className="inline-flex items-center px-4 py-2 rounded-full tracking-widest uppercase text-xs font-bold text-[#FFFFFF] backdrop-blur-md bg-[#0A1F3D]/30 border border-[#FFFFFF]/20">
                      {featuredPost.category}
                    </span>
                  </div>
                  {/* Hover overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#0A1F3D]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                </div>

                {/* Right: content */}
                <div className="flex flex-col justify-center p-10 lg:p-16">
                  <div className="space-y-6">
                    {/* Read time badge */}
                    <div className="flex items-center gap-3 text-xs font-bold tracking-wider text-[#94A3B8] uppercase">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {getReadingMinutes(featuredPost.content)} {t('post.readingTime')}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E05A4E]" />
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {featuredPost.date}
                      </span>
                    </div>

                    <h2 className="font-serif text-3xl lg:text-4xl font-bold leading-tight text-[#0A1F3D] group-hover:text-[#489FB5] transition-colors duration-300">
                      {isEn && featuredPost.titleEn ? featuredPost.titleEn : featuredPost.title}
                    </h2>

                    <p className="text-base lg:text-lg leading-relaxed text-[#64748B] line-clamp-3">
                      {isEn && featuredPost.excerptEn ? featuredPost.excerptEn : featuredPost.excerpt}
                    </p>
                  </div>

                  <div className="mt-10 flex items-center gap-2 text-sm font-bold text-[#489FB5] group-hover:gap-4 transition-all duration-300 uppercase tracking-wider">
                    {t('post.readMore')}
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* ── Empty state ── */}
        {filteredPosts.length === 0 && (
          <div className="py-32 text-center bg-[#FFFFFF] rounded-3xl border border-[#0A1F3D]/10 shadow-sm">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-[#F8F9FC] text-[#94A3B8]">
              <BookOpen className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold mb-3 text-[#0A1F3D]">Nenhum artigo encontrado</h2>
            <p className="text-[#64748B] mb-8 max-w-md mx-auto">
              Ainda não publicamos conteúdos na categoria <strong className="text-[#0A1F3D]">{selectedCategory}</strong>. Fique de olho, novidades em breve.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {getAllCategories().map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)}
                  className="px-5 py-2.5 rounded-full tracking-widest uppercase text-xs font-bold transition-all hover:scale-105 border border-[#0A1F3D]/10 text-[#64748B] hover:text-[#0A1F3D] bg-[#F8F9FC]">
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Recent Posts ── */}
        {recentPosts.length > 0 && (
          <div className="pb-24">
            <div className="flex items-center gap-4 mb-10">
              <span className="tracking-widest uppercase text-xs font-bold text-[#C5A059]">
                {t('recent.label')}
              </span>
              <div className="flex-1 h-px bg-[#0A1F3D]/10" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post) => {
                const catColor = getCategoryColor(post.category)
                const displayTitle = isEn && post.titleEn ? post.titleEn : post.title
                const displayExcerpt = isEn && post.excerptEn ? post.excerptEn : post.excerpt
                const readMin = getReadingMinutes(post.content)

                return (
                  <Link key={post.slug} href={`/${locale}/blog/${post.slug}`} className="block group">
                    <article className="h-full flex flex-col rounded-3xl overflow-hidden bg-[#FFFFFF] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border border-[#0A1F3D]/5">
                      
                      {/* Visual header */}
                      <div className="relative h-56 flex-shrink-0 overflow-hidden bg-[#0A1F3D]">
                        <PostCover
                          src={post.image}
                          alt={displayTitle}
                          color={catColor}
                          category={post.category}
                        />
                        <div className="absolute top-4 left-4 z-20">
                          <span className="inline-block px-3 py-1.5 rounded-full tracking-widest uppercase text-[10px] font-bold text-[#FFFFFF] backdrop-blur-md bg-[#0A1F3D]/40 border border-[#FFFFFF]/20">
                            {post.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex flex-col flex-1 p-8">
                        <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#94A3B8] uppercase mb-4">
                          <Clock className="w-3.5 h-3.5" />
                          {readMin} min
                        </div>

                        <h3 className="font-serif text-xl font-bold leading-snug mb-3 text-[#0A1F3D] group-hover:text-[#489FB5] transition-colors duration-300 line-clamp-2">
                          {displayTitle}
                        </h3>

                        <p className="text-sm leading-relaxed text-[#64748B] line-clamp-3 mb-6 flex-1">
                          {displayExcerpt}
                        </p>

                        <div className="flex items-center justify-between pt-6 mt-auto border-t border-[#0A1F3D]/5">
                          <span className="text-xs font-medium text-[#94A3B8]">
                            {post.date}
                          </span>
                          <span className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#C5A059] group-hover:gap-3 transition-all duration-300">
                            Ler
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
