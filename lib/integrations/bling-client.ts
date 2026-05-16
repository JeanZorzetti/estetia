/**
 * Bling API v3 client (OAuth 2.0).
 * Docs: https://developer.bling.com.br/
 */

import { decrypt } from '@/lib/encryption'

const BLING_BASE = 'https://www.bling.com.br/Api/v3'
const BLING_TOKEN_URL = 'https://www.bling.com.br/Api/v3/oauth/token'

function resolveSecret(stored: string): string {
  if (stored.includes(':') && stored.split(':').length === 3) {
    try {
      return decrypt(stored)
    } catch {
      return stored
    }
  }
  return stored
}

export async function refreshBlingToken(
  clientId: string,
  clientSecretEncrypted: string,
  refreshTokenEncrypted: string
): Promise<{ access_token: string; refresh_token: string; expires_in: number }> {
  const clientSecret = resolveSecret(clientSecretEncrypted)
  const refreshToken = resolveSecret(refreshTokenEncrypted)
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  })

  const res = await fetch(BLING_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: '1.0',
    },
    body,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Bling OAuth ${res.status}: ${text || res.statusText}`)
  }
  return (await res.json()) as { access_token: string; refresh_token: string; expires_in: number }
}

export async function getBlingCompany(accessToken: string) {
  const res = await fetch(`${BLING_BASE}/empresas/me/dadosBasicos`, {
    headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`Bling ${res.status}: ${res.statusText}`)
  return (await res.json()) as { data?: { nome?: string; cnpj?: string } }
}
