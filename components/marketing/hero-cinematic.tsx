'use client'

import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { VideoBackground } from './hero-cinematic/video-background'
import { ScrollIndicator } from './hero-cinematic/scroll-indicator'
import { useHeroReveal } from './hero-cinematic/use-mask-reveal'

type Props = {
  badge?: string
  titleLine1?: string
  titleLine2?: string
  titleHighlight?: string
  subtitle?: string
  ctaPrimary?: { label: string; href: string }
  ctaSecondary?: { label: string; href: string }
  videoSrc?: string
  videoWebmSrc?: string
  videoPoster?: string
}

export function HeroCinematic({
  badge = 'TECNOLOGIA ESTÉTICA DE ELITE',
  titleLine1 = 'A inteligência por trás',
  titleLine2 = 'das clínicas',
  titleHighlight = 'de elite.',
  subtitle = 'Estetia CRM transforma sua agenda, financeiro e relacionamento com pacientes em uma única plataforma.',
  ctaPrimary = { label: 'Começar gratuitamente', href: '/register' },
  ctaSecondary = { label: 'Ver demonstração', href: '/login' },
  videoSrc,
  videoWebmSrc,
  videoPoster,
}: Props) {
  const refs = useHeroReveal()

  return (
    <section className="relative h-screen min-h-[640px] w-full overflow-hidden bg-[#0A1F3D] text-white">
      <VideoBackground src={videoSrc} webmSrc={videoWebmSrc} poster={videoPoster} />

      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <div className="max-w-4xl">
          <div
            ref={(el) => {
              refs.current.badge = el
            }}
            className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/40 bg-white/5 px-4 py-1.5 backdrop-blur-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#C5A059]" />
            <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#C5A059]">
              {badge}
            </span>
          </div>

          <h1
            className="mt-8 font-serif leading-[1.05] tracking-[-0.035em] text-white"
            style={{ fontSize: 'clamp(2.75rem, 7vw, 5.5rem)' }}
          >
            <span className="block overflow-hidden">
              <span
                ref={(el) => {
                  if (el) refs.current.titleLines[0] = el
                }}
                className="block"
              >
                {titleLine1}
              </span>
            </span>
            <span className="block overflow-hidden">
              <span
                ref={(el) => {
                  if (el) refs.current.titleLines[1] = el
                }}
                className="block"
              >
                {titleLine2}{' '}
                <span className="text-[#C5A059] italic">{titleHighlight}</span>
              </span>
            </span>
          </h1>

          <p
            ref={(el) => {
              refs.current.subtitle = el
            }}
            className="mx-auto mt-8 max-w-2xl text-lg font-medium leading-relaxed text-white/85 sm:text-xl"
          >
            {subtitle}
          </p>

          <div
            ref={(el) => {
              refs.current.ctas = el
            }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href={ctaPrimary.href}
              className="group inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-white px-9 py-4 text-base font-bold text-[#0A1F3D] shadow-2xl shadow-black/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/40 sm:w-auto"
            >
              {ctaPrimary.label}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={ctaSecondary.href}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/5 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/60 hover:bg-white/10 sm:w-auto"
            >
              {ctaSecondary.label}
            </Link>
          </div>
        </div>

        <ScrollIndicator
          ref={(el) => {
            refs.current.indicator = el
          }}
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/25 to-transparent" />
    </section>
  )
}
