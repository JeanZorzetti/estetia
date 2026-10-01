import crypto from 'crypto'

/**
 * Generates a random secret for webhook HMAC signing.
 * Returns a 64-char hex string (32 bytes).
 */
export function generateSecret(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Validates an HMAC SHA256 signature against a payload.
 * Expected header format: `sha256=<hex>` (Stripe/GitHub style).
 */
export function validateHmac(payload: string, signature: string | null, secret: string): boolean {
  if (!signature) return false

  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  const provided = signature.replace(/^sha256=/, '').trim()

  if (expected.length !== provided.length) return false

  try {
    return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(provided, 'hex'))
  } catch {
    return false
  }
}

/**
 * Computes an HMAC signature for a payload (used in outbound webhooks).
 */
export function signPayload(payload: string, secret: string): string {
  const hmac = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  return `sha256=${hmac}`
}

/**
 * Validates a Stripe webhook signature (header `Stripe-Signature: t=<unix>,v1=<hex>`).
 * The signed payload is `<t>.<raw body>`; events older than the tolerance are rejected (replay).
 */
export function validateStripeSignature(
  payload: string,
  header: string | null,
  secret: string,
  toleranceSeconds = 300,
  now = Date.now()
): boolean {
  if (!header) return false
  const parts = header.split(',').map((p) => p.trim().split('='))
  const t = parts.find(([k]) => k === 't')?.[1]
  const assinaturas = parts.filter(([k]) => k === 'v1').map(([, v]) => v)
  if (!t || !assinaturas.length) return false
  if (Math.abs(now / 1000 - Number(t)) > toleranceSeconds) return false
  return assinaturas.some((v1) => validateHmac(`${t}.${payload}`, v1, secret))
}
