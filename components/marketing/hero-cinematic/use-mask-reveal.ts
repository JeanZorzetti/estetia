'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/animation/gsap'

export type RevealRefs = {
  badge: HTMLElement | null
  titleLines: HTMLElement[]
  subtitle: HTMLElement | null
  ctas: HTMLElement | null
  indicator: HTMLElement | null
}

export function useHeroReveal() {
  const refs = useRef<RevealRefs>({
    badge: null,
    titleLines: [],
    subtitle: null,
    ctas: null,
    indicator: null,
  })

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const {
      badge,
      titleLines,
      subtitle,
      ctas,
      indicator,
    } = refs.current

    const ctaChildren = ctas ? Array.from(ctas.children) : []

    if (prefersReducedMotion) {
      gsap.set([badge, subtitle, indicator, ...ctaChildren].filter(Boolean), { opacity: 1, y: 0 })
      titleLines.forEach((inner) => gsap.set(inner, { yPercent: 0 }))
      return
    }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    if (badge) {
      gsap.set(badge, { opacity: 0, y: 12 })
      tl.to(badge, { opacity: 1, y: 0, duration: 0.6 }, 0)
    }

    titleLines.forEach((inner, idx) => {
      gsap.set(inner, { yPercent: 100 })
      tl.to(inner, { yPercent: 0, duration: 1.0 }, 0.3 + idx * 0.1)
    })

    if (subtitle) {
      gsap.set(subtitle, { opacity: 0, y: 20 })
      tl.to(subtitle, { opacity: 1, y: 0, duration: 0.8 }, 0.8)
    }

    if (ctas && ctaChildren.length) {
      gsap.set(ctaChildren, { opacity: 0, y: 16 })
      tl.to(ctaChildren, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 1.0)
    }

    if (indicator) {
      gsap.set(indicator, { opacity: 0 })
      tl.to(indicator, { opacity: 1, duration: 0.5 }, 1.4)
    }

    return () => {
      tl.kill()
    }
  }, [])

  return refs
}
