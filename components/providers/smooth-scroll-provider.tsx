'use client'

import { useEffect } from 'react'
import { createLenis, destroyLenis } from '@/lib/animation/lenis'
import { connectScrollTriggerToLenis, ScrollTrigger } from '@/lib/animation/gsap'

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) return

    const lenis = createLenis()
    connectScrollTriggerToLenis(lenis)

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = window.requestAnimationFrame(raf)
    }
    rafId = window.requestAnimationFrame(raf)

    return () => {
      window.cancelAnimationFrame(rafId)
      ScrollTrigger.getAll().forEach((t) => t.kill())
      destroyLenis()
    }
  }, [])

  return <>{children}</>
}
