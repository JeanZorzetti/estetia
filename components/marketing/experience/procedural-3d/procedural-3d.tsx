'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { PinnedSection } from '../pinned-section'

const ProceduralScene = dynamic(() => import('./procedural-scene'), { ssr: false })

const FEATURES = [
  { num: '01', title: 'Pipeline visual', desc: 'Kanban clínico que reflete cada etapa da jornada do paciente.' },
  { num: '02', title: 'Prontuário digital', desc: 'Anamneses, evoluções e fotos organizados em um único lugar.' },
  { num: '03', title: 'IA integrada', desc: 'Sugestões automáticas e insights preditivos sobre retorno.' },
]

export function Procedural3D() {
  const [progress, setProgress] = useState(0)

  // Progress (0-1) mapeia headline (0-0.25) + cada feature (0.25-0.5, 0.5-0.75, 0.75-1)
  const headlineOpacity = Math.min(1, progress / 0.2)
  const headlineY = (1 - headlineOpacity) * 30

  function featureState(idx: number) {
    const start = 0.25 + idx * 0.22
    const end = start + 0.18
    const p = Math.max(0, Math.min(1, (progress - start) / (end - start)))
    return { opacity: p, x: (1 - p) * -40 }
  }

  const activeIndex = progress < 0.25 ? -1
    : progress < 0.47 ? 0
    : progress < 0.69 ? 1
    : 2

  return (
    <PinnedSection
      label="Tecnologia 3D do Estetia"
      viewportsTall={4.5}
      background="linear-gradient(180deg, #04080F 0%, #061220 50%, #04080F 100%)"
      onProgress={setProgress}
    >
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
        {/* Lado esquerdo: cena R3F (rotaciona conforme progress) */}
        <div className="relative h-[400px] lg:h-[600px]">
          <ProceduralScene externalProgress={progress} />
        </div>

        {/* Lado direito */}
        <div className="relative space-y-10">
          <div
            style={{
              opacity: headlineOpacity,
              transform: `translateY(${headlineY}px)`,
              transition: 'opacity 0.15s, transform 0.15s',
            }}
          >
            <div className="h-[2px] w-12 mb-6" style={{ background: '#489FB5' }} />
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
            {FEATURES.map((f, i) => {
              const s = featureState(i)
              return (
                <div
                  key={f.num}
                  className="flex gap-6"
                  style={{
                    opacity: s.opacity,
                    transform: `translateX(${s.x}px)`,
                    transition: 'opacity 0.15s, transform 0.15s',
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
              )
            })}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 z-20 hidden text-[10px] font-bold uppercase tracking-[0.25em] text-white/30 lg:block">
        Continue rolando
      </div>
    </PinnedSection>
  )
}
