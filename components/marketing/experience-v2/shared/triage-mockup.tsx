'use client'

import { motion, useReducedMotion } from 'framer-motion'

const PRIORITIES = [
  { label: 'Urgente', color: '#ff6b6b', count: 2 },
  { label: 'Hoje', color: '#C5A059', count: 5 },
  { label: 'Semana', color: '#489FB5', count: 8 },
] as const

export function TriageMockup() {
  const shouldReduce = useReducedMotion()

  return (
    <div
      role="img"
      aria-label="Mockup de triagem com IA classificando prioridade clínica"
      style={{
        width: '100%',
        height: '100%',
        background: 'rgba(4,8,15,0.6)',
        border: '1px solid rgba(72,159,181,0.15)',
        borderRadius: '6px',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <motion.div
          animate={shouldReduce ? undefined : {
            boxShadow: [
              '0 0 0 0 rgba(72,159,181,0.4)',
              '0 0 0 8px rgba(72,159,181,0)',
            ],
          }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #489FB5, #C5A059)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: '0.65rem',
            fontWeight: 700,
            fontStyle: 'italic',
            color: '#04080F',
            flexShrink: 0,
          }}
        >
          ia
        </motion.div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.6rem', fontWeight: 700, color: '#F0EDE8' }}>
            Triagem IA
          </span>
          <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.5rem', color: '#489FB5', letterSpacing: '0.1em' }}>
            Analisando…
          </span>
        </div>
      </div>

      {/* Chat bubble — patient */}
      <motion.div
        initial={shouldReduce ? false : { opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: 'rgba(10,31,61,0.8)',
          border: '1px solid rgba(240,237,232,0.08)',
          padding: '8px 10px',
          borderRadius: '4px 8px 8px 4px',
          maxWidth: '85%',
        }}
      >
        <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.55rem', fontWeight: 600, color: 'rgba(240,237,232,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '3px' }}>
          Paciente Maria S.
        </span>
        <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.6rem', color: '#F0EDE8', lineHeight: 1.45 }}>
          &quot;Tive irritação no rosto após o peeling. Vermelhidão e ardência aumentando.&quot;
        </span>
      </motion.div>

      {/* AI response with typing dots → result */}
      <motion.div
        initial={shouldReduce ? false : { opacity: 0, x: 16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.5, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: 'linear-gradient(135deg, rgba(197,160,89,0.12), rgba(72,159,181,0.12))',
          border: '1px solid rgba(197,160,89,0.25)',
          padding: '10px',
          borderRadius: '8px 4px 4px 8px',
          marginLeft: 'auto',
          maxWidth: '90%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
          <span style={{
            background: '#ff6b6b',
            color: '#04080F',
            fontFamily: "'Manrope', sans-serif",
            fontSize: '0.48rem',
            fontWeight: 700,
            padding: '1px 5px',
            borderRadius: '2px',
            letterSpacing: '0.1em',
          }}>
            URGENTE
          </span>
          <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.5rem', color: 'rgba(240,237,232,0.4)' }}>
            confiança 94%
          </span>
        </div>
        <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.58rem', color: '#F0EDE8', lineHeight: 1.45 }}>
          Possível reação adversa. Sugiro contato em <strong style={{ color: '#C5A059' }}>até 2h</strong> + agendamento de avaliação presencial.
        </span>
      </motion.div>

      {/* Priority distribution */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '8px', borderTop: '1px solid rgba(240,237,232,0.06)' }}>
        <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,237,232,0.4)' }}>
          Fila do dia
        </span>
        <div style={{ display: 'flex', gap: '6px' }}>
          {PRIORITIES.map((p, i) => (
            <motion.div
              key={p.label}
              initial={shouldReduce ? false : { opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: 1.4 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                flex: 1,
                background: `${p.color}14`,
                border: `1px solid ${p.color}40`,
                borderRadius: '3px',
                padding: '5px 6px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              <span style={{
                fontFamily: "'Newsreader', Georgia, serif",
                fontSize: '0.95rem',
                fontWeight: 300,
                fontStyle: 'italic',
                color: p.color,
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}>
                {p.count}
              </span>
              <span style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: '0.46rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: p.color,
              }}>
                {p.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
