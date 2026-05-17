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

// ─── Billing Modular ──────────────────────────────────────────────────────────

export interface AsaasCustomer {
  id: string
  name: string
  email?: string
  cpfCnpj?: string
}

export interface CreateCustomerInput {
  name: string
  email?: string
  cpfCnpj?: string
  externalReference?: string // orgId
}

export async function createCustomer(
  config: AsaasConfig,
  input: CreateCustomerInput,
): Promise<AsaasCustomer> {
  return asaasRequest<AsaasCustomer>(config, '/customers', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function getCustomer(config: AsaasConfig, customerId: string): Promise<AsaasCustomer> {
  return asaasRequest<AsaasCustomer>(config, `/customers/${customerId}`)
}

export async function updateCustomer(
  config: AsaasConfig,
  customerId: string,
  input: Partial<CreateCustomerInput>,
): Promise<AsaasCustomer> {
  return asaasRequest<AsaasCustomer>(config, `/customers/${customerId}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
}

export interface AsaasSubscription {
  id: string
  customer: string
  billingType: string
  value: number
  nextDueDate: string
  cycle: string
  status: string
}

export interface CreateSubscriptionInput {
  customer: string   // customer ID
  billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX'
  value: number      // total em R$ (não centavos)
  nextDueDate: string // YYYY-MM-DD
  cycle: 'MONTHLY' | 'YEARLY'
  description?: string
  externalReference?: string
  successUrl?: string
}

export async function createSubscription(
  config: AsaasConfig,
  input: CreateSubscriptionInput,
): Promise<AsaasSubscription> {
  return asaasRequest<AsaasSubscription>(config, '/subscriptions', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function deleteSubscription(config: AsaasConfig, subscriptionId: string): Promise<void> {
  await asaasRequest<unknown>(config, `/subscriptions/${subscriptionId}`, { method: 'DELETE' })
}

export async function getSubscriptionPayments(
  config: AsaasConfig,
  subscriptionId: string,
): Promise<AsaasPayment[]> {
  const res = await asaasRequest<{ data: AsaasPayment[] }>(
    config,
    `/subscriptions/${subscriptionId}/payments`,
  )
  return res.data ?? []
}

export interface AsaasPayment {
  id: string
  customer: string
  value: number
  netValue?: number
  status: string
  invoiceUrl?: string
  bankSlipUrl?: string
  pixQrCodeUrl?: string
}

export interface CreatePaymentInput {
  customer: string
  billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX'
  value: number
  dueDate: string // YYYY-MM-DD
  description?: string
  externalReference?: string
}

export async function createPayment(
  config: AsaasConfig,
  input: CreatePaymentInput,
): Promise<AsaasPayment> {
  return asaasRequest<AsaasPayment>(config, '/payments', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function getPaymentInvoiceUrl(config: AsaasConfig, paymentId: string): Promise<string | null> {
  try {
    const payment = await asaasRequest<AsaasPayment>(config, `/payments/${paymentId}`)
    return payment.invoiceUrl ?? payment.bankSlipUrl ?? payment.pixQrCodeUrl ?? null
  } catch {
    return null
  }
}
