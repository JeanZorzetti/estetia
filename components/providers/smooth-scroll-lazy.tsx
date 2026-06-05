'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Activates smooth scroll (Lenis + GSAP ScrollTrigger) WITHOUT keeping its bundle on
// the critical path. The children render normally (SSR), and the heavy animation libs
// are imported only after mount via dynamic import, so they never block the LCP paint
// nor cause forced reflow during initial render. The landing has no scroll-driven
// animations, so this is purely additive once it loads.
export function SmoothScrollLazy({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SmoothScrollActivator />
    </>
  )
}

function SmoothScrollActivator() {
  const pathname = usePathname()

  useEffect(() => {
    // Lenis intercepts html/body scroll — incompatible with dashboard's internal
    // overflow-y-auto layout.
    if (pathname.includes('/dashboard')) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReducedMotion) return

    let cleanup: (() => void) | undefined
    let cancelled = false

    // Dynamic import keeps Lenis/GSAP out of the initial chunk (gsap is ~6MB in
    // node_modules; importing it eagerly bloated the landing's critical JS).
    Promise.all([
      import('@/lib/animation/lenis'),
      import('@/lib/animation/gsap'),
    ]).then(([lenisMod, gsapMod]) => {
      if (cancelled) return
      const lenis = lenisMod.createLenis()
      gsapMod.connectScrollTriggerToLenis(lenis)
      cleanup = () => {
        gsapMod.disconnectScrollTriggerFromLenis()
        gsapMod.ScrollTrigger.getAll().forEach((t) => t.kill())
        lenisMod.destroyLenis()
      }
    })

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [pathname])

  return null
}
