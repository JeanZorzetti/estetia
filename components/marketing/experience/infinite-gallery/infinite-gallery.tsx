'use client'

import { useEffect, useRef, useState } from 'react'
import { GALLERY_CARDS } from './gallery-data'
import { PinnedSection } from '../pinned-section'

const CARD_W = 280
const CARD_H = 200
const GAP = 20
const COLS = 4
const ROWS = 3
const TOTAL_CARDS = COLS * ROWS

// Tiles extendidos para reciclagem
const TILES = [...GALLERY_CARDS, ...GALLERY_CARDS, ...GALLERY_CARDS].slice(0, TOTAL_CARDS)

interface TilePos {
  x: number
  y: number
  dataIdx: number
}

function buildInitialPositions(): TilePos[] {
  const positions: TilePos[] = []
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      positions.push({
        x: c * (CARD_W + GAP),
        y: r * (CARD_H + GAP),
        dataIdx: r * COLS + c,
      })
    }
  }
  return positions
}

export function InfiniteGallery() {
  const containerRef = useRef<HTMLDivElement>(null)
  const tilePositions = useRef<TilePos[]>(buildInitialPositions())
  const isDragging = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const offset = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)
  const [, forceRender] = useState(0)

  const totalW = COLS * (CARD_W + GAP)
  const totalH = ROWS * (CARD_H + GAP)

  function recycle() {
    offset.current.x = ((offset.current.x % totalW) + totalW) % totalW
    offset.current.y = ((offset.current.y % totalH) + totalH) % totalH
  }

  function loop() {
    // Apply inertia
    velocity.current.x *= 0.94
    velocity.current.y *= 0.94

    if (!isDragging.current) {
      offset.current.x += velocity.current.x
      offset.current.y += velocity.current.y
      recycle()
    }

    forceRender(n => n + 1)
    rafRef.current = requestAnimationFrame(loop)
  }

  useEffect(() => {
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  function onPointerDown(e: React.PointerEvent) {
    isDragging.current = true
    lastPos.current = { x: e.clientX, y: e.clientY }
    velocity.current = { x: 0, y: 0 }
    containerRef.current?.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!isDragging.current) return
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    velocity.current = { x: dx, y: dy }
    offset.current.x += dx
    offset.current.y += dy
    recycle()
    lastPos.current = { x: e.clientX, y: e.clientY }
  }

  function onPointerUp() {
    isDragging.current = false
  }

  // Compute visible positions with infinite tiling
  function getTransform(tile: TilePos) {
    const ox = ((offset.current.x + tile.x) % totalW + totalW) % totalW - totalW / 2
    const oy = ((offset.current.y + tile.y) % totalH + totalH) % totalH - totalH / 2
    return `translate3d(calc(-50% + ${ox}px), calc(-50% + ${oy}px), 0)`
  }

  const dataCards = GALLERY_CARDS

  return (
    <PinnedSection
      label="Galéria XY infinita"
      viewportsTall={2.5}
      background="linear-gradient(180deg, #04080F 0%, #040C18 100%)"
    >
      {/* Número seção */}
      <div
        className="absolute top-6 right-8 z-30 text-[10px] tracking-[0.35em] uppercase opacity-30"
        style={{ fontFamily: 'monospace', color: '#C5A059' }}
      >
        05 — Galeria XY
      </div>

      {/* Instrução */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 text-center pointer-events-none">
        <p
          style={{
            fontSize: '0.7rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(197,160,89,0.5)',
            fontFamily: 'monospace',
          }}
        >
          Arraste em qualquer direção
        </p>
      </div>

      {/* Título overlay */}
      <div
        className="absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-center"
        style={{ background: 'radial-gradient(ellipse at center, rgba(4,8,15,0.7) 0%, transparent 70%)' }}
      >
        <h2
          style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: 'clamp(2.5rem, 5vw, 5rem)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: '#F0EDE8',
            letterSpacing: '-0.02em',
            textAlign: 'center',
            textShadow: '0 2px 40px rgba(4,8,15,0.8)',
          }}
        >
          Clínicas que<br />
          <span style={{ color: '#C5A059' }}>já transformaram</span>
        </h2>
      </div>

      {/* Canvas de tiles */}
      <div
        ref={containerRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        style={{ userSelect: 'none' }}
      >
        {tilePositions.current.map((tile, i) => {
          const card = dataCards[tile.dataIdx % dataCards.length]
          return (
            <div
              key={i}
              className="absolute rounded-xl overflow-hidden border border-white/5"
              style={{
                width: CARD_W,
                height: CARD_H,
                left: '50%',
                top: '50%',
                transform: getTransform(tile),
                background: card.gradient,
                willChange: 'transform',
              }}
            >
              <div className="absolute inset-0 p-5 flex flex-col justify-between">
                <div
                  className="text-[10px] tracking-widest uppercase font-medium"
                  style={{ color: card.accent, fontFamily: 'monospace' }}
                >
                  {card.tag}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "'Newsreader', Georgia, serif",
                      fontSize: '1.1rem',
                      fontWeight: 400,
                      color: '#F0EDE8',
                    }}
                  >
                    {card.label}
                  </div>
                  <div
                    className="mt-1 w-8 h-[2px] rounded-full"
                    style={{ background: card.accent }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </PinnedSection>
  )
}
