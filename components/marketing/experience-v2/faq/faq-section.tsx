'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { FAQ_ITEMS } from './faq-data'

export function FAQSection() {
  const shouldReduce = useReducedMotion()
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  const toggle = (i: number) => setOpenIdx(openIdx === i ? null : i)

  return (
    <section
      id="faq"
      aria-label="Perguntas frequentes"
      className="relative py-24 px-6 overflow-hidden"
      style={{ background: 'transparent' }}
    >
      {/* Section number */}
      <div
        className="absolute top-8 right-8 z-10 text-[10px] tracking-[0.4em] uppercase opacity-30"
        style={{ fontFamily: "'Manrope', sans-serif", color: '#C5A059' }}
      >
        08 — FAQ
      </div>

      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 25% 60%, rgba(197,160,89,0.06) 0%, transparent 55%)',
        }}
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20">
          {/* Left — sticky title */}
          <div className="md:col-span-4 md:sticky md:top-24 md:self-start">
            <motion.p
              initial={shouldReduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                color: '#C5A059',
                opacity: 0.7,
                marginBottom: '1rem',
              }}
            >
              Dúvidas frequentes
            </motion.p>

            <motion.h2
              initial={shouldReduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "'Newsreader', Georgia, serif",
                fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)',
                fontWeight: 300,
                fontStyle: 'italic',
                color: '#F0EDE8',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                marginBottom: '1.5rem',
              }}
            >
              Tudo que você<br />
              <span style={{ color: '#C5A059' }}>precisa saber.</span>
            </motion.h2>

            <motion.p
              initial={shouldReduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: '0.85rem',
                color: 'rgba(240,237,232,0.45)',
                lineHeight: 1.6,
              }}
            >
              Ainda tem dúvidas?{' '}
              <a
                href="/demo"
                data-cursor="link"
                data-cursor-label="Agendar"
                style={{ color: '#C5A059', textDecoration: 'none', borderBottom: '1px solid rgba(197,160,89,0.3)' }}
              >
                Fale com nosso time.
              </a>
            </motion.p>
          </div>

          {/* Right — accordion list */}
          <div className="md:col-span-8">
            {FAQ_ITEMS.map((item, i) => {
              const isOpen = shouldReduce || openIdx === i

              return (
                <motion.div
                  key={item.id}
                  initial={shouldReduce ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.45, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    borderBottom: '1px solid rgba(240,237,232,0.08)',
                  }}
                >
                  <button
                    onClick={() => !shouldReduce && toggle(i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${item.id}`}
                    data-cursor="link"
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      padding: '1.25rem 0',
                      background: 'none',
                      border: 'none',
                      cursor: shouldReduce ? 'default' : 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Manrope', sans-serif",
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: isOpen ? item.accent : 'rgba(240,237,232,0.8)',
                        transition: 'color 0.2s ease',
                        lineHeight: 1.4,
                      }}
                    >
                      {item.question}
                    </span>

                    {!shouldReduce && (
                      <span
                        style={{
                          flexShrink: 0,
                          width: 24,
                          height: 24,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: item.accent,
                          opacity: 0.8,
                        }}
                      >
                        {isOpen ? <Minus size={16} strokeWidth={2} /> : <Plus size={16} strokeWidth={2} />}
                      </span>
                    )}
                  </button>

                  {shouldReduce ? (
                    <p
                      id={`faq-answer-${item.id}`}
                      style={{
                        fontFamily: "'Manrope', sans-serif",
                        fontSize: '0.85rem',
                        color: 'rgba(240,237,232,0.55)',
                        lineHeight: 1.7,
                        paddingBottom: '1.25rem',
                      }}
                    >
                      {item.answer}
                    </p>
                  ) : (
                    <AnimatePresence initial={false}>
                      {openIdx === i && (
                        <motion.div
                          id={`faq-answer-${item.id}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          style={{ overflow: 'hidden' }}
                        >
                          <p
                            style={{
                              fontFamily: "'Manrope', sans-serif",
                              fontSize: '0.85rem',
                              color: 'rgba(240,237,232,0.55)',
                              lineHeight: 1.7,
                              paddingBottom: '1.25rem',
                            }}
                          >
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
