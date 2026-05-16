/**
 * LinkedIn Marketing API client.
 * Docs: https://learn.microsoft.com/en-us/linkedin/marketing/
 */

export interface LinkedInAdsConfig {
  accessToken: string
  accountId?: string
}

const BASE_URL = 'https://api.linkedin.com/v2'

async function linkedinRequest<T>(
  config: LinkedInAdsConfig,
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${path}`
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.accessToken}`,
      'LinkedIn-Version': '202408',
      ...(init.headers ?? {}),
    },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`LinkedIn API ${res.status}: ${text || res.statusText}`)
  }
  return res.json() as Promise<T>
}

export interface LinkedInProfile {
  id: string
  localizedFirstName?: string
  localizedLastName?: string
}

/**
 * Verifica o token consultando o perfil do usuário autenticado.
 */
export async function getMyProfile(config: LinkedInAdsConfig): Promise<LinkedInProfile> {
  return linkedinRequest<LinkedInProfile>(config, '/me')
}

export interface LinkedInAdAccount {
  id: string
  name?: string
  status?: string
  currency?: string
}

/**
 * Lista contas de anúncio acessíveis pelo token.
 */
export async function listAdAccounts(
  config: LinkedInAdsConfig
): Promise<LinkedInAdAccount[]> {
  const data = await linkedinRequest<{ elements: LinkedInAdAccount[] }>(
    config,
    '/adAccountsV2?q=search&search.status.values[0]=ACTIVE'
  )
  return data.elements ?? []
}

export interface LinkedInConversionEvent {
  accountId: string
  conversionId: string
  conversionHappenedAt: number // Unix timestamp ms
  conversionValue?: { currencyCode: string; amount: string }
  user?: { userIds?: { idType: string; idValue: string }[] }
}

/**
 * Registra evento de conversão via LinkedIn Conversions API (CAPI).
 * Falha silenciosa — nunca quebra o fluxo principal.
 */
export async function trackConversion(
  config: LinkedInAdsConfig,
  event: LinkedInConversionEvent
): Promise<void> {
  if (!config.accountId) return
  try {
    await linkedinRequest(config, '/conversionEvents', {
      method: 'POST',
      body: JSON.stringify(event),
    })
  } catch {
    // Falha silenciosa — integração de ads não deve quebrar fluxo do CRM
  }
}
