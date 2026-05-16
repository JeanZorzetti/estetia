/**
 * MercadoPago Checkout client.
 * Docs: https://www.mercadopago.com.br/developers/pt/reference
 *
 * Used for clinics to receive payments from patients (not the SaaS subscription).
 */

const MP_BASE = 'https://api.mercadopago.com'

export interface MpCheckoutConfig {
  accessToken: string
}

async function mpRequest<T>(
  config: MpCheckoutConfig,
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${MP_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`MercadoPago ${res.status}: ${text || res.statusText}`)
  }
  return res.json() as Promise<T>
}

export interface MpUserInfo {
  id?: number
  nickname?: string
  email?: string
  site_id?: string
}

export async function getUserInfo(config: MpCheckoutConfig): Promise<MpUserInfo> {
  return mpRequest<MpUserInfo>(config, '/users/me')
}
