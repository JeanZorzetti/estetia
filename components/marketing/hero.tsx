'use client'

import { Link } from "@/i18n/routing"
import { ArrowRight } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"

export function Hero() {
    const t = useTranslations("marketing.home.hero")
    const locale = useLocale()

    return (
        <section className="relative overflow-hidden bg-[#EEF0F8] pt-28 pb-20 lg:pt-40 lg:pb-32">
                {/* Grain texture */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    backgroundSize: '128px 128px'
                }} />

                {/* Atmospheric glows */}
                <div className="absolute -top-40 right-[-5%] w-[800px] h-[800px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(72,159,181,0.12) 0%, transparent 65%)' }} />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(197,160,89,0.10) 0%, transparent 65%)' }} />

                {/* Top gold rule */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A059]/50 to-transparent" />

                <div className="mx-auto max-w-5xl px-6 lg:px-8 text-center relative z-10">

                    {/* Headline — Boulevard-style: bold, direct, memorable */}
                    <h1 className="mx-auto max-w-4xl font-serif leading-[1.05] tracking-[-0.025em] text-[#0A1F3D]"
                        style={{ fontSize: 'clamp(3rem, 8.5vw, 6rem)' }}>
                        {t('title_prefix')}
                        <br />
                        <span className="relative inline-block">
                            <span className="text-[#C5A059]">{t('title_highlight')}</span>
                            <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-[#C5A059]/0 via-[#C5A059] to-[#C5A059]/0 rounded-full" />
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="mx-auto mt-7 max-w-2xl text-xl leading-relaxed text-[#64748B]">
                        {t('subtitle')}
                    </p>

                    {/* Single primary CTA — Boulevard uses one CTA */}
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link
                            href="/register"
                            className="group inline-flex items-center gap-2.5 rounded-xl bg-[#0A1F3D] px-10 py-4 text-base font-semibold text-white shadow-xl shadow-[#0A1F3D]/20 hover:bg-[#162D54] hover:-translate-y-0.5 transition-all duration-200 min-w-[220px] justify-center"
                        >
                            {t('cta1')}
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                        </Link>
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 rounded-xl border border-[#0A1F3D]/15 bg-white/60 backdrop-blur-sm px-8 py-4 text-base font-semibold text-[#0A1F3D] hover:border-[#0A1F3D]/30 hover:bg-white transition-all duration-200"
                        >
                            {t('cta2')}
                        </Link>
                    </div>

                    {/* Trust signals */}
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-sm text-[#64748B]">
                        {[t('risk1'), t('risk2'), t('risk3')].map((item, i) => (
                            <span key={i} className="flex items-center gap-1.5">
                                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#489FB5]/15 shrink-0">
                                    <svg className="h-2.5 w-2.5 text-[#489FB5]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                {item}
                            </span>
                        ))}
                    </div>

                    {/* Social proof */}
                    {locale === 'pt-BR' && (
                        <div className="mt-8 inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-[#0A1F3D]/8 rounded-2xl px-5 py-3 shadow-md shadow-[#0A1F3D]/5">
                            <div className="flex -space-x-2">
                                {['#0A1F3D', '#489FB5', '#C5A059', '#162D54'].map((color, i) => (
                                    <div key={i} className="h-8 w-8 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white"
                                        style={{ backgroundColor: color }}>
                                        {i === 3 ? '+' : ''}
                                    </div>
                                ))}
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-semibold text-[#0A1F3D]">
                                    {t.rich('socialProof', {
                                        white: (chunks) => <span className="text-[#C5A059]">{chunks}</span>
                                    })}
                                </div>
                                <div className="flex gap-0.5 mt-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="h-3 w-3 text-[#C5A059]" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom rule */}
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/25 to-transparent" />
        </section>
    )
}
