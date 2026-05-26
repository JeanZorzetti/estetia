'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '@/lib/animation/gsap'
import { stations } from './pin-features/stations-data'
import { StationContent } from './pin-features/station-content'
import { StationVisual } from './pin-features/station-visual'
import { ProgressRail } from './pin-features/progress-rail'

export function PinFeatures() {
  const sectionRef = useRef<HTMLElement>(null)
  const stagesRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    if (!sectionRef.current || !stagesRef.current) return

    const ctx = gsap.context(() => {
      const stages = Array.from(stagesRef.current!.children) as HTMLElement[]

      stages.forEach((stage, idx) => {
        if (idx === 0) {
          gsap.set(stage, { autoAlpha: 1 })
        } else {
          gsap.set(stage, { autoAlpha: 0 })
        }
        const elements = stage.querySelectorAll<HTMLElement>('[data-station-element]')
        const visual = stage.querySelector<HTMLElement>('[data-station-visual]')
        if (idx > 0) {
          gsap.set(elements, { autoAlpha: 0, y: 40 })
          if (visual) gsap.set(visual, { autoAlpha: 0, x: 60 })
        }
      })

      const master = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=400%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress
            const idx = Math.min(stations.length - 1, Math.floor(progress * stations.length))
            setActiveIndex(idx)
          },
        },
      })

      stages.forEach((stage, idx) => {
        if (idx === 0) return

        const prev = stages[idx - 1]
        const prevElements = prev.querySelectorAll<HTMLElement>('[data-station-element]')
        const prevVisual = prev.querySelector<HTMLElement>('[data-station-visual]')
        const elements = stage.querySelectorAll<HTMLElement>('[data-station-element]')
        const visual = stage.querySelector<HTMLElement>('[data-station-visual]')

        const phase = idx
        master.addLabel(`station-${idx}`, phase)

        master.to(
          prevElements,
          { autoAlpha: 0, y: -40, duration: 0.4, ease: 'power3.out' },
          phase,
        )
        if (prevVisual) {
          master.to(
            prevVisual,
            { autoAlpha: 0, x: -60, duration: 0.4, ease: 'power3.out' },
            phase,
          )
        }
        master.set(prev, { autoAlpha: 0 }, phase + 0.4)
        master.set(stage, { autoAlpha: 1 }, phase + 0.4)

        master.to(
          elements,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.2,
          },
          phase + 0.4,
        )
        if (visual) {
          master.to(
            visual,
            { autoAlpha: 1, x: 0, duration: 0.8, ease: 'power3.out' },
            phase + 0.4 + 0.2 * 3,
          )
        }
      })
    }, sectionRef)

    return () => {
      ctx.revert()
      ScrollTrigger.refresh()
    }
  }, [reducedMotion])

  if (reducedMotion) {
    return (
      <section className="bg-[#0A1F3D] text-white">
        {stations.map((station, i) => (
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

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-[#0A1F3D] text-white"
      aria-label="Tour de funcionalidades do Estetia"
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
        {stations.map((station, i) => (
          <article
            key={station.id}
            className="absolute inset-0 grid place-items-center px-8 lg:px-20"
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
    </section>
  )
}
