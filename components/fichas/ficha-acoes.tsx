'use client'

import { useRef, useState } from 'react'
import { Loader2, Printer } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { FICHA_COM_LOGO, whatsappFicha } from '@/config/fichas-anamnese'

export function BotaoImprimir({ slug }: { slug: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        trackEvent('ficha_imprimir', { ficha: slug })
        window.print()
      }}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/35 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      <Printer aria-hidden className="size-4" />
      Imprimir agora
    </button>
  )
}

/** Paid step: opens Stripe Checkout for the same form with the buyer's logo. */
export function PedirComLogo({ slug, nome }: { slug: string; nome: string }) {
  const [estado, setEstado] = useState<'pronto' | 'abrindo' | 'erro'>('pronto')

  async function pedir() {
    setEstado('abrindo')
    trackEvent('ficha_logo_pedir', { ficha: slug })
    try {
      const res = await fetch('/api/fichas/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
      const { url } = await res.json()
      if (!res.ok || !url) throw new Error('checkout')
      window.location.assign(url)
    } catch {
      setEstado('erro')
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={pedir}
        disabled={estado === 'abrindo'}
        aria-busy={estado === 'abrindo'}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0A1F3D] px-6 text-sm font-bold text-white transition-colors hover:bg-[#162D54] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F3D] disabled:opacity-70 sm:w-auto"
      >
        {estado === 'abrindo' && <Loader2 aria-hidden className="size-4 animate-spin motion-reduce:animate-none" />}
        {estado === 'abrindo' ? 'Abrindo pagamento…' : `Pedir com a minha logo · ${FICHA_COM_LOGO.preco}`}
      </button>
      {estado === 'erro' && (
        <p role="alert" className="mt-3 text-sm text-[#9E2E23]">
          Não conseguimos abrir o pagamento agora. Tente de novo em instantes ou{' '}
          <a
            className="font-semibold underline"
            href={whatsappFicha(`Olá! Quero a ${nome.toLowerCase()} com a minha logo.`)}
          >
            peça pelo WhatsApp
          </a>
          .
        </p>
      )}
    </div>
  )
}

/** Interest in the digital version: one e-mail, one purpose, explicit consent (LGPD art. 7, I). */
export function InteresseDigital({ slug }: { slug: string }) {
  const [estado, setEstado] = useState<'pronto' | 'enviando' | 'enviado' | 'erro'>('pronto')
  const [email, setEmail] = useState('')
  const cliqueContado = useRef(false)

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setEstado('enviando')
    try {
      const res = await fetch('/api/fichas/interesse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, email, consentimento: true }),
      })
      if (!res.ok) throw new Error('interesse')
      trackEvent('ficha_digital_contato', { ficha: slug })
      setEstado('enviado')
    } catch {
      setEstado('erro')
    }
  }

  if (estado === 'enviado') {
    return (
      <p role="status" className="rounded-xl border border-[#0A1F3D]/15 bg-white p-4 text-sm text-[#0A1F3D]">
        Anotado. Avisamos em <strong>{email}</strong> quando a versão digital abrir.
      </p>
    )
  }

  return (
    <details
      className="group rounded-xl border border-[#0A1F3D]/15 bg-white"
      onToggle={(e) => {
        // Only the first open counts as the "click" of criterion C3.
        if (!e.currentTarget.open || cliqueContado.current) return
        cliqueContado.current = true
        trackEvent('ficha_digital_clique', { ficha: slug })
      }}
    >
      <summary className="flex min-h-12 cursor-pointer items-center px-4 text-sm font-bold text-[#0A1F3D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F3D]">
        Quero a versão digital
      </summary>
      <form onSubmit={enviar} className="space-y-3 border-t border-[#0A1F3D]/10 p-4">
        <div>
          <label htmlFor={`interesse-email-${slug}`} className="mb-1 block text-sm font-semibold text-[#0A1F3D]">
            Seu e-mail
          </label>
          <input
            id={`interesse-email-${slug}`}
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder="ex.: voce@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-h-12 w-full rounded-lg border border-[#0A1F3D]/30 px-3 text-base text-[#0A1F3D] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#0A1F3D]"
          />
        </div>
        <label className="flex items-start gap-2 text-sm text-[#334155]">
          <input type="checkbox" required className="mt-0.5 size-5 shrink-0" />
          <span>Aceito receber um e-mail quando a versão digital das fichas abrir. O endereço não é usado para mais nada.</span>
        </label>
        <button
          type="submit"
          disabled={estado === 'enviando'}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#0A1F3D] px-6 text-sm font-bold text-white transition-colors hover:bg-[#162D54] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F3D] disabled:opacity-70 sm:w-auto"
        >
          {estado === 'enviando' ? 'Registrando…' : 'Avisar quando abrir'}
        </button>
        {estado === 'erro' && (
          <p role="alert" className="text-sm text-[#9E2E23]">
            Não conseguimos registrar agora. Tente de novo em instantes.
          </p>
        )}
      </form>
    </details>
  )
}
