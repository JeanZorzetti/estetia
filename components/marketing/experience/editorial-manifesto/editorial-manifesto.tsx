'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, registerGsap } from '@/lib/animation/gsap'

const LINES = [
  'Clínicas não precisam',
  'de mais planilhas.',
  'Precisam de mais',
  'pacientes fiéis.',
]

const BODY_PARAGRAPHS = [
  'O Estetia CRM foi construído por quem entende a jornada da estética: da primeira consulta ao retorno recorrente, cada ponto de contato importa.',
  'Automação que respeita o cuidado humano. Dados que revelam oportunidades reais. Uma plataforma que cresce com a sua clínica.',
]

export function EditorialManifesto() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const linesRef = useRef<(HTMLDivElement | null)[]>([])
  const bodyRef = useRef<(HTMLParagraphElement | null)[]>([])
  const accentRef = useRef<HTMLDivElement>(null)
  const statRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    registerGsap()

    const lines = linesRef.current.filter(Boolean) as HTMLDivElement[]
    const body = bodyRef.current.filter(Boolean) as HTMLParagraphElement[]
    const accent = accentRef.current
    const stat = statRef.current

    gsap.set(lines, { yPercent: 110, opacity: 0 })
    gsap.set(body, { opacity: 0, y: 20 })
    if (accent) gsap.set(accent, { scaleX: 0, transformOrigin: 'left' })
    if (stat) gsap.set(stat, { opacity: 0, y: 30 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        once: true,
      },
    })

    tl.to(lines, {
      yPercent: 0,
      opacity: 1,
      duration: 1.1,
      ease: 'power3.out',
      stagger: 0.18,
    })

    if (accent) {
      tl.to(accent, {
        scaleX: 1,
        duration: 0.7,
        ease: 'power2.out',
      }, '-=0.5')
    }

    tl.to(body, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.15,
    }, '-=0.4')

    if (stat) {
      tl.to(stat, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.5')
    }

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
      id="editorial"
      ref={sectionRef}
      className="relative min-h-screen flex items-center py-32 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #04080F 0%, #060E1C 60%, #04080F 100%)' }}
    >
      {/* Linha decorativa vertical esquerda */}
      <div
        className="absolute left-[7vw] top-0 bottom-0 w-px opacity-10"
        style={{ background: 'linear-gradient(to bottom, transparent, #C5A059 30%, #C5A059 70%, transparent)' }}
      />

      {/* Número de seção */}
      <div
        className="absolute top-16 left-[7vw] text-[10px] tracking-[0.35em] uppercase opacity-30"
        style={{ fontFamily: 'monospace', color: '#C5A059' }}
      >
        02 — Manifesto
      </div>

      <div className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-16 items-start">

          {/* Headline principal */}
          <div>
            <div className="mb-4">
              <div
                ref={accentRef}
                className="h-[2px] w-16 mb-8"
                style={{ background: '#C5A059' }}
              />
            </div>

            <div className="space-y-1">
              {LINES.map((line, i) => (
                <div key={i} className="overflow-hidden">
                  <div
                    ref={(el) => { linesRef.current[i] = el }}
                    style={{
                      fontFamily: "'Newsreader', Georgia, serif",
                      fontSize: 'clamp(2.75rem, 7vw, 7.5rem)',
                      fontWeight: 300,
                      fontStyle: i % 2 === 1 ? 'italic' : 'normal',
                      lineHeight: 1.05,
                      letterSpacing: '-0.02em',
                      color: i === 2 || i === 3 ? '#C5A059' : '#F0EDE8',
                    }}
                  >
                    {line}
                  </div>
                </div>
              ))}
            </div>

            {/* Corpo */}
            <div className="mt-12 max-w-xl space-y-4">
              {BODY_PARAGRAPHS.map((p, i) => (
                <p
                  key={i}
                  ref={(el) => { bodyRef.current[i] = el }}
                  style={{
                    fontFamily: "'Newsreader', Georgia, serif",
                    fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
                    color: 'rgba(240,237,232,0.55)',
                    lineHeight: 1.75,
                    fontStyle: 'normal',
                  }}
                >
                  {p}
                </p>
              ))}
            </div>
          </div>

          {/* Stat lateral */}
          <div
            ref={statRef}
            className="hidden lg:flex flex-col items-end gap-2 pt-8 min-w-[200px]"
          >
            <div
              style={{
                fontFamily: "'Newsreader', Georgia, serif",
                fontSize: '6rem',
                fontWeight: 300,
                lineHeight: 1,
                color: 'rgba(197,160,89,0.15)',
                letterSpacing: '-0.04em',
              }}
            >
              3×
            </div>
            <div
              style={{
                fontSize: '0.7rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(240,237,232,0.3)',
                textAlign: 'right',
                fontFamily: 'monospace',
                lineHeight: 1.6,
              }}
            >
              mais retorno<br />de pacientes
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
