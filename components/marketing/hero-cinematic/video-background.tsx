'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  src?: string
  webmSrc?: string
  poster?: string
}

export function VideoBackground({
  src = '/videos/hero-placeholder.mp4',
  webmSrc = '/videos/hero-placeholder.webm',
  poster = '/videos/hero-placeholder-poster.jpg',
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (reducedMotion) {
      v.pause()
    } else {
      v.play().catch(() => {})
    }
  }, [reducedMotion])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {!reducedMotion ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={webmSrc} type="video/webm" />
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${poster})` }}
        />
      )}

      <div
        className="absolute inset-0 bg-gradient-to-b from-[#0A1F3D]/75 via-[#0A1F3D]/45 to-[#0A1F3D]/70"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(10,31,61,0.55)_100%)]"
        aria-hidden="true"
      />
    </div>
  )
}
