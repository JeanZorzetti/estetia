'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, registerGsap } from '@/lib/animation/gsap'
import { stations } from './pin-features/stations-data'
import { StationContent } from './pin-features/station-content'
import { StationVisual } from './pin-features/station-visual'
import { ProgressRail } from './pin-features/progress-rail'

const STATIONS_COUNT = stations.length
const VIEWPORTS_PER_STATION = 1.5

export function PinFeatures() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const stagesRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    if (!wrapperRef.current || !stagesRef.current) return

    registerGsap()

    const ctx = gsap.context(() => {
      const stages = Array.from(stagesRef.current!.children) as HTMLElement[]

      stages.forEach((stage, idx) => {
        const elements = stage.querySelectorAll<HTMLElement>('[data-station-element]')
        const visual = stage.querySelector<HTMLElement>('[data-station-visual]')
        if (idx === 0) {
          gsap.set(stage, { autoAlpha: 1 })
        } else {
          gsap.set(stage, { autoAlpha: 0 })
          gsap.set(elements, { autoAlpha: 0, y: 40 })
          if (visual) gsap.set(visual, { autoAlpha: 0, x: 60 })
        }
      })

      const PHASE_LENGTH = 3
      const HOLD = 1.5
      const FADE_OUT = 0.6
      const REVEAL = 1.0
      const STAGGER = 0.2

      const master = gsap.timeline({ paused: true })

      const st = ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
        invalidateOnRefresh: true,
        animation: master,
        markers: true,
        onUpdate: (self) => {
          const idx = Math.min(STATIONS_COUNT - 1, Math.floor(self.progress * STATIONS_COUNT))
          setActiveIndex(idx)
        },
      })

      if (typeof window !== 'undefined') {
        ;(window as unknown as { __pinST: typeof st }).__pinST = st
      }

      master.to({}, { duration: HOLD })

      stages.forEach((stage, idx) => {
        if (idx === 0) return

        const prev = stages[idx - 1]
        const prevElements = prev.querySelectorAll<HTMLElement>('[data-station-element]')
        const prevVisual = prev.querySelector<HTMLElement>('[data-station-visual]')
        const elements = stage.querySelectorAll<HTMLElement>('[data-station-element]')
        const visual = stage.querySelector<HTMLElement>('[data-station-visual]')

        const phase = idx * PHASE_LENGTH

        master.to(
          prevElements,
          { autoAlpha: 0, y: -40, duration: FADE_OUT, ease: 'power3.out' },
          phase,
        )
        if (prevVisual) {
          master.to(
            prevVisual,
            { autoAlpha: 0, x: -60, duration: FADE_OUT, ease: 'power3.out' },
            phase,
          )
        }
        master.set(prev, { autoAlpha: 0 }, phase + FADE_OUT)
        master.set(stage, { autoAlpha: 1 }, phase + FADE_OUT)

        master.to(
          elements,
          {
            autoAlpha: 1,
            y: 0,
            duration: REVEAL,
            ease: 'power3.out',
            stagger: STAGGER,
          },
          phase + FADE_OUT,
        )
        if (visual) {
          master.to(
            visual,
            { autoAlpha: 1, x: 0, duration: REVEAL, ease: 'power3.out' },
            phase + FADE_OUT + STAGGER * 3,
          )
        }

        master.to({}, { duration: HOLD }, `>`)
      })
    }, wrapperRef)

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)

    return () => {
      clearTimeout(refreshTimer)
      ctx.revert()
    }
  }, [reducedMotion])

  if (reducedMotion) {
    return (
      <section className="bg-[#0A1F3D] text-white">
        {stations.map((station) => (
          <article key={station.id} className="flex min-h-screen items-center px-8 py-24">
            <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 lg:grid-cols-2">
              <StationContent station={station} totalStations={stations.length} />
              <div>
                <StationVisual id={station.id} />
              </div>
            </div>
          </article>
        ))}
      </section>
    )
  }

  const wrapperHeight = `${STATIONS_COUNT * VIEWPORTS_PER_STATION * 100}vh`

  return (
    <section
      ref={wrapperRef}
      className="relative bg-[#0A1F3D] text-white"
      style={{ height: wrapperHeight }}
      aria-label="Tour de funcionalidades do Estetia"
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
      >
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="absolute left-8 top-1/2 z-20 -translate-y-1/2 lg:left-12">
          <ProgressRail total={stations.length} activeIndex={activeIndex} />
        </div>

        <div
          ref={stagesRef}
          className="relative z-10 grid h-full w-full place-items-center px-8 lg:px-20"
        >
          {stations.map((station) => (
            <article
              key={station.id}
              className="grid place-items-center px-8 lg:px-20"
              style={{ gridArea: '1 / 1' }}
            >
              <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
                <StationContent station={station} totalStations={stations.length} />
                <div data-station-visual>
                  <StationVisual id={station.id} />
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="absolute bottom-8 right-8 z-20 hidden text-[10px] font-bold uppercase tracking-[0.25em] text-white/40 lg:block">
          Continue rolando
        </div>
      </div>
    </section>
  )
}
