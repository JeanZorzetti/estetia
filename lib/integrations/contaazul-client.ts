/**
 * ContaAzul API client (OAuth 2.0).
 * Docs: https://developers.contaazul.com/
 *
 * NOTE: O fluxo OAuth completo (authorize, callback, refresh) ainda não está implementado.
 * Esta primeira fase aceita Client ID/Secret + Refresh Token manuais — gerados em painel próprio.
 */

import { decrypt } from '@/lib/encryption'

const CONTAAZUL_BASE = 'https://api.contaazul.com/v1'
const CONTAAZUL_TOKEN_URL = 'https://api.contaazul.com/oauth2/token'

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

export async function refreshContaAzulToken(
  clientId: string,
  clientSecretEncrypted: string,
  refreshTokenEncrypted: string
): Promise<{ access_token: string; refresh_token: string; expires_in: number }> {
  const clientSecret = resolveSecret(clientSecretEncrypted)
  const refreshToken = resolveSecret(refreshTokenEncrypted)

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
  })

  const res = await fetch(CONTAAZUL_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`ContaAzul OAuth ${res.status}: ${text || res.statusText}`)
  }
  return (await res.json()) as { access_token: string; refresh_token: string; expires_in: number }
}

export async function getContaAzulCompanyInfo(accessToken: string) {
  const res = await fetch(`${CONTAAZUL_BASE}/company-info`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) throw new Error(`ContaAzul ${res.status}: ${res.statusText}`)
  return (await res.json()) as { business_name?: string; document?: string }
}
