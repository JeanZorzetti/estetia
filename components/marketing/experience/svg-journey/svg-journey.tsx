'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, registerGsap } from '@/lib/animation/gsap'
import { JOURNEY_STEPS, buildPath } from './journey-data'

const VIEW_W = 800
const VIEW_H = 360

export function SvgJourney() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const dotRefs = useRef<(SVGCircleElement | null)[]>([])
  const labelRefs = useRef<(SVGForeignObjectElement | null)[]>([])
  const [activeStep, setActiveStep] = useState(-1)

  const pathD = buildPath(JOURNEY_STEPS)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setActiveStep(JOURNEY_STEPS.length - 1)
      return
    }

    registerGsap()

    const path = pathRef.current
    if (!path) return

    const totalLength = path.getTotalLength()

    // Inicializar: linha invisível + dots invisíveis
    gsap.set(path, { strokeDasharray: totalLength, strokeDashoffset: totalLength })
    gsap.set(dotRefs.current.filter(Boolean), { scale: 0, transformOrigin: 'center', opacity: 0 })
    gsap.set(labelRefs.current.filter(Boolean), { opacity: 0, y: 12 })

    const wrapperHeight = `${sectionRef.current ? 300 : 300}vh`

    const tl = gsap.timeline({ paused: true })

    // Desenhar a linha
    tl.to(path, {
      strokeDashoffset: 0,
      duration: 5,
      ease: 'none',
    })

    // Revelar cada ponto sequencialmente
    JOURNEY_STEPS.forEach((_, i) => {
      const dot = dotRefs.current[i]
      const label = labelRefs.current[i]
      const position = (i / (JOURNEY_STEPS.length - 1)) * 4.5 // dentro da timeline de 5s

      if (dot) {
        tl.to(dot, {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          ease: 'back.out(1.8)',
          onStart: () => setActiveStep(i),
        }, position)
      }
      if (label) {
        tl.to(label, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power3.out',
        }, position + 0.1)
      }
    })

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 20%',
      end: 'bottom 80%',
      scrub: 1,
      animation: tl,
    })

    const refreshTimers = [
      setTimeout(() => ScrollTrigger.refresh(), 100),
      setTimeout(() => ScrollTrigger.refresh(), 500),
      setTimeout(() => ScrollTrigger.refresh(), 1500),
    ]

    return () => {
      refreshTimers.forEach(clearTimeout)
      tl.kill()
    }
  }, [])

  const activeData = activeStep >= 0 ? JOURNEY_STEPS[activeStep] : null

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: '250vh', background: 'linear-gradient(180deg, #04080F 0%, #07112A 50%, #04080F 100%)' }}
    >
      {/* Número seção */}
      <div
        className="absolute top-16 left-[7vw] text-[10px] tracking-[0.35em] uppercase opacity-30"
        style={{ fontFamily: 'monospace', color: '#C5A059' }}
      >
        04 — Jornada do Paciente
      </div>

      <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-6">
        {/* Headline */}
        <div className="text-center mb-12 max-w-2xl">
          <h2
            style={{
              fontFamily: "'Newsreader', Georgia, serif",
              fontSize: 'clamp(2rem, 4.5vw, 4rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: '#F0EDE8',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            Cada paciente tem uma{' '}
            <span style={{ color: '#C5A059' }}>história</span>
          </h2>
        </div>

        {/* SVG Journey */}
        <div className="w-full max-w-4xl">
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="w-full"
            style={{ overflow: 'visible' }}
          >
            {/* Grid de fundo sutil */}
            <defs>
              <pattern id="svg-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width={VIEW_W} height={VIEW_H} fill="url(#svg-grid)" rx="8" />

            {/* Trilha de fundo (linha guia esmaecida) */}
            <path
              d={pathD}
              fill="none"
              stroke="rgba(197,160,89,0.1)"
              strokeWidth="2"
              strokeDasharray="6 4"
            />

            {/* Linha animada principal */}
            <path
              ref={pathRef}
              d={pathD}
              fill="none"
              stroke="#C5A059"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Pontos e labels */}
            {JOURNEY_STEPS.map((step, i) => (
              <g key={step.id}>
                {/* Anel externo */}
                <circle
                  cx={step.x}
                  cy={step.y}
                  r="16"
                  fill="rgba(197,160,89,0.08)"
                  stroke="rgba(197,160,89,0.2)"
                  strokeWidth="1"
                />

                {/* Ponto central */}
                <circle
                  ref={(el) => { dotRefs.current[i] = el }}
                  cx={step.x}
                  cy={step.y}
                  r="6"
                  fill={i === activeStep ? '#C5A059' : '#4A3A1A'}
                  stroke="#C5A059"
                  strokeWidth="2"
                />

                {/* Label */}
                <foreignObject
                  ref={(el) => { labelRefs.current[i] = el }}
                  x={step.x - 60}
                  y={step.y + 22}
                  width="120"
                  height="70"
                  style={{ overflow: 'visible' }}
                >
                  <div
                    style={{
                      textAlign: 'center',
                      fontFamily: "'Newsreader', Georgia, serif",
                      fontSize: '0.75rem',
                      color: i === activeStep ? '#C5A059' : 'rgba(240,237,232,0.5)',
                      fontWeight: 400,
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {step.label}
                  </div>
                </foreignObject>
              </g>
            ))}
          </svg>
        </div>

        {/* Descrição do step ativo */}
        <div
          className="mt-8 text-center max-w-md min-h-[3rem]"
          style={{ transition: 'opacity 0.4s ease' }}
        >
          {activeData && (
            <p
              style={{
                fontFamily: "'Newsreader', Georgia, serif",
                fontSize: '1rem',
                color: 'rgba(240,237,232,0.5)',
                fontStyle: 'italic',
              }}
            >
              {activeData.description}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
