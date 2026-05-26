'use client'

import { useEffect } from 'react'
import { createLenis, destroyLenis } from '@/lib/animation/lenis'
import {
  connectScrollTriggerToLenis,
  disconnectScrollTriggerFromLenis,
  ScrollTrigger,
} from '@/lib/animation/gsap'

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) return

    const lenis = createLenis()
    connectScrollTriggerToLenis(lenis)

    return () => {
      disconnectScrollTriggerFromLenis()
      ScrollTrigger.getAll().forEach((t) => t.kill())
      destroyLenis()
    }
  }, [])

  return <>{children}</>
}
