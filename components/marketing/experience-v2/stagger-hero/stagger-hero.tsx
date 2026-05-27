'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, stagger } from 'animejs'
import { ParticlesSvg } from './particles-svg'
import { GoldenParticle } from '../shared/golden-particle'
import { watchSection } from '@/lib/animation/anime-scroll'

const HEADLINE = 'Gestão clínica que encanta'
const SUBWORDS = ['Menos papel.', 'Mais presença.', 'Resultados que ficam.']
const WORDS = HEADLINE.split(' ')

export function StaggerHero() {
  const containerRef = useRef<HTMLElement>(null)
  const lettersRef = useRef<HTMLSpanElement[]>([])
  const wordsRef = useRef<HTMLSpanElement[]>([])
  const hasAnimated = useRef(false)
  const [particlePhase, setParticlePhase] = useState<'hero-enter' | 'hero-exit'>('hero-enter')
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    if (hasAnimated.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Static beautiful state for reduced-motion
      lettersRef.current.filter(Boolean).forEach(el => { el.style.opacity = '1'; el.style.transform = 'translateY(0)' })
      wordsRef.current.filter(Boolean).forEach(el => { el.style.opacity = '1'; el.style.transform = 'translateY(0)' })
      return
    }

    hasAnimated.current = true

    // Letter stagger from center
    animate(lettersRef.current.filter(Boolean), {
      opacity: [0, 1],
      translateY: ['0.8em', '0em'],
      delay: stagger(35, { from: 'center' }),
      duration: 700,
      ease: 'outExpo',
    })

    // Words stagger with offset after letters finish
    setTimeout(() => {
      animate(wordsRef.current.filter(Boolean), {
        opacity: [0, 1],
        translateY: ['1em', '0em'],
        delay: stagger(120, { from: 'first' }),
        duration: 600,
        ease: 'outBack(1.4)',
      })
    }, 400)

    // Track scroll to drive particle handoff
    const section = containerRef.current
    if (section) {
      const watcher = watchSection(section, (p) => {
        setScrollProgress(p)
        if (p > 0.75) setParticlePhase('hero-exit')
        else setParticlePhase('hero-enter')
      })
      return () => watcher.destroy()
    }
  }, [])

  // Render words as nowrap blocks; letters inside each word
  let letterIdx = 0
  const renderedWords = WORDS.map((word, wi) => {
    const letterSpans = word.split('').map((char) => {
      const idx = letterIdx++
      return (
        <span
          key={idx}
          ref={el => { if (el) lettersRef.current[idx] = el }}
          style={{ display: 'inline-block', opacity: 0 }}
        >
          {char}
        </span>
      )
    })
    return (
      <span
        key={wi}
        style={{
          display: 'inline-block',
          whiteSpace: 'nowrap',
          marginRight: wi < WORDS.length - 1 ? '0.28em' : 0,
        }}
      >
        {letterSpans}
      </span>
    )
  })

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'transparent' }}
    >
      {/* Gradient vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, #04080F 95%)',
        }}
      />

      {/* Particles layer */}
      <ParticlesSvg />

      {/* Section number */}
      <div
        className="absolute top-8 right-8 z-10 text-[10px] tracking-[0.4em] uppercase opacity-30"
        style={{ fontFamily: "'Manrope', sans-serif", color: '#C5A059' }}
      >
        01 — Stagger
      </div>

      {/* Golden particle motif */}
      <GoldenParticle phase={particlePhase} scrollProgress={scrollProgress} />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        {/* Gold accent line */}
        <div
          className="mx-auto mb-8 h-px w-16 opacity-60"
          style={{ background: 'linear-gradient(90deg, transparent, #C5A059, transparent)' }}
        />

        {/* Headline letter-by-letter */}
        <h1
          className="mb-6 leading-tight"
          style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: 'clamp(2.2rem, 7vw, 6rem)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: '#F0EDE8',
            letterSpacing: '-0.02em',
          }}
          aria-label={HEADLINE}
        >
          {renderedWords}
        </h1>

        {/* Subwords stagger */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {SUBWORDS.map((word, i) => (
            <span
              key={i}
              ref={el => { if (el) wordsRef.current[i] = el }}
              style={{
                display: 'inline-block',
                opacity: 0,
                fontFamily: "'Manrope', sans-serif",
                fontSize: '0.85rem',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: i === 0 ? '#C5A059' : i === 1 ? '#489FB5' : 'rgba(240,237,232,0.5)',
              }}
            >
              {word}
            </span>
          ))}
        </div>

        {/* CTA hint */}
        <div className="mt-16 flex flex-col items-center gap-2 opacity-40">
          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '0.65rem',
              fontWeight: 500,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#C5A059',
            }}
          >
            Role para explorar
          </p>
          <div className="flex flex-col items-center gap-1">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-px rounded-full"
                style={{
                  height: '6px',
                  background: '#C5A059',
                  animation: `fade-pulse 1.5s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-pulse {
          0%, 100% { opacity: 0.2; transform: scaleY(0.6); }
          50% { opacity: 1; transform: scaleY(1); }
        }
      `}</style>
    </section>
  )
}
