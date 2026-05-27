'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { gsap, registerGsap } from '@/lib/animation/gsap'

const DistortionCanvas = dynamic(() => import('./distortion-canvas'), { ssr: false })

const HEADLINE = 'Estética que converte'
const SUB = 'O CRM clínico que transforma consultas em fidelidade.'

export function HeroWebGL() {
  const containerRef = useRef<HTMLDivElement>(null)
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([])
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    registerGsap()

    const letters = lettersRef.current.filter(Boolean) as HTMLSpanElement[]
    const sub = subRef.current
    const cta = ctaRef.current

    gsap.set(letters, { y: '120%', opacity: 0 })
    gsap.set([sub, cta], { opacity: 0, y: 24 })

    const tl = gsap.timeline({ delay: 0.3 })

    tl.to(letters, {
      y: '0%',
      opacity: 1,
      duration: 0.9,
      ease: 'power3.out',
      stagger: {
        each: 0.04,
        from: 'start',
      },
    })
    .to([sub, cta], {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.15,
    }, '-=0.3')

    return () => { tl.kill() }
  }, [])

  const chars = HEADLINE.split('')

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
      aria-label="Hero principal Estetia CRM"
    >
      {/* WebGL background — carregado via dynamic(ssr:false) */}
      <div className="absolute inset-0 z-0">
        <DistortionCanvas />
      </div>

      {/* Vinheta */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(4,8,15,0.75) 100%)',
        }}
      />

      {/* Conteúdo */}
      <div className="relative z-20 text-center px-6 max-w-5xl mx-auto">
        <div
          className="overflow-hidden leading-none mb-6"
          aria-hidden="true"
        >
          <h1
            className="inline-flex flex-wrap justify-center gap-x-[0.05em]"
            style={{
              fontFamily: "'Newsreader', Georgia, serif",
              fontSize: 'clamp(3.5rem, 9vw, 9rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              letterSpacing: '-0.02em',
              lineHeight: 1,
              color: '#F0EDE8',
            }}
          >
            {chars.map((char, i) => (
              <span
                key={i}
                ref={(el) => { lettersRef.current[i] = el }}
                style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
              >
                {char === ' ' ? ' ' : char}
              </span>
            ))}
          </h1>
        </div>

        <p
          ref={subRef}
          style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: 'clamp(1rem, 2vw, 1.375rem)',
            color: 'rgba(240,237,232,0.6)',
            letterSpacing: '0.01em',
            marginBottom: '2.5rem',
          }}
        >
          {SUB}
        </p>

        <div ref={ctaRef} className="flex items-center justify-center gap-4">
          <a
            href="/register"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-[#04080F] font-semibold text-sm tracking-wide transition-transform hover:scale-[1.03] active:scale-[0.97]"
            style={{
              background: 'linear-gradient(135deg, #C5A059 0%, #E3C97C 50%, #C5A059 100%)',
              backgroundSize: '200% auto',
            }}
          >
            Começar grátis
          </a>
          <a
            href="#editorial"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-medium tracking-wide border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all"
          >
            Explorar
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-50"
        aria-hidden="true"
      >
        <span
          style={{
            fontSize: '0.625rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontFamily: 'monospace',
            color: '#C5A059',
          }}
        >
          Role
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-[#C5A059] to-transparent" />
      </div>
    </section>
  )
}
