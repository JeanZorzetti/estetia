'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, registerGsap } from '@/lib/animation/gsap'

export function ClosingCurtain() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const curtainLeftRef = useRef<HTMLDivElement>(null)
  const curtainRightRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    registerGsap()

    const left = curtainLeftRef.current
    const right = curtainRightRef.current
    const content = contentRef.current
    const headline = headlineRef.current
    const cta = ctaRef.current

    if (!left || !right || !content) return

    // Iniciar: cortinas fechadas, conteúdo invisível
    gsap.set(left, { xPercent: 0 })
    gsap.set(right, { xPercent: 0 })
    gsap.set(content, { opacity: 0 })
    if (headline) gsap.set(headline, { y: 40, opacity: 0 })
    if (cta) gsap.set(cta, { y: 30, opacity: 0 })

    const tl = gsap.timeline({ paused: true })

    // Cortinas se abrem
    tl.to(left, {
      xPercent: -105,
      duration: 1.4,
      ease: 'power4.inOut',
    })
    tl.to(right, {
      xPercent: 105,
      duration: 1.4,
      ease: 'power4.inOut',
    }, '<')

    // Conteúdo surge
    tl.to(content, {
      opacity: 1,
      duration: 0.4,
    }, '-=0.4')

    if (headline) {
      tl.to(headline, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
      }, '-=0.2')
    }

    if (cta) {
      tl.to(cta, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.5')
    }

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 60%',
      once: true,
      onEnter: () => tl.play(),
    })

    const refreshTimers = [
      setTimeout(() => ScrollTrigger.refresh(), 100),
      setTimeout(() => ScrollTrigger.refresh(), 500),
    ]

    return () => {
      refreshTimers.forEach(clearTimeout)
      tl.kill()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden flex items-center justify-center"
      style={{
        minHeight: '100vh',
        background: '#04080F',
      }}
    >
      {/* Número seção */}
      <div
        className="absolute top-8 left-1/2 -translate-x-1/2 z-30 text-[10px] tracking-[0.35em] uppercase opacity-30"
        style={{ fontFamily: 'monospace', color: '#C5A059' }}
      >
        06 — Comece agora
      </div>

      {/* Cortina esquerda */}
      <div
        ref={curtainLeftRef}
        className="absolute left-0 top-0 bottom-0 w-1/2 z-20 origin-left"
        style={{
          background: 'linear-gradient(135deg, #C5A059 0%, #8B6E32 40%, #6B4F1E 100%)',
        }}
      >
        <div
          className="absolute right-0 top-0 bottom-0 w-16"
          style={{
            background: 'linear-gradient(to left, rgba(4,8,15,0.4), transparent)',
          }}
        />
        {/* Textura sutil */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              rgba(255,255,255,0.1) 0px,
              rgba(255,255,255,0.1) 1px,
              transparent 1px,
              transparent 20px
            )`,
          }}
        />
      </div>

      {/* Cortina direita */}
      <div
        ref={curtainRightRef}
        className="absolute right-0 top-0 bottom-0 w-1/2 z-20 origin-right"
        style={{
          background: 'linear-gradient(225deg, #C5A059 0%, #8B6E32 40%, #6B4F1E 100%)',
        }}
      >
        <div
          className="absolute left-0 top-0 bottom-0 w-16"
          style={{
            background: 'linear-gradient(to right, rgba(4,8,15,0.4), transparent)',
          }}
        />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              rgba(255,255,255,0.1) 0px,
              rgba(255,255,255,0.1) 1px,
              transparent 1px,
              transparent 20px
            )`,
          }}
        />
      </div>

      {/* Conteúdo final */}
      <div
        ref={contentRef}
        className="relative z-10 text-center px-6 max-w-3xl mx-auto"
      >
        {/* Ornamento */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#C5A059]" />
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: '#C5A059' }}
          />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#C5A059]" />
        </div>

        <h2
          ref={headlineRef}
          style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: 'clamp(2.5rem, 6vw, 6rem)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: '#F0EDE8',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            marginBottom: '1.5rem',
          }}
        >
          Sua clínica merece<br />
          <span style={{ color: '#C5A059' }}>o melhor CRM</span>
        </h2>

        <p
          style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: '1.125rem',
            color: 'rgba(240,237,232,0.5)',
            marginBottom: '3rem',
            lineHeight: 1.7,
          }}
        >
          Junte-se a centenas de clínicas que já transformaram<br />
          pacientes em resultados.
        </p>

        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/register"
            className="inline-flex items-center gap-3 px-9 py-4 rounded-full font-semibold text-base tracking-wide transition-all hover:scale-[1.03] active:scale-[0.97]"
            style={{
              background: 'linear-gradient(135deg, #C5A059 0%, #E3C97C 50%, #C5A059 100%)',
              backgroundSize: '200% auto',
              color: '#04080F',
            }}
          >
            Começar grátis
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a
            href="/precos"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-medium border border-white/15 text-white/60 hover:text-white hover:border-white/35 transition-all"
          >
            Ver planos
          </a>
        </div>

        <p
          className="mt-8 text-xs tracking-widest uppercase opacity-30"
          style={{ fontFamily: 'monospace', color: '#C5A059' }}
        >
          Sem cartão de crédito • Ativo em 2 minutos
        </p>
      </div>
    </section>
  )
}
