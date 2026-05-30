'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { createLenis, destroyLenis } from '@/lib/animation/lenis'
import {
  connectScrollTriggerToLenis,
  disconnectScrollTriggerFromLenis,
  ScrollTrigger,
} from '@/lib/animation/gsap'

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    // Lenis intercepts html/body scroll — incompatible with dashboard's internal overflow-y-auto layout
    if (pathname.startsWith('/dashboard') || pathname.includes('/dashboard')) {
      destroyLenis()
      // Clear any overflow styles Lenis may have set on html/body when navigating to dashboard
      if (typeof document !== 'undefined') {
        document.documentElement.style.removeProperty('overflow')
        document.body.style.removeProperty('overflow')
      }
      return
    }

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
  }, [pathname])

  return <>{children}</>
}
