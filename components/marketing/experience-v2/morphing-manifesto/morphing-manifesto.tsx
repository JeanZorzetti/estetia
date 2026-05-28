'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { watchSection } from '@/lib/animation/anime-scroll'
import { PHRASES, SHAPES } from './shapes-data'
import { ScrambleText } from '../shared/scramble-text'
import { NumberCounter } from '../shared/number-counter'

const VIEWPORTS_TALL = 2

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

  if (shouldReduce) {
    return (
      <section
        id="manifesto"
        aria-label="Manifesto"
        style={{ padding: '6rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '3rem', alignItems: 'center' }}
      >
        {PHRASES.map((p, i) => (
          <div key={i} style={{ maxWidth: '640px', textAlign: 'center' }}>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: p.accent, marginBottom: '0.75rem' }}>
              {p.caption}
            </p>
            <blockquote style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', fontWeight: 300, fontStyle: 'italic', color: '#F0EDE8', margin: '0 0 1rem' }}>
              {p.text}
            </blockquote>
            <div style={{ color: p.metricColor, fontFamily: "'Newsreader', serif", fontSize: '2rem', fontWeight: 300 }}>
              {p.metricPrefix}{p.metric}{p.metricSuffix}
            </div>
            <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.65rem', color: 'rgba(240,237,232,0.5)', letterSpacing: '0.1em' }}>
              {p.metricLabel}
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
      aria-label="Manifesto — formas e frases"
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

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-16 px-10 max-w-5xl w-full">
          {/* SVG Shape */}
          <div className="flex-shrink-0 w-32 h-32 md:w-44 md:h-44">
            <AnimatePresence mode="wait">
              <motion.svg
                key={`shape-${activeIdx}`}
                viewBox="0 0 100 100"
                className="w-full h-full"
                initial={{ opacity: 0, scale: 0.7, rotate: -15 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 1.2, rotate: 15 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <path
                  d={SHAPES[phrase.shape]}
                  fill="none"
                  stroke={phrase.accent}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            </AnimatePresence>
          </div>

          {/* Text + metric */}
          <div className="flex-1 text-center md:text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${activeIdx}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
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
                    fontSize: 'clamp(1.5rem, 3.2vw, 2.6rem)',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    color: '#F0EDE8',
                    lineHeight: 1.3,
                    letterSpacing: '-0.01em',
                    textShadow: '0 0 40px rgba(10,31,61,0.6)',
                    margin: '0 0 1.5rem',
                  }}
                >
                  {phrase.text}
                </blockquote>

                {/* Metric proof card */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.6rem 1.2rem',
                    background: `${phrase.metricColor}12`,
                    border: `1px solid ${phrase.metricColor}30`,
                    borderRadius: '4px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Newsreader', Georgia, serif",
                      fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
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
                      duration={1.4}
                      style={{ color: phrase.metricColor }}
                    />
                  </span>
                  <span
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: '0.65rem',
                      fontWeight: 500,
                      letterSpacing: '0.08em',
                      color: 'rgba(240,237,232,0.5)',
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
