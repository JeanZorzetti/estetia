'use client'

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  /** Delay before the reveal animation starts, in ms (for staggering siblings). */
  delay?: number
  /** Render as a different element (default: div). */
  as?: ElementType
  className?: string
  /** Extra inline styles merged with the transition delay. */
  style?: React.CSSProperties
  /** rootMargin for the IntersectionObserver (default mirrors framer's -100px). */
  rootMargin?: string
} & Record<string, unknown>

/**
 * Lightweight scroll-reveal (fade + slide-up) using IntersectionObserver + CSS.
 *
 * Replaces framer-motion's `whileInView` (which pulled ~131KB of JS onto the
 * landing's critical path and was the #2 source of TBT on PageSpeed). This adds
 * roughly nothing to the bundle.
 *
 * SSR-safe: content renders fully visible on the server and stays visible if JS
 * never runs or the user prefers reduced motion — so it never hides text from
 * crawlers, never causes CLS, and never delays the LCP element. The hidden →
 * shown transition is only armed on the client, after mount, for elements that
 * have not yet entered the viewport.
 */
export function Reveal({
  children,
  delay = 0,
  as,
  className = '',
  style,
  rootMargin = '0px 0px -100px 0px',
  ...rest
}: RevealProps) {
  // Polymorphic tag — typed as `any` for rendering because the union of every
  // intrinsic element's props is too wide for TS to reconcile with a spread.
  const TagAny = (as ?? 'div') as any
  const ref = useRef<HTMLElement | null>(null)
  // armed = JS mounted and we intend to animate (element not yet revealed)
  const [armed, setArmed] = useState(false)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReducedMotion) return

    // If it's already in view on mount (above the fold), don't hide it — just
    // reveal immediately to avoid a pointless flash.
    const rect = el.getBoundingClientRect()
    const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0
    if (alreadyVisible) {
      setShown(true)
      return
    }

    setArmed(true)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true)
            observer.disconnect()
            break
          }
        }
      },
      { rootMargin }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin])

  const revealState = !armed ? 'idle' : shown ? 'in' : 'out'

  return (
    <TagAny
      ref={ref}
      data-reveal={revealState}
      className={className}
      style={delay ? { ...style, transitionDelay: `${delay}ms` } : style}
      {...rest}
    >
      {children}
    </TagAny>
  )
}
