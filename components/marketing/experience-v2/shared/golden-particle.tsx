'use client'

import { useEffect, useRef } from 'react'
import { animate } from 'animejs'

interface GoldenParticleProps {
  // 'hero-enter': particle spawns at headline center and drifts
  // 'hero-exit': particle flies downward as user scrolls out of hero
  // 'manifesto-enter': particle zooms into shape
  // 'journey': particle travels the path (handled inside TimelineJourney)
  // 'wave-trigger': particle drops and explodes into wave
  phase: 'hero-enter' | 'hero-exit' | 'manifesto-enter'
  scrollProgress?: number
}

// Shared motif: a ~6px glowing gold circle that transitions between sections
export function GoldenParticle({ phase, scrollProgress = 0 }: GoldenParticleProps) {
  const dotRef = useRef<HTMLDivElement>(null)
  const prevPhase = useRef<string>('')

  useEffect(() => {
    const dot = dotRef.current
    if (!dot) return
    if (prevPhase.current === phase) return
    prevPhase.current = phase

    if (phase === 'hero-enter') {
      animate(dot, {
        opacity: [0, 1],
        scale: [0, 1],
        duration: 600,
        ease: 'outExpo',
        delay: 900,
      })
    } else if (phase === 'hero-exit') {
      animate(dot, {
        opacity: [1, 0],
        translateY: [0, 60],
        scale: [1, 0.3],
        duration: 400,
        ease: 'inExpo',
      })
    } else if (phase === 'manifesto-enter') {
      animate(dot, {
        opacity: [0, 1],
        scale: [2, 1],
        translateY: [-40, 0],
        duration: 500,
        ease: 'outBack(1.6)',
      })
    }
  }, [phase])

  // On hero-exit, drive translateY by scroll (smooth handoff)
  useEffect(() => {
    const dot = dotRef.current
    if (!dot || phase !== 'hero-exit') return
    const progress = Math.max(0, Math.min(1, (scrollProgress - 0.75) / 0.25))
    dot.style.opacity = String(1 - progress)
    dot.style.transform = `translateY(${progress * 80}px) scale(${1 - progress * 0.7})`
  }, [scrollProgress, phase])

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: '#C5A059',
        boxShadow: '0 0 12px 3px rgba(197,160,89,0.7), 0 0 24px 6px rgba(197,160,89,0.3)',
        pointerEvents: 'none',
        opacity: 0,
        zIndex: 20,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    />
  )
}
