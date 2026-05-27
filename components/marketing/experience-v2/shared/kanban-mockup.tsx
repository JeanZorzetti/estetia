'use client'

import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

const COLUMNS = [
  { id: 'avaliacao', label: 'Avaliação', color: '#489FB5' },
  { id: 'tratamento', label: 'Tratamento', color: '#C5A059' },
  { id: 'retorno', label: 'Retorno', color: 'rgba(240,237,232,0.5)' },
] as const

type ColumnId = (typeof COLUMNS)[number]['id']

interface PatientCard {
  id: string
  initials: string
  name: string
  tag: string
  tagColor: string
  column: ColumnId
}

const INITIAL_CARDS: PatientCard[] = [
  { id: 'p1', initials: 'MS', name: 'Maria S.', tag: 'Botox', tagColor: '#C5A059', column: 'avaliacao' },
  { id: 'p2', initials: 'JC', name: 'João C.', tag: 'Peeling', tagColor: '#489FB5', column: 'avaliacao' },
  { id: 'p3', initials: 'AR', name: 'Ana R.', tag: 'Limpeza', tagColor: '#C5A059', column: 'tratamento' },
  { id: 'p4', initials: 'PL', name: 'Pedro L.', tag: 'Laser', tagColor: '#489FB5', column: 'tratamento' },
  { id: 'p5', initials: 'CF', name: 'Carla F.', tag: 'Drenagem', tagColor: '#C5A059', column: 'tratamento' },
  { id: 'p6', initials: 'RT', name: 'Rui T.', tag: 'Follow-up', tagColor: '#489FB5', column: 'retorno' },
]

export function KanbanMockup({ animate = true }: { animate?: boolean }) {
  const [cards, setCards] = useState(INITIAL_CARDS)
  const shouldReduce = useReducedMotion()
  const isAnimating = animate && !shouldReduce

  useEffect(() => {
    if (!isAnimating) return
    const id = setInterval(() => {
      setCards((current) => {
        const next = [...current]
        const moveable = next.findIndex(c => c.column === 'avaliacao')
        if (moveable === -1) return current
        const inTreatment = next.filter(c => c.column === 'tratamento').length
        const inReturn = next.filter(c => c.column === 'retorno').length
        if (inTreatment < 4) {
          next[moveable] = { ...next[moveable], column: 'tratamento' }
        } else if (inReturn < 3) {
          const inTrt = next.findIndex(c => c.column === 'tratamento')
          if (inTrt !== -1) next[inTrt] = { ...next[inTrt], column: 'retorno' }
        } else {
          // Reset loop
          return INITIAL_CARDS
        }
        return next
      })
    }, 3200)
    return () => clearInterval(id)
  }, [isAnimating])

  return (
    <div
      role="img"
      aria-label="Mockup do Kanban clínico do Estetia CRM"
      style={{
        width: '100%',
        height: '100%',
        background: 'rgba(4,8,15,0.6)',
        border: '1px solid rgba(197,160,89,0.12)',
        borderRadius: '6px',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '8px', borderBottom: '1px solid rgba(240,237,232,0.06)' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {['#ff5f56', '#ffbd2e', '#27c93f'].map((c) => (
            <div key={c} style={{ width: 7, height: 7, borderRadius: '50%', background: c, opacity: 0.6 }} />
          ))}
        </div>
        <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.6rem', fontWeight: 600, color: 'rgba(240,237,232,0.4)', letterSpacing: '0.1em' }}>
          estetia / kanban
        </span>
      </div>

      {/* Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', flex: 1, minHeight: 0 }}>
        {COLUMNS.map((col) => {
          const colCards = cards.filter(c => c.column === col.id)
          return (
            <div key={col.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px', minHeight: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingBottom: '4px' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: col.color }} />
                <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: col.color }}>
                  {col.label}
                </span>
                <span style={{ marginLeft: 'auto', fontFamily: "'Manrope', sans-serif", fontSize: '0.55rem', color: 'rgba(240,237,232,0.3)' }}>
                  {colCards.length}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', minHeight: 0, overflow: 'hidden' }}>
                <AnimatePresence mode="popLayout">
                  {colCards.map((card) => (
                    <motion.div
                      key={card.id}
                      layout={isAnimating}
                      initial={isAnimating ? { opacity: 0, scale: 0.85 } : false}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={isAnimating ? { opacity: 0, scale: 0.85 } : undefined}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        background: 'rgba(10,31,61,0.7)',
                        border: `1px solid ${col.color}22`,
                        borderRadius: '4px',
                        padding: '7px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '7px',
                      }}
                    >
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${card.tagColor}40, ${card.tagColor}90)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: "'Manrope', sans-serif",
                          fontSize: '0.5rem',
                          fontWeight: 700,
                          color: '#F0EDE8',
                          flexShrink: 0,
                        }}
                      >
                        {card.initials}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', minWidth: 0, flex: 1 }}>
                        <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.58rem', fontWeight: 600, color: '#F0EDE8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {card.name}
                        </span>
                        <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.5rem', color: card.tagColor, letterSpacing: '0.05em' }}>
                          {card.tag}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
