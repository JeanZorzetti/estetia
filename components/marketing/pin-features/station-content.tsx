import { forwardRef } from 'react'
import type { Station } from './stations-data'

type Props = {
  station: Station
  totalStations: number
}

export const StationContent = forwardRef<HTMLDivElement, Props>(function StationContent(
  { station, totalStations },
  ref,
) {
  return (
    <div ref={ref} className="flex flex-col items-start">
      <div
        data-station-element="index"
        className="font-mono text-sm font-bold uppercase tracking-[0.3em] text-[#C5A059]"
      >
        {station.index} <span className="text-white/30">/ {String(totalStations).padStart(2, '0')}</span>
      </div>

      <h2
        data-station-element="title"
        className="mt-6 font-serif leading-[1.05] tracking-[-0.03em] text-white"
        style={{ fontSize: 'clamp(2.25rem, 4.5vw, 4rem)' }}
      >
        {station.title}
      </h2>

      <div
        data-station-element="accent-line"
        className="mt-6 h-[2px] w-24"
        style={{ background: `linear-gradient(to right, ${station.accent}, transparent)` }}
      />

      <p
        data-station-element="description"
        className="mt-6 max-w-md text-lg leading-relaxed text-white/75"
      >
        {station.description}
      </p>
    </div>
  )
})
