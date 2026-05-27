'use client'

import { useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'
import { watchSection } from '@/lib/animation/anime-scroll'
import { JOURNEY_STEPS, buildPath } from '@/components/marketing/experience/svg-journey/journey-data'

const VIEWPORTS_TALL = 3
const VW = 800
const VH = 360

const PATH_D = buildPath(JOURNEY_STEPS)

export function TimelineJourney() {
  const wrapperRef = useRef<HTMLElement>(null)
  const lineRef = useRef<SVGPathElement>(null)
  const dotRefs = useRef<(SVGCircleElement | null)[]>([])
  const labelRefs = useRef<(SVGForeignObjectElement | null)[]>([])
  const particleRef = useRef<SVGCircleElement>(null)
  const hasSetup = useRef(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const wrapper = wrapperRef.current
    const line = lineRef.current
    if (!wrapper || !line) return

    // Measure total path length for stroke animation
    const totalLength = line.getTotalLength()
    line.style.strokeDasharray = String(totalLength)
    line.style.strokeDashoffset = String(totalLength)

    // Hide dots and labels initially
    dotRefs.current.forEach(d => { if (d) d.style.opacity = '0' })
    labelRefs.current.forEach(l => { if (l) l.style.opacity = '0' })
    if (particleRef.current) particleRef.current.style.opacity = '0'

    const watcher = watchSection(wrapper, (progress) => {
      if (!hasSetup.current && progress > 0.01) {
        hasSetup.current = true
      }

      // Line drawing
      const lineProgress = Math.min(progress * 2, 1)
      line.style.strokeDashoffset = String(totalLength * (1 - lineProgress))

      // Dots reveal staggered by position along line
      JOURNEY_STEPS.forEach((step, i) => {
        const dotThreshold = 0.2 + (i / (JOURNEY_STEPS.length - 1)) * 0.6
        const dot = dotRefs.current[i]
        const label = labelRefs.current[i]
        if (!dot || !label) return
        const revealed = progress > dotThreshold
        dot.style.opacity = revealed ? '1' : '0'
        dot.style.transform = revealed ? 'scale(1)' : 'scale(0)'
        label.style.opacity = revealed ? '1' : '0'
      })

      // Particle position along path
      const particle = particleRef.current
      if (particle && lineProgress > 0.05) {
        particle.style.opacity = lineProgress < 0.95 ? '1' : '0'
        const pt = line.getPointAtLength(totalLength * lineProgress * 0.98)
        particle.setAttribute('cx', String(pt.x))
        particle.setAttribute('cy', String(pt.y))
      }
    })

    return () => watcher.destroy()
  }, [])

  return (
    <section
      ref={wrapperRef}
      aria-label="Jornada do paciente"
      style={{ height: `${VIEWPORTS_TALL * 100}vh` }}
    >
      <div
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #040C18 0%, #04080F 100%)' }}
      >
        {/* Section number */}
        <div
          className="absolute top-8 right-8 z-10 text-[10px] tracking-[0.4em] uppercase opacity-30"
          style={{ fontFamily: 'monospace', color: '#C5A059' }}
        >
          03 — Jornada
        </div>

        {/* Title */}
        <div className="relative z-10 text-center mb-8 px-6">
          <p
            style={{
              fontFamily: 'monospace',
              fontSize: '0.65rem',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: '#C5A059',
              opacity: 0.7,
              marginBottom: '0.75rem',
            }}
          >
            Do lead ao embaixador
          </p>
          <h2
            style={{
              fontFamily: "'Newsreader', Georgia, serif",
              fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: '#F0EDE8',
              letterSpacing: '-0.02em',
            }}
          >
            A jornada completa do paciente
          </h2>
        </div>

        {/* SVG Journey */}
        <div className="relative z-10 w-full max-w-3xl px-4">
          <svg
            viewBox={`0 0 ${VW} ${VH}`}
            className="w-full"
            style={{ overflow: 'visible' }}
          >
            {/* Main path */}
            <path
              ref={lineRef}
              d={PATH_D}
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* Gradient def */}
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C5A059" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#489FB5" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Dots */}
            {JOURNEY_STEPS.map((step, i) => (
              <circle
                key={step.id}
                ref={el => { dotRefs.current[i] = el }}
                cx={step.x}
                cy={step.y}
                r="5"
                fill={i === 0 || i === JOURNEY_STEPS.length - 1 ? '#C5A059' : '#489FB5'}
                style={{
                  transition: 'opacity 300ms ease, transform 400ms cubic-bezier(0.34,1.56,0.64,1)',
                  transformOrigin: `${step.x}px ${step.y}px`,
                  opacity: 0,
                }}
              />
            ))}

            {/* Labels */}
            {JOURNEY_STEPS.map((step, i) => (
              <foreignObject
                key={`label-${step.id}`}
                ref={el => { labelRefs.current[i] = el }}
                x={step.x - 60}
                y={step.y < VH / 2 ? step.y - 52 : step.y + 16}
                width="120"
                height="50"
                style={{
                  transition: 'opacity 400ms ease',
                  opacity: 0,
                  overflow: 'visible',
                }}
              >
                <div
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '9px',
                    letterSpacing: '0.08em',
                    textAlign: 'center',
                    lineHeight: 1.4,
                  }}
                >
                  <div style={{ color: '#C5A059', textTransform: 'uppercase', marginBottom: '2px' }}>
                    {step.label}
                  </div>
                  <div style={{ color: 'rgba(240,237,232,0.4)', fontSize: '8px' }}>
                    {step.description}
                  </div>
                </div>
              </foreignObject>
            ))}

            {/* Travelling particle */}
            <circle
              ref={particleRef}
              cx={JOURNEY_STEPS[0].x}
              cy={JOURNEY_STEPS[0].y}
              r="4"
              fill="#C5A059"
              style={{
                opacity: 0,
                filter: 'drop-shadow(0 0 4px #C5A059)',
              }}
            />
          </svg>
        </div>
      </div>
    </section>
  )
}
