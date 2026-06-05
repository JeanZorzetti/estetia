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

// Routes that actually have scroll-driven (GSAP ScrollTrigger) animations and
// therefore benefit from Lenis. Everywhere else — the landing, pricing, blog,
// dashboard — native scroll is used and Lenis+GSAP (~111KB) is never fetched,
// keeping it off the critical path entirely (the dynamic import below only runs
// for these paths). PageSpeed flagged this JS as the #2 source of TBT.
// NOTE: /experiencev2 is intentionally excluded — it ships its own Lenis provider
// (components/marketing/experience-v2/shared/lenis-provider.tsx) and would double-init.
const SMOOTH_SCROLL_PATHS = ['/experience', '/design-system/hero-cinematic']

function pathNeedsSmoothScroll(pathname: string): boolean {
  return SMOOTH_SCROLL_PATHS.some(
    (p) => pathname === p || pathname.endsWith(p) || pathname.includes(`${p}/`)
  )
}

function SmoothScrollActivator() {
  const pathname = usePathname()

  useEffect(() => {
    // Only load Lenis+GSAP on routes with real scroll-driven animations.
    // The landing has none (no ScrollTrigger), so this stays a no-op there and
    // the heavy animation chunk is never requested.
    if (!pathNeedsSmoothScroll(pathname)) return

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
