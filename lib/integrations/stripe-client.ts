/**
 * Stripe API client (minimal, no SDK dependency).
 * Docs: https://stripe.com/docs/api
 */

export interface StripeConfig {
  secretKey: string
}

const BASE_URL = 'https://api.stripe.com/v1'

async function stripeRequest<T>(
  config: StripeConfig,
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${path}`
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${config.secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      ...(init.headers || {}),
    },
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: { message: res.statusText } }))
    throw new Error(`Stripe ${res.status}: ${data?.error?.message ?? res.statusText}`)
  }
  return res.json() as Promise<T>
}

export interface StripeAccountInfo {
  id?: string
  email?: string
  display_name?: string
  business_profile?: { name?: string; url?: string }
  country?: string
  default_currency?: string
}

export async function getAccount(config: StripeConfig): Promise<StripeAccountInfo> {
  return stripeRequest<StripeAccountInfo>(config, '/account')
}

export interface StripeCheckoutSession {
  id: string
  url: string | null
  status: string | null
}

function encodeForm(params: Record<string, string | number>): string {
  return Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&')
}

export async function createCheckoutSession(
  config: StripeConfig,
  params: {
    amount: number
    currency: string
    description: string
    successUrl: string
    cancelUrl: string
    customerEmail?: string
  }
): Promise<StripeCheckoutSession> {
  const body = encodeForm({
    'line_items[0][price_data][currency]': params.currency,
    'line_items[0][price_data][unit_amount]': params.amount,
    'line_items[0][price_data][product_data][name]': params.description,
    'line_items[0][quantity]': 1,
    mode: 'payment',
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    ...(params.customerEmail ? { customer_email: params.customerEmail } : {}),
  })

  return stripeRequest<StripeCheckoutSession>(config, '/checkout/sessions', {
    method: 'POST',
    body,
  })
}
