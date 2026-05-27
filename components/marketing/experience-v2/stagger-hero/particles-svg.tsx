'use client'

import { useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'

const PARTICLE_COUNT = 40

interface Particle {
  x: number
  y: number
  r: number
  speed: number
  angle: number
  opacity: number
}

function createParticles(w: number, h: number): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 2 + 1,
    speed: Math.random() * 0.3 + 0.1,
    angle: Math.random() * Math.PI * 2,
    opacity: Math.random() * 0.4 + 0.05,
  }))
}

export function ParticlesSvg() {
  const svgRef = useRef<SVGSVGElement>(null)
  const particles = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)
  const currentX = useRef(0)
  const currentY = useRef(0)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const { width, height } = svg.getBoundingClientRect()
    const w = width || window.innerWidth
    const h = height || window.innerHeight

    particles.current = createParticles(w, h)

    // Create SVG circles
    particles.current.forEach((p, i) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      circle.setAttribute('cx', String(p.x))
      circle.setAttribute('cy', String(p.y))
      circle.setAttribute('r', String(p.r))
      circle.setAttribute('fill', i % 3 === 0 ? '#C5A059' : '#489FB5')
      circle.setAttribute('opacity', String(p.opacity))
      circle.setAttribute('data-particle', String(i))
      svg.appendChild(circle)
    })

    // Stagger entrance
    const opacities = particles.current.map(p => p.opacity)
    animate('[data-particle]', {
      opacity: [0, (_t: unknown, i: number) => opacities[i] ?? 0.1],
      scale: [0, 1],
      delay: stagger(30, { from: 'random' }),
      duration: 800,
      ease: 'outExpo',
    })

    // Drift loop via RAF
    let t = 0
    function drift() {
      t += 0.005
      const circles = svg!.querySelectorAll('[data-particle]')
      circles.forEach((el, i) => {
        const p = particles.current[i]
        if (!p) return
        p.x = ((p.x + Math.cos(p.angle + t * p.speed) * 0.4 + w) % w)
        p.y = ((p.y + Math.sin(p.angle + t * p.speed * 0.6) * 0.3 + h) % h)
        ;(el as SVGCircleElement).setAttribute('cx', String(p.x))
        ;(el as SVGCircleElement).setAttribute('cy', String(p.y))
      })
      rafRef.current = requestAnimationFrame(drift)
    }
    rafRef.current = requestAnimationFrame(drift)

    return () => {
      cancelAnimationFrame(rafRef.current)
      while (svg.firstChild) svg.removeChild(svg.firstChild)
    }
  }, [])

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}
