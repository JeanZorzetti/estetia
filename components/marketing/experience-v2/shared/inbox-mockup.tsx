'use client'

import { motion, useReducedMotion } from 'framer-motion'

const EMAILS = [
  { from: 'Maria S.', subject: 'Confirmação de retorno', preview: 'Sim, posso na sexta às 14h...', accent: '#C5A059', unread: true, time: 'Há 12min' },
  { from: 'Sequência automática', subject: 'Bem-vinda à Estetia ✨', preview: 'Maria, preparamos um protocolo...', accent: '#489FB5', unread: true, time: 'Há 2h' },
  { from: 'Carla F.', subject: 'Re: Próxima sessão', preview: 'Obrigada pelo lembrete!', accent: '#C5A059', unread: false, time: 'Ontem' },
  { from: 'Sistema', subject: 'Pagamento recebido', preview: 'R$ 850,00 — Pedro L.', accent: '#489FB5', unread: false, time: '2 dias' },
]

export function InboxMockup() {
  const shouldReduce = useReducedMotion()

  return (
    <div
      role="img"
      aria-label="Mockup de inbox automático com sequências de email"
      style={{
        width: '100%',
        height: '100%',
        background: 'rgba(4,8,15,0.6)',
        border: '1px solid rgba(72,159,181,0.15)',
        borderRadius: '6px',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(240,237,232,0.06)' }}>
        <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F0EDE8', margin: 0 }}>
          Caixa de Entrada
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            background: '#489FB5',
            color: '#04080F',
            fontFamily: "'Manrope', sans-serif",
            fontSize: '0.5rem',
            fontWeight: 700,
            padding: '1px 5px',
            borderRadius: '2px',
            letterSpacing: '0.1em',
          }}>
            2
          </span>
          <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.55rem', color: 'rgba(240,237,232,0.4)' }}>
            não lidos
          </span>
        </div>
      </div>

      {/* Email list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minHeight: 0 }}>
        {EMAILS.map((email, i) => (
          <motion.div
            key={email.from + i}
            initial={shouldReduce ? false : { opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 6px',
              borderRadius: '3px',
              background: email.unread ? 'rgba(197,160,89,0.04)' : 'transparent',
              borderLeft: email.unread ? `2px solid ${email.accent}` : '2px solid transparent',
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${email.accent}40, ${email.accent}90)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Manrope', sans-serif",
                fontSize: '0.55rem',
                fontWeight: 700,
                color: '#F0EDE8',
                flexShrink: 0,
              }}
            >
              {email.from.charAt(0)}
            </div>

            {/* Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <span style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: '0.6rem',
                  fontWeight: email.unread ? 700 : 500,
                  color: email.unread ? '#F0EDE8' : 'rgba(240,237,232,0.6)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {email.from}
                </span>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.5rem', color: 'rgba(240,237,232,0.3)', flexShrink: 0 }}>
                  {email.time}
                </span>
              </div>
              <span style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: '0.55rem',
                fontWeight: email.unread ? 600 : 400,
                color: email.unread ? '#C5A059' : 'rgba(240,237,232,0.55)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {email.subject}
              </span>
              <span style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: '0.52rem',
                color: 'rgba(240,237,232,0.35)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {email.preview}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
