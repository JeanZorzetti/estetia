'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { gsap, ScrollTrigger, registerGsap } from '@/lib/animation/gsap'

const ProceduralScene = dynamic(() => import('./procedural-scene'), { ssr: false })

const FEATURES = [
  { num: '01', title: 'Pipeline visual', desc: 'Kanban clínico que reflete cada etapa da jornada do paciente.' },
  { num: '02', title: 'Prontuário digital', desc: 'Anamneses, evoluções e fotos organizados em um único lugar.' },
  { num: '03', title: 'IA integrada', desc: 'Sugestões automáticas e insights preditivos sobre retorno.' },
]

const VIEWPORTS_PER_FEATURE = 1.2

export function Procedural3D() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<(HTMLDivElement | null)[]>([])
  const headlineRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    if (!wrapperRef.current) return

    registerGsap()

    const ctx = gsap.context(() => {
      const features = featuresRef.current.filter(Boolean) as HTMLDivElement[]
      const headline = headlineRef.current

      // Estado inicial: headline visível, features escondidas (exceto a primeira que faz reveal logo)
      if (headline) gsap.set(headline, { opacity: 0, y: 30 })
      features.forEach((feature) => {
        gsap.set(feature, { opacity: 0, x: -40 })
      })

      const master = gsap.timeline({ paused: true })

      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
        invalidateOnRefresh: true,
        animation: master,
        onUpdate: (self) => {
          // 4 fases: headline + 3 features. Activeindex = qual feature destacar
          const totalPhases = FEATURES.length + 1
          const phase = Math.min(totalPhases - 1, Math.floor(self.progress * totalPhases))
          const featureIdx = Math.max(0, phase - 1)
          setActiveIndex(featureIdx)
        },
      })

      // Fase 0: revelar headline
      if (headline) {
        master.to(headline, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
        })
      }

      // Hold do headline
      master.to({}, { duration: 0.5 })

      // Fase 1-3: revelar cada feature sequencialmente (stagger por scroll)
      features.forEach((feature) => {
        master.to(feature, {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
        })
        master.to({}, { duration: 0.6 }) // hold
      })
    }, wrapperRef)

    const refreshTimers = [
      setTimeout(() => ScrollTrigger.refresh(), 100),
      setTimeout(() => ScrollTrigger.refresh(), 500),
      setTimeout(() => ScrollTrigger.refresh(), 1500),
    ]

    return () => {
      refreshTimers.forEach(clearTimeout)
      ctx.revert()
    }
  }, [reducedMotion])

  // Versão estática para reduced-motion
  if (reducedMotion) {
    return (
      <section
        className="relative overflow-hidden min-h-screen"
        style={{ background: 'linear-gradient(180deg, #04080F 0%, #061220 50%, #04080F 100%)' }}
      >
        <div className="mx-auto max-w-7xl px-6 py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative h-[500px] lg:h-[620px]">
            <ProceduralScene />
          </div>
          <div className="space-y-8">
            <h2
              style={{
                fontFamily: "'Newsreader', Georgia, serif",
                fontSize: 'clamp(2rem, 4vw, 4.5rem)',
                fontWeight: 300,
                fontStyle: 'italic',
                color: '#F0EDE8',
                lineHeight: 1.1,
              }}
            >
              Tecnologia que <span style={{ color: '#489FB5' }}>amplifica o cuidado</span>
            </h2>
            {FEATURES.map((f) => (
              <div key={f.num} className="flex gap-6">
                <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#489FB5' }}>{f.num}</div>
                <div>
                  <h3 style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '1.375rem', color: '#F0EDE8' }}>
                    {f.title}
                  </h3>
                  <p style={{ fontSize: '0.9375rem', color: 'rgba(240,237,232,0.5)' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Altura total do wrapper: 1 viewport (headline) + N viewports por feature
  const wrapperHeight = `${(1 + FEATURES.length * VIEWPORTS_PER_FEATURE) * 100}vh`

  return (
    <section
      ref={wrapperRef}
      className="relative"
      style={{
        height: wrapperHeight,
        background: 'linear-gradient(180deg, #04080F 0%, #061220 50%, #04080F 100%)',
      }}
      aria-label="Tecnologia 3D do Estetia"
    >
      {/* Inner sticky container — fica pinado na viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Número seção */}
        <div
          className="absolute top-16 right-[7vw] z-30 text-[10px] tracking-[0.35em] uppercase opacity-30"
          style={{ fontFamily: 'monospace', color: '#489FB5' }}
        >
          03 — 3D Procedural
        </div>

        {/* Progress dots laterais */}
        <div className="absolute left-8 top-1/2 z-30 -translate-y-1/2 flex flex-col gap-3 lg:left-12">
          {FEATURES.map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full transition-all duration-500"
              style={{
                background: i === activeIndex ? '#489FB5' : 'rgba(255,255,255,0.15)',
                transform: i === activeIndex ? 'scale(1.6)' : 'scale(1)',
              }}
            />
          ))}
        </div>

        <div className="mx-auto h-full max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Lado esquerdo: cena R3F (sempre presente, rotaciona conforme scroll via scrollProgress watcher) */}
          <div className="relative h-[400px] lg:h-[600px]">
            <ProceduralScene />
          </div>

          {/* Lado direito: headline + features */}
          <div className="relative space-y-10">
            <div ref={headlineRef}>
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

            <div className="space-y-6">
              {FEATURES.map((f, i) => (
                <div
                  key={f.num}
                  ref={(el) => { featuresRef.current[i] = el }}
                  className="flex gap-6"
                  style={{
                    transition: 'opacity 0.4s ease',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.7rem',
                      color: i === activeIndex ? '#489FB5' : 'rgba(72,159,181,0.4)',
                      letterSpacing: '0.1em',
                      paddingTop: '0.25rem',
                      minWidth: '2rem',
                      transition: 'color 0.4s ease',
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
                        color: i === activeIndex ? '#F0EDE8' : 'rgba(240,237,232,0.55)',
                        marginBottom: '0.375rem',
                        transition: 'color 0.4s ease',
                      }}
                    >
                      {f.title}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.9375rem',
                        color: i === activeIndex ? 'rgba(240,237,232,0.7)' : 'rgba(240,237,232,0.35)',
                        lineHeight: 1.65,
                        fontFamily: "'Newsreader', Georgia, serif",
                        transition: 'color 0.4s ease',
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

        {/* Hint inferior */}
        <div
          className="absolute bottom-8 right-8 z-20 hidden text-[10px] font-bold uppercase tracking-[0.25em] text-white/30 lg:block"
        >
          Continue rolando
        </div>
      </div>
    </section>
  )
}
