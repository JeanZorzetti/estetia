/**
 * Pagar.me API client (v5).
 * Docs: https://docs.pagar.me/reference
 */

export interface PagarmeConfig {
  apiKey: string
  recipientId?: string
}

const BASE_URL = 'https://api.pagar.me/core/v5'

async function pagarmeRequest<T>(
  config: PagarmeConfig,
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const credentials = Buffer.from(`${config.apiKey}:`).toString('base64')
  const url = `${BASE_URL}${path}`
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${credentials}`,
      ...(init.headers || {}),
    },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Pagar.me ${res.status}: ${text || res.statusText}`)
  }
  return res.json() as Promise<T>
}

export interface PagarmeAccountInfo {
  id?: string
  name?: string
  email?: string
  document?: string
  status?: string
}

export async function getAccount(config: PagarmeConfig): Promise<PagarmeAccountInfo> {
  return pagarmeRequest<PagarmeAccountInfo>(config, '/recipients/me')
}

export interface PagarmeOrderItem {
  amount: number
  description: string
  quantity: number
  code: string
}

export interface PagarmeCustomer {
  name: string
  email: string
  document: string
  type: 'individual' | 'company'
}

export interface PagarmeOrderResponse {
  id: string
  status: string
  charges?: Array<{ id: string; status: string; last_transaction?: { qr_code?: string; qr_code_url?: string } }>
}

export async function createPixOrder(
  config: PagarmeConfig,
  params: {
    customer: PagarmeCustomer
    items: PagarmeOrderItem[]
    amount: number
  }
): Promise<PagarmeOrderResponse> {
  const body = {
    items: params.items,
    customer: params.customer,
    payments: [
      {
        payment_method: 'pix',
        pix: { expires_in: 3600 },
        amount: params.amount,
      },
    ],
  }
  return pagarmeRequest<PagarmeOrderResponse>(config, '/orders', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
