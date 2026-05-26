'use client'

import { forwardRef, useEffect, useRef } from 'react'
import { gsap } from '@/lib/animation/gsap'
import { getLenis } from '@/lib/animation/lenis'

type Props = {
  label?: string
}

export const ScrollIndicator = forwardRef<HTMLDivElement, Props>(function ScrollIndicator(
  { label = 'Role para descobrir' },
  ref,
) {
  const internalRef = useRef<HTMLDivElement>(null)
  const setRefs = (node: HTMLDivElement | null) => {
    internalRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }
  const hiddenRef = useRef(false)

  useEffect(() => {
    const lenis = getLenis()

    const handleScroll = (y: number) => {
      if (hiddenRef.current) return
      if (y > 80) {
        hiddenRef.current = true
        if (internalRef.current) {
          gsap.to(internalRef.current, {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.out',
            onComplete: () => {
              if (internalRef.current) internalRef.current.style.pointerEvents = 'none'
            },
          })
        }
      }
    }

    if (lenis) {
      const onLenisScroll = ({ scroll }: { scroll: number }) => handleScroll(scroll)
      lenis.on('scroll', onLenisScroll)
      return () => {
        lenis.off('scroll', onLenisScroll)
      }
    }

    const onWindowScroll = () => handleScroll(window.scrollY)
    window.addEventListener('scroll', onWindowScroll, { passive: true })
    return () => window.removeEventListener('scroll', onWindowScroll)
  }, [])

  const handleClick = () => {
    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(window.innerHeight, { duration: 1.5 })
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
    }
  }

  return (
    <div
      ref={setRefs}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
    >
      <button
        type="button"
        onClick={handleClick}
        aria-label="Rolar para próxima seção"
        className="group flex h-11 w-7 items-start justify-center rounded-full border border-white/40 pt-2 transition-colors hover:border-[#C5A059]"
      >
        <span className="block h-2 w-[3px] rounded-full bg-white/80 animate-[scrollDot_1.8s_cubic-bezier(0.4,0,0.2,1)_infinite] group-hover:bg-[#C5A059]" />
      </button>
      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">
        {label}
      </span>

      <style jsx>{`
        @keyframes scrollDot {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          100% {
            transform: translateY(14px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
})
