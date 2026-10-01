/**
 * Invariants of the printable anamnesis forms (config/fichas-anamnese.ts) and of the Stripe
 * signature check that guards the paid step.
 */

import crypto from 'crypto'
import { FICHAS, FICHA_COM_LOGO, faqComum } from '@/config/fichas-anamnese'
import { validateStripeSignature } from '@/lib/integrations/webhook-validator'

describe('fichas de anamnese', () => {
  it('has unique slugs, titles and descriptions', () => {
    for (const campo of ['slug', 'title', 'description', 'nome'] as const) {
      const valores = FICHAS.map((f) => f[campo])
      expect(new Set(valores).size, campo).toBe(FICHAS.length)
    }
  })

  it.each(FICHAS.map((f) => [f.slug, f] as const))('%s is complete and fits the search snippet', (_slug, f) => {
    expect(f.title.length, 'title').toBeLessThanOrEqual(60)
    expect(f.description.length, 'description').toBeGreaterThanOrEqual(120)
    expect(f.description.length, 'description').toBeLessThanOrEqual(160)

    const ids = f.template.fields.map((c) => c.id)
    expect(new Set(ids).size, 'field ids').toBe(ids.length)
    expect(f.template.procedimento).toBe(f.slug)

    // Every option field has options, and the sheet ends with the signatures.
    for (const c of f.template.fields) {
      if (c.type === 'select' || c.type === 'multiselect') expect(c.options?.length, c.id).toBeGreaterThan(1)
    }
    expect(f.template.fields.at(-1)?.type).toBe('signature')
    expect(f.tabelas.length).toBeGreaterThan(0)
    expect(f.notas.length).toBeGreaterThan(0)
    expect(f.faq.length).toBeGreaterThan(0)
  })

  it('never states a legal obligation or unbacked social proof', () => {
    const texto = JSON.stringify(FICHAS.map((f) => [f, faqComum(f)])).toLowerCase()
    for (const proibido of ['exigida pela', 'exigido pela', 'obrigatória por lei', 'anvisa exige', 'clínicas ativas', 'avaliações']) {
      expect(texto, proibido).not.toContain(proibido)
    }
  })

  it('charges R$ 19,90', () => {
    expect(FICHA_COM_LOGO.centavos).toBe(1990)
    expect(FICHA_COM_LOGO.preco).toBe('R$ 19,90')
  })
})

describe('validateStripeSignature', () => {
  const secret = 'whsec_test'
  const payload = '{"type":"checkout.session.completed"}'
  const agora = 1_800_000_000_000
  const t = Math.floor(agora / 1000)
  const v1 = crypto.createHmac('sha256', secret).update(`${t}.${payload}`).digest('hex')

  it('accepts a fresh, correctly signed payload', () => {
    expect(validateStripeSignature(payload, `t=${t},v1=${v1}`, secret, 300, agora)).toBe(true)
  })

  it('rejects a tampered payload, a wrong secret, a stale timestamp and a missing header', () => {
    expect(validateStripeSignature(payload + ' ', `t=${t},v1=${v1}`, secret, 300, agora)).toBe(false)
    expect(validateStripeSignature(payload, `t=${t},v1=${v1}`, 'whsec_other', 300, agora)).toBe(false)
    expect(validateStripeSignature(payload, `t=${t},v1=${v1}`, secret, 300, agora + 301_000)).toBe(false)
    expect(validateStripeSignature(payload, null, secret, 300, agora)).toBe(false)
  })
})
