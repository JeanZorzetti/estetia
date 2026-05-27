'use client'

import { useEffect, useRef, useState } from 'react'
import { animate } from 'animejs'
import { watchSection } from '@/lib/animation/anime-scroll'

const BAR_COUNT = 80
const MAX_BAR_H = 120

export function ClosingWave() {
  const wrapperRef = useRef<HTMLElement>(null)
  const barsContainerRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const curtainRef = useRef<HTMLDivElement>(null)
  const [triggered, setTriggered] = useState(false)
  const triggeredRef = useRef(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Static beautiful state: bars at final amplitude, headline visible
      const bars = barsContainerRef.current?.querySelectorAll('[data-bar]')
      if (bars) {
        Array.from(bars).forEach((bar, i) => {
          const el = bar as HTMLElement
          const norm = i / (BAR_COUNT - 1)
          const amplitude = 0.15 + Math.abs(Math.sin(norm * Math.PI * 3)) * 0.85
          el.style.transform = `scaleY(${amplitude})`
          el.style.opacity = String(0.25 + amplitude * 0.65)
        })
      }
      if (headlineRef.current) { headlineRef.current.style.opacity = '1' }
      if (curtainRef.current) { curtainRef.current.style.clipPath = 'inset(0 0% 0 0%)' }
      return
    }
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const watcher = watchSection(wrapper, (progress) => {
      if (progress > 0.15 && !triggeredRef.current) {
        triggeredRef.current = true
        setTriggered(true)
      }
    })

    return () => watcher.destroy()
  }, [])

  useEffect(() => {
    if (!triggered) return
    const bars = barsContainerRef.current?.querySelectorAll('[data-bar]')
    const headline = headlineRef.current
    const curtain = curtainRef.current
    if (!bars || !headline || !curtain) return

    // Wave-front propagation: delay follows a wave-front origin from center outward
    // Each bar's peak amplitude is sinusoidal, delay creates true propagation (not linear)
    Array.from(bars).forEach((bar, i) => {
      const norm = i / (BAR_COUNT - 1)
      // Amplitude: 3 sine peaks across the bar range
      const amplitude = 0.15 + Math.abs(Math.sin(norm * Math.PI * 3)) * 0.85
      // Opacity matches amplitude
      const opacity = 0.25 + amplitude * 0.65
      // Wave-front delay: bars near center (0.5) fire first, edges last — "center burst"
      const distFromCenter = Math.abs(norm - 0.5) // 0 at center, 0.5 at edges
      const waveFrontDelay = distFromCenter * 600 // max 300ms spread

      animate(bar as HTMLElement, {
        scaleY: [0, amplitude],
        opacity: [0, opacity],
        delay: waveFrontDelay,
        duration: 700,
        ease: 'outBack(1.2)',
      })
    })

    // Headline emerges after bars
    animate(headline, {
      opacity: [0, 1],
      scale: [0.85, 1],
      duration: 700,
      ease: 'outExpo',
      delay: 600,
    })

    // Curtain clip-path opens
    animate(curtain, {
      clipPath: ['inset(0 50% 0 50%)', 'inset(0 0% 0 0%)'],
      duration: 900,
      ease: 'inOutExpo',
      delay: 800,
    })
  }, [triggered])

  return (
    <section
      ref={wrapperRef}
      aria-label="CTA final"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'transparent' }}
    >
      {/* Section number */}
      <div
        className="absolute top-8 right-8 z-10 text-[10px] tracking-[0.4em] uppercase opacity-30"
        style={{ fontFamily: "'Manrope', sans-serif", color: '#C5A059' }}
      >
        04 — Onda
      </div>

      {/* Wave bars */}
      <div
        ref={barsContainerRef}
        className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-[2px] px-4"
        style={{ height: `${MAX_BAR_H + 20}px` }}
      >
        {Array.from({ length: BAR_COUNT }, (_, i) => (
          <div
            key={i}
            data-bar={i}
            style={{
              flex: '1',
              height: `${MAX_BAR_H}px`,
              transformOrigin: 'bottom center',
              transform: 'scaleY(0)',
              opacity: 0,
              borderRadius: '2px 2px 0 0',
              background: i % 3 === 0
                ? 'linear-gradient(180deg, #C5A059 0%, rgba(197,160,89,0.15) 100%)'
                : i % 3 === 1
                ? 'linear-gradient(180deg, #489FB5 0%, rgba(72,159,181,0.15) 100%)'
                : 'linear-gradient(180deg, rgba(197,160,89,0.6) 0%, rgba(10,31,61,0.1) 100%)',
            }}
          />
        ))}
      </div>

      {/* Center content */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <div ref={headlineRef} style={{ opacity: 0 }}>
          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '0.7rem',
              fontWeight: 600,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: '#C5A059',
              opacity: 0.7,
              marginBottom: '1.5rem',
            }}
          >
            Estetia CRM
          </p>

          <h2
            style={{
              fontFamily: "'Newsreader', Georgia, serif",
              fontSize: 'clamp(2.2rem, 5vw, 4.5rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: '#F0EDE8',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              marginBottom: '2.5rem',
            }}
          >
            Sua clínica merece<br />
            <span style={{ color: '#C5A059' }}>tecnologia à altura.</span>
          </h2>

          {/* Curtain CTA */}
          <div
            ref={curtainRef}
            style={{
              display: 'inline-block',
              clipPath: 'inset(0 50% 0 50%)',
            }}
          >
            <a
              href="/cadastro"
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.transform = 'scale(1.04)'
                el.style.boxShadow = '0 0 24px rgba(197,160,89,0.5), 0 8px 32px rgba(197,160,89,0.2)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.transform = 'scale(1)'
                el.style.boxShadow = 'none'
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem 2.5rem',
                background: '#C5A059',
                color: '#0A1F3D',
                fontFamily: "'Manrope', sans-serif",
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                borderRadius: '2px',
                outline: 'none',
                transition: 'transform 200ms ease, box-shadow 200ms ease',
              }}
              className="focus-visible:ring-2 focus-visible:ring-[#489FB5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#04080F]"
            >
              Começar agora
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div
        className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(0deg, #04080F 0%, transparent 100%)',
          zIndex: 5,
        }}
      />
    </section>
  )
}
