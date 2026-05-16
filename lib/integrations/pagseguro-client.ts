/**
 * PagSeguro / PagBank API client.
 * Docs: https://dev.pagbank.uol.com.br/reference
 */

export interface PagSeguroConfig {
  token: string
  environment: 'sandbox' | 'production'
}

function baseUrl(env: PagSeguroConfig['environment']): string {
  return env === 'production'
    ? 'https://api.pagseguro.com'
    : 'https://sandbox.api.pagseguro.com'
}

async function pagSeguroRequest<T>(
  config: PagSeguroConfig,
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const url = `${baseUrl(config.environment)}${path}`
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.token}`,
      ...(init.headers || {}),
    },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`PagSeguro ${res.status}: ${text || res.statusText}`)
  }
  return res.json() as Promise<T>
}

export interface PagSeguroAccountInfo {
  business_unit?: { id?: string; name?: string }
  data?: { name?: string; email?: string }
}

export async function getAccount(config: PagSeguroConfig): Promise<PagSeguroAccountInfo> {
  return pagSeguroRequest<PagSeguroAccountInfo>(config, '/accounts/me')
}

export interface PagSeguroPixCharge {
  reference_id: string
  description: string
  amount: { value: number; currency: string }
  payment_method: { type: 'PIX' }
  customer: { name: string; tax_id: string; email: string }
}

export interface PagSeguroChargeResponse {
  id: string
  status: string
  qr_codes?: Array<{ links: Array<{ href: string; media: string; type: string }> }>
}

export async function createPixCharge(
  config: PagSeguroConfig,
  charge: PagSeguroPixCharge
): Promise<PagSeguroChargeResponse> {
  return pagSeguroRequest<PagSeguroChargeResponse>(config, '/charges', {
    method: 'POST',
    body: JSON.stringify(charge),
  })
}
