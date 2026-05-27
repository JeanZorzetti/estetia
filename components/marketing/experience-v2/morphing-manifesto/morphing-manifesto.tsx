'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { watchSection } from '@/lib/animation/anime-scroll'
import { PHRASES, SHAPES } from './shapes-data'
import { ScrambleText } from '../shared/scramble-text'

const VIEWPORTS_TALL = 4

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

  return (
    <section
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
          03 — Morfose
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

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 md:gap-20 px-8 max-w-5xl w-full">
          {/* SVG Shape — morphs via AnimatePresence */}
          <div className="flex-shrink-0 w-40 h-40 md:w-56 md:h-56">
            <AnimatePresence mode="wait">
              <motion.svg
                key={`shape-${activeIdx}`}
                viewBox="0 0 100 100"
                className="w-full h-full"
                initial={shouldReduce ? false : { opacity: 0, scale: 0.7, rotate: -15 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={shouldReduce ? undefined : { opacity: 0, scale: 1.2, rotate: 15 }}
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

          {/* Text content */}
          <div className="flex-1 text-center md:text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${activeIdx}`}
                initial={shouldReduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduce ? undefined : { opacity: 0, y: -12 }}
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
                    fontSize: 'clamp(1.6rem, 3.5vw, 3rem)',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    color: '#F0EDE8',
                    lineHeight: 1.3,
                    letterSpacing: '-0.01em',
                    textShadow: '0 0 40px rgba(10,31,61,0.6)',
                    margin: 0,
                  }}
                >
                  {phrase.text}
                </blockquote>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
