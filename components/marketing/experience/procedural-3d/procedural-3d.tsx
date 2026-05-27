'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { gsap, ScrollTrigger, registerGsap } from '@/lib/animation/gsap'

const ProceduralScene = dynamic(() => import('./procedural-scene'), { ssr: false })

const FEATURES = [
  { num: '01', title: 'Pipeline visual', desc: 'Kanban clínico que reflete cada etapa da jornada do paciente.' },
  { num: '02', title: 'Prontuário digital', desc: 'Anamneses, evoluções e fotos organizados em um único lugar.' },
  { num: '03', title: 'IA integrada', desc: 'Sugestões automáticas e insights preditivos sobre retorno.' },
]

export function Procedural3D() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    registerGsap()

    const features = featuresRef.current.filter(Boolean) as HTMLDivElement[]
    gsap.set(features, { opacity: 0, x: -30 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: 'top 70%',
        once: true,
      },
    })

    tl.to(features, {
      opacity: 1,
      x: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.2,
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
      ref={wrapperRef}
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #04080F 0%, #061220 50%, #04080F 100%)',
        minHeight: '100vh',
      }}
    >
      {/* Número seção */}
      <div
        className="absolute top-16 right-[7vw] text-[10px] tracking-[0.35em] uppercase opacity-30"
        style={{ fontFamily: 'monospace', color: '#489FB5' }}
      >
        03 — 3D Procedural
      </div>

      <div className="mx-auto max-w-7xl px-6 py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Lado esquerdo: cena R3F */}
        <div className="relative h-[500px] lg:h-[620px]">
          <ProceduralScene />
        </div>

        {/* Lado direito: features */}
        <div ref={textRef} className="space-y-12">
          <div>
            <div
              className="h-[2px] w-12 mb-6"
              style={{ background: '#489FB5' }}
            />
            <h2
              style={{
                fontFamily: "'Newsreader', Georgia, serif",
                fontSize: 'clamp(2rem, 4vw, 4.5rem)',
                fontWeight: 300,
                fontStyle: 'italic',
                color: '#F0EDE8',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              Tecnologia que
              <br />
              <span style={{ color: '#489FB5' }}>amplifica o cuidado</span>
            </h2>
          </div>

          <div className="space-y-8">
            {FEATURES.map((f, i) => (
              <div
                key={f.num}
                ref={(el) => { featuresRef.current[i] = el }}
                className="flex gap-6 group"
              >
                <div
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '0.7rem',
                    color: '#489FB5',
                    letterSpacing: '0.1em',
                    paddingTop: '0.25rem',
                    opacity: 0.7,
                    minWidth: '2rem',
                  }}
                >
                  {f.num}
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Newsreader', Georgia, serif",
                      fontSize: '1.375rem',
                      fontWeight: 400,
                      color: '#F0EDE8',
                      marginBottom: '0.375rem',
                    }}
                  >
                    {f.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.9375rem',
                      color: 'rgba(240,237,232,0.45)',
                      lineHeight: 1.65,
                      fontFamily: "'Newsreader', Georgia, serif",
                    }}
                  >
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
