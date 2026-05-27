'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, morphTo } from 'animejs'
import { watchSection } from '@/lib/animation/anime-scroll'
import { PHRASES, SHAPES } from './shapes-data'

const VIEWPORTS_TALL = 4

export function MorphingManifesto() {
  const wrapperRef = useRef<HTMLElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const prevIdxRef = useRef(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
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

  // Morph SVG shape whenever activeIdx changes
  useEffect(() => {
    const path = pathRef.current
    if (!path) return
    const nextShape = SHAPES[PHRASES[activeIdx].shape]

    animate(path, {
      d: morphTo(nextShape),
      duration: 600,
      ease: 'inOutExpo',
    })
  }, [activeIdx])

  const phrase = PHRASES[activeIdx]

  return (
    <section
      ref={wrapperRef}
      aria-label="Manifesto — formas e frases"
      style={{ height: `${VIEWPORTS_TALL * 100}vh` }}
    >
      <div
        className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #04080F 0%, #040C18 100%)' }}
      >
        {/* Section number */}
        <div
          className="absolute top-8 right-8 z-10 text-[10px] tracking-[0.4em] uppercase opacity-30"
          style={{ fontFamily: 'monospace', color: '#C5A059' }}
        >
          02 — Morfose
        </div>

        {/* Progress dots */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-3">
          {PHRASES.map((_, i) => (
            <div
              key={i}
              className="w-1 rounded-full transition-all duration-500"
              style={{
                height: i === activeIdx ? '28px' : '6px',
                background: i === activeIdx ? PHRASES[i].accent : 'rgba(240,237,232,0.2)',
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 md:gap-20 px-8 max-w-5xl w-full">
          {/* SVG Shape */}
          <div className="flex-shrink-0 w-40 h-40 md:w-56 md:h-56">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path
                ref={pathRef}
                d={SHAPES[PHRASES[0].shape]}
                fill="none"
                stroke={phrase.accent}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transition: 'stroke 600ms ease' }}
              />
            </svg>
          </div>

          {/* Text content */}
          <div className="flex-1 text-center md:text-left">
            <p
              key={activeIdx}
              style={{
                fontFamily: 'monospace',
                fontSize: '0.7rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: phrase.accent,
                marginBottom: '1rem',
                animation: 'fade-in 400ms ease forwards',
              }}
            >
              {phrase.caption}
            </p>

            <blockquote
              key={`q-${activeIdx}`}
              style={{
                fontFamily: "'Newsreader', Georgia, serif",
                fontSize: 'clamp(1.6rem, 3.5vw, 3rem)',
                fontWeight: 300,
                fontStyle: 'italic',
                color: '#F0EDE8',
                lineHeight: 1.3,
                letterSpacing: '-0.01em',
                animation: 'slide-up 500ms ease forwards',
              }}
            >
              {phrase.text}
            </blockquote>
          </div>
        </div>

        <style>{`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slide-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </section>
  )
}
