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

const PAGE_SIZE = 6

export function BlogClientContent({ sortedPosts, allCategoryLabel, locale }: BlogClientContentProps) {
  const t = useTranslations('marketing.blog')
  const isEn = locale === 'en'
  const [selectedCategory, setSelectedCategory] = useState(allCategoryLabel)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const uniqueCategories = Array.from(new Set(sortedPosts.map(p => p.category)))
  const categories = [allCategoryLabel, ...uniqueCategories]

  const filteredPosts = selectedCategory === allCategoryLabel
    ? sortedPosts
    : sortedPosts.filter(p => p.category === selectedCategory)

  const featuredPost = filteredPosts[0]
  const recentPosts = filteredPosts.slice(1, 1 + visibleCount)
  const hasMore = filteredPosts.length - 1 > visibleCount

  function handleCategoryChange(category: string) {
    setSelectedCategory(category)
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <>
      {/* ── Category Filter (Floating Glass Panel) ── */}
      <div className="sticky top-6 z-40 px-6 pointer-events-none mb-12">
        <div className="container mx-auto max-w-5xl pointer-events-auto">
          <div className="backdrop-blur-xl bg-white/70 border border-white/40 shadow-[0_15px_35px_rgba(0,0,0,0.05)] rounded-[2rem] p-3 md:px-6">
            {/* Pills row */}
            <div className="relative">
              <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-1">
                {categories.map((category) => {
                  const isAll = category === allCategoryLabel
                  const color = isAll ? '#0A1F3D' : getCategoryColor(category)
                  const isActive = selectedCategory === category
                  return (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className="flex items-center gap-2 whitespace-nowrap px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-500 flex-shrink-0 hover:scale-[1.03] active:scale-95"
                      style={isActive
                        ? {
                            backgroundColor: color,
                            color: '#FFFFFF',
                            boxShadow: `0 8px 20px ${color}40`,
                            border: `1px solid ${color}`,
                          }
                        : {
                            color: '#64748B',
                            backgroundColor: 'rgba(255, 255, 255, 0.4)',
                            border: '1px solid rgba(10, 31, 61, 0.08)',
                          }
                      }
                    >
                      {!isAll && (
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0 transition-transform duration-300"
                          style={{
                            backgroundColor: isActive ? '#FFFFFF' : color,
                            boxShadow: isActive ? 'none' : `0 0 8px ${color}`,
                          }}
                        />
                      )}
                      <span>{category}</span>
                    </button>
                  )
                })}
              </div>
              {/* Right fade hint */}
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white/90 to-transparent pointer-events-none md:hidden" />
            </div>
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

      <div className="container mx-auto px-6 max-w-7xl pt-4">

        {/* ── Featured Post ── */}
        {featuredPost && (
          <div className="pb-20">
            <div className="flex items-center gap-4 mb-8">
              <span className="tracking-[0.2em] uppercase text-[10px] font-bold text-[#C5A059]">
                {t('featured.label')}
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-[#0A1F3D]/10 to-transparent" />
            </div>

            <Link href={`/${locale}/blog/${featuredPost.slug}`} className="block group">
              <div className="rounded-[2.5rem] overflow-hidden grid lg:grid-cols-[54fr_46fr] bg-white/60 hover:bg-white/90 backdrop-blur-md border border-white/40 shadow-[0_15px_45px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.09)] hover:-translate-y-1.5 transition-all duration-500 relative"
                style={{
                  minHeight: '460px',
                }}>
                {/* Border glowing line for premium detail */}
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Left: visual wrapper with zoom effect */}
                <div className="relative overflow-hidden min-h-[320px] lg:min-h-0 bg-[#0A1F3D]">
                  <div className="absolute inset-0 z-0 transition-transform duration-700 ease-out group-hover:scale-105 group-hover:rotate-1">
                    <PostCover
                      src={featuredPost.image}
                      alt={featuredPost.imageAlt || featuredPost.title}
                      color={getCategoryColor(featuredPost.category)}
                      category={featuredPost.category}
                    />
                  </div>
                  {/* Category pill */}
                  <div className="absolute top-6 left-6 z-20">
                    <span className="inline-flex items-center px-4 py-2 rounded-full tracking-[0.15em] uppercase text-[10px] font-bold text-[#FFFFFF] backdrop-blur-md bg-[#0A1F3D]/40 border border-white/20 shadow-lg">
                      {featuredPost.category}
                    </span>
                  </div>
                  {/* Soft overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F3D]/60 via-transparent to-transparent z-10" />
                </div>

                {/* Right: Content details */}
                <div className="flex flex-col justify-center p-10 lg:p-16 relative z-10">
                  <div className="space-y-6">
                    {/* Read time and metadata badges in premium chips */}
                    <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold tracking-[0.1em] text-[#94A3B8] uppercase">
                      <span className="flex items-center gap-2 bg-white/80 border border-[#0A1F3D]/5 px-3 py-1.5 rounded-full">
                        <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>{getReadingMinutes(featuredPost.content)} {t('post.readingTime')}</span>
                      </span>
                      <span className="flex items-center gap-2 bg-white/80 border border-[#0A1F3D]/5 px-3 py-1.5 rounded-full">
                        <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>{featuredPost.date}</span>
                      </span>
                    </div>

                    <h2 className="font-serif text-3xl lg:text-4xl font-bold leading-tight text-[#0A1F3D] group-hover:text-[#489FB5] transition-colors duration-300">
                      {isEn && featuredPost.titleEn ? featuredPost.titleEn : featuredPost.title}
                    </h2>

                    <p className="text-sm lg:text-base leading-relaxed text-[#64748B] line-clamp-3">
                      {isEn && featuredPost.excerptEn ? featuredPost.excerptEn : featuredPost.excerpt}
                    </p>
                  </div>

                  <div className="mt-10 flex items-center gap-2 text-xs font-bold text-[#489FB5] tracking-[0.15em] uppercase group-hover:gap-4 transition-all duration-300">
                    <span>{t('post.readMore')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* ── Empty state ── */}
        {filteredPosts.length === 0 && (
          <div className="py-24 text-center bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-white/40 shadow-sm">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-[#F8F9FC] text-[#94A3B8] border border-[#0A1F3D]/5 shadow-inner">
              <BookOpen className="w-8 h-8 text-[#C5A059]" />
            </div>
            <h2 className="font-serif text-2xl font-bold mb-3 text-[#0A1F3D]">Nenhum artigo encontrado</h2>
            <p className="text-[#64748B] mb-8 max-w-md mx-auto text-sm leading-relaxed">
              Ainda não publicamos conteúdos na categoria <strong className="text-[#0A1F3D]">{selectedCategory}</strong>. Fique de olho, novidades em breve.
            </p>
            <div className="flex flex-wrap gap-2.5 justify-center max-w-xl mx-auto px-6">
              {getAllCategories().map(cat => (
                <button key={cat} onClick={() => handleCategoryChange(cat)}
                  className="px-5 py-2.5 rounded-full tracking-[0.1em] uppercase text-[10px] font-bold transition-all hover:scale-105 border border-[#0A1F3D]/10 hover:border-[#C5A059]/40 text-[#64748B] hover:text-[#0A1F3D] bg-white/80 hover:bg-white shadow-sm">
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
              <span className="tracking-[0.2em] uppercase text-[10px] font-bold text-[#C5A059]">
                {t('recent.label')}
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-[#0A1F3D]/10 to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post) => {
                const catColor = getCategoryColor(post.category)
                const displayTitle = isEn && post.titleEn ? post.titleEn : post.title
                const displayExcerpt = isEn && post.excerptEn ? post.excerptEn : post.excerpt
                const readMin = getReadingMinutes(post.content)

                return (
                  <Link key={post.slug} href={`/${locale}/blog/${post.slug}`} className="block group">
                    <article className="h-full flex flex-col rounded-[2.2rem] overflow-hidden bg-white/60 hover:bg-white backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(0,0,0,0.06)] border border-white/40 hover:border-[#C5A059]/40 relative">
                      
                      {/* Sub-atmospheric glow card top */}
                      <div className="absolute inset-x-0 top-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ backgroundColor: catColor }} />

                      {/* Visual header */}
                      <div className="relative h-56 flex-shrink-0 overflow-hidden bg-[#0A1F3D]">
                        <div className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-105">
                          <PostCover
                            src={post.image}
                            alt={post.imageAlt || displayTitle}
                            color={catColor}
                            category={post.category}
                          />
                        </div>
                        <div className="absolute top-4 left-4 z-20">
                          <span className="inline-block px-3 py-1.5 rounded-full tracking-[0.15em] uppercase text-[9px] font-bold text-[#FFFFFF] backdrop-blur-md bg-[#0A1F3D]/40 border border-white/20">
                            {post.category}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F3D]/30 to-transparent z-10" />
                      </div>

                      {/* Content details */}
                      <div className="flex flex-col flex-1 p-8">
                        <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.1em] text-[#94A3B8] uppercase mb-4">
                          <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>{readMin} min de leitura</span>
                        </div>

                        <h3 className="font-serif text-xl font-bold leading-snug mb-3 text-[#0A1F3D] group-hover:text-[#489FB5] transition-colors duration-300 line-clamp-2">
                          {displayTitle}
                        </h3>

                        <p className="text-sm leading-relaxed text-[#64748B] line-clamp-3 mb-6 flex-1">
                          {displayExcerpt}
                        </p>

                        <div className="flex items-center justify-between pt-5 mt-auto border-t border-[#0A1F3D]/5">
                          <span className="text-xs font-semibold text-[#94A3B8]">
                            {post.date}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs font-bold tracking-[0.15em] uppercase text-[#C5A059] group-hover:gap-2.5 transition-all duration-300">
                            <span>Ler</span>
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

        {/* ── Load more — fora do bloco condicional recentPosts ── */}
        {hasMore && (
          <div className="flex justify-center pt-2 pb-20">
            <button
              onClick={() => setVisibleCount(v => v + PAGE_SIZE)}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-sm tracking-[0.1em] uppercase border border-[#0A1F3D]/15 bg-white/70 backdrop-blur-md hover:bg-[#0A1F3D] hover:text-white hover:border-[#0A1F3D] text-[#0A1F3D] shadow-sm hover:shadow-[0_8px_24px_rgba(10,31,61,0.15)] transition-all duration-300"
            >
              <span>Ver mais artigos</span>
              <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>
    </>
  )
}
