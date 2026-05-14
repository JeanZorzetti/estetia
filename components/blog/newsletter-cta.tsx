'use client'

import { useState, FormEvent } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function NewsletterCTA() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: { 'Content-Type': 'application/json' },
      })
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="mt-12 mb-4 rounded-2xl p-8 sm:p-10"
      style={{ backgroundColor: '#EEF0F8', border: '1px solid rgba(10,31,61,0.08)' }}>
      <div className="mx-auto max-w-xl text-center">
        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#C5A059' }}>
          Newsletter
        </p>
        <h3 className="font-serif text-xl font-bold sm:text-2xl mb-3" style={{ color: '#0A1F3D' }}>
          Conteúdo exclusivo para clínicas de estética
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>
          Dicas sobre gestão, captação de pacientes, LGPD e tecnologia. 1 email por semana, sem spam.
        </p>

        {status === 'success' ? (
          <p className="mt-6 text-sm font-semibold" style={{ color: '#489FB5' }}>
            Inscrito com sucesso! Cheque seu email.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-2">
            <input
              type="email"
              required
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{
                border: '1.5px solid rgba(10,31,61,0.15)',
                backgroundColor: '#fff',
                color: '#0A1F3D',
              }}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="rounded-lg px-6 py-2.5 text-sm font-semibold transition-opacity disabled:opacity-50"
              style={{ backgroundColor: '#0A1F3D', color: '#fff' }}
            >
              {status === 'loading' ? 'Enviando...' : 'Inscrever'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="mt-3 text-sm" style={{ color: '#E05A4E' }}>
            Ocorreu um erro. Tente novamente.
          </p>
        )}
      </div>
    </div>
  )
}
