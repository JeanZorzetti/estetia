'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { watchSection } from '@/lib/animation/anime-scroll'
import { PHRASES, type MockupKind } from './shapes-data'
import { ScrambleText } from '../shared/scramble-text'
import { NumberCounter } from '../shared/number-counter'
import { KanbanMockup } from '../shared/kanban-mockup'
import { InboxMockup } from '../shared/inbox-mockup'
import { CalendarMockup } from '../shared/calendar-mockup'
import { ChartMockup } from '../shared/chart-mockup'

const VIEWPORTS_TALL = 2

// Map mockup kind → component
function PhraseMockup({ kind }: { kind: MockupKind }) {
  if (kind === 'kanban') return <KanbanMockup animate />
  if (kind === 'inbox') return <InboxMockup />
  if (kind === 'calendar') return <CalendarMockup />
  return <ChartMockup />
}

export function MorphingManifesto() {
  const wrapperRef = useRef<HTMLElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const prevIdxRef = useRef(0)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const watcher = watchSection(wrapper, (progress) => {
      const segSize = 1 / PHRASES.length
      const idx = Math.min(Math.floor(progress / segSize), PHRASES.length - 1)
      if (idx !== prevIdxRef.current) {
        prevIdxRef.current = idx
        setActiveIdx(idx)
      }
    })

    return () => watcher.destroy()
  }, [])

  const phrase = PHRASES[activeIdx]

  // Reduced-motion: static stack of all phrases
  if (shouldReduce) {
    return (
      <section
        id="manifesto"
        aria-label="Manifesto"
        style={{ padding: '6rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '4rem', alignItems: 'center' }}
      >
        {PHRASES.map((p, i) => (
          <div key={i} style={{ maxWidth: '720px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', textAlign: 'center' }}>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: p.accent, marginBottom: '0.5rem' }}>
              {p.caption}
            </p>
            <blockquote style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', fontWeight: 300, fontStyle: 'italic', color: '#F0EDE8', margin: 0 }}>
              {p.text}
            </blockquote>
            <div style={{ width: '100%', maxWidth: '360px', aspectRatio: '16/10', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(197,160,89,0.15)' }}>
              <PhraseMockup kind={p.mockup} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: p.metricColor, fontFamily: "'Newsreader', serif", fontSize: '1.8rem', fontWeight: 300 }}>
                {p.metricPrefix}{p.metric}{p.metricSuffix}
              </span>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.65rem', color: 'rgba(240,237,232,0.45)' }}>
                {p.metricLabel}
              </span>
            </div>
          </div>
        ))}
      </section>
    )
  }

  return (
    <section
      id="manifesto"
      ref={wrapperRef}
      aria-label="Manifesto — produto em cada frase"
      style={{ height: `${VIEWPORTS_TALL * 100}vh` }}
    >
      <div
        className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden"
        style={{ background: 'transparent' }}
      >
        {/* Section number */}
        <div
          className="absolute top-8 right-8 z-10 text-[10px] tracking-[0.4em] uppercase opacity-30"
          style={{ fontFamily: "'Manrope', sans-serif", color: '#C5A059' }}
        >
          04 — Manifesto
        </div>

        {/* Progress dots */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
          {PHRASES.map((p, i) => (
            <motion.div
              key={i}
              className="rounded-full"
              animate={{
                height: i === activeIdx ? 28 : 6,
                background: i === activeIdx ? p.accent : 'rgba(240,237,232,0.2)',
              }}
              style={{ width: 4 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-14 px-10 max-w-5xl w-full">

          {/* LEFT — product mockup (replaces abstract shapes) */}
          <div
            className="flex-shrink-0 w-full md:w-[44%]"
            style={{ maxWidth: '380px' }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`mockup-${activeIdx}`}
                initial={{ opacity: 0, scale: 0.9, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: `1px solid ${phrase.accent}22`,
                  boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 40px ${phrase.accent}0D`,
                  aspectRatio: '4 / 3',
                }}
              >
                <PhraseMockup kind={phrase.mockup} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT — text + metric */}
          <div className="flex-1 text-center md:text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${activeIdx}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <p
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    color: phrase.accent,
                    marginBottom: '1rem',
                  }}
                >
                  <ScrambleText text={phrase.caption} duration={400} trigger={true} key={`scr-${activeIdx}`} />
                </p>

                <blockquote
                  style={{
                    fontFamily: "'Newsreader', Georgia, serif",
                    fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    color: '#F0EDE8',
                    lineHeight: 1.3,
                    letterSpacing: '-0.01em',
                    margin: '0 0 1.5rem',
                  }}
                >
                  {phrase.text}
                </blockquote>

                {/* Metric — anchored to the mockup above */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.55rem 1rem',
                    background: `${phrase.metricColor}10`,
                    border: `1px solid ${phrase.metricColor}28`,
                    borderRadius: '4px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Newsreader', Georgia, serif",
                      fontSize: 'clamp(1.3rem, 2.8vw, 2rem)',
                      fontWeight: 300,
                      fontStyle: 'italic',
                      color: phrase.metricColor,
                      lineHeight: 1,
                    }}
                  >
                    {phrase.metricPrefix}
                    <NumberCounter
                      key={`metric-${activeIdx}`}
                      value={phrase.metric}
                      suffix={phrase.metricSuffix}
                      duration={1.3}
                      style={{ color: phrase.metricColor }}
                    />
                  </span>
                  <span
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: '0.65rem',
                      fontWeight: 500,
                      letterSpacing: '0.08em',
                      color: 'rgba(240,237,232,0.45)',
                      maxWidth: '100px',
                      lineHeight: 1.3,
                    }}
                  >
                    {phrase.metricLabel}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
