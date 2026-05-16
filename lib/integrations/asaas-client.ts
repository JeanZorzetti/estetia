/**
 * Asaas API client.
 * Docs: https://docs.asaas.com/
 */

export interface AsaasConfig {
  apiKey: string
  environment: 'sandbox' | 'production'
}

function baseUrl(env: AsaasConfig['environment']): string {
  return env === 'production'
    ? 'https://api.asaas.com/v3'
    : 'https://sandbox.asaas.com/api/v3'
}

async function asaasRequest<T>(
  config: AsaasConfig,
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const url = `${baseUrl(config.environment)}${path}`
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      access_token: config.apiKey,
      ...(init.headers || {}),
    },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Asaas ${res.status}: ${text || res.statusText}`)
  }
  return res.json() as Promise<T>
}

export interface AsaasAccountInfo {
  name?: string
  email?: string
  cpfCnpj?: string
  walletId?: string
}

export async function getMyAccount(config: AsaasConfig): Promise<AsaasAccountInfo> {
  return asaasRequest<AsaasAccountInfo>(config, '/myAccount')
}
