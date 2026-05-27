'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, registerGsap } from '@/lib/animation/gsap'

interface PinnedSectionProps {
  /** Quantas viewports de altura o wrapper externo tem (define quanto tempo a seção fica pinada).
   * Ex: 3 = wrapper de 300vh, sticky por ~2 viewports. */
  viewportsTall: number
  /** Identificador legível pra debug e ScrollTrigger. */
  label: string
  /** Conteúdo que renderiza dentro da viewport sticky (h-screen). */
  children: React.ReactNode | ((progress: number, refs: PinnedRefs) => React.ReactNode)
  /** Callback chamado em cada onUpdate do scroll com self.progress (0-1). Útil pra estados externos. */
  onProgress?: (progress: number) => void
  /** Background CSS do wrapper outer (visível atrás do sticky). */
  background?: string
  /** Para reduced-motion: se true, renderiza children sem pin (usa min-h-screen). */
  staticFallback?: boolean
  /** Classe extra para o wrapper outer. */
  className?: string
}

export interface PinnedRefs {
  wrapper: HTMLElement | null
  sticky: HTMLElement | null
}

export function PinnedSection({
  viewportsTall,
  label,
  children,
  onProgress,
  background,
  staticFallback = false,
  className = '',
}: PinnedSectionProps) {
  const wrapperRef = useRef<HTMLElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    if (reducedMotion || staticFallback) return
    if (!wrapperRef.current) return

    registerGsap()

    const st = ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        setProgress(self.progress)
        onProgress?.(self.progress)
      },
    })

    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log(`[PinnedSection:${label}] created`, {
        start: st.start,
        end: st.end,
        wrapperHeight: wrapperRef.current.offsetHeight,
        wrapperOffsetTop: wrapperRef.current.offsetTop,
      })
    }

    const refreshTimers = [
      setTimeout(() => ScrollTrigger.refresh(), 100),
      setTimeout(() => ScrollTrigger.refresh(), 500),
      setTimeout(() => ScrollTrigger.refresh(), 1500),
    ]

    return () => {
      refreshTimers.forEach(clearTimeout)
      st.kill()
    }
  }, [reducedMotion, staticFallback, label, onProgress])

  if (reducedMotion || staticFallback) {
    return (
      <section
        ref={wrapperRef}
        aria-label={label}
        className={`relative min-h-screen ${className}`}
        style={background ? { background } : undefined}
      >
        <div ref={stickyRef} className="min-h-screen w-full">
          {typeof children === 'function'
            ? children(1, { wrapper: wrapperRef.current, sticky: stickyRef.current })
            : children}
        </div>
      </section>
    )
  }

  const wrapperHeight = `${viewportsTall * 100}vh`

  return (
    <section
      ref={wrapperRef}
      aria-label={label}
      data-pinned-section={label}
      className={`relative ${className}`}
      style={{
        height: wrapperHeight,
        ...(background ? { background } : {}),
      }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
        data-pinned-sticky={label}
      >
        {typeof children === 'function'
          ? children(progress, { wrapper: wrapperRef.current, sticky: stickyRef.current })
          : children}
      </div>
    </section>
  )
}
