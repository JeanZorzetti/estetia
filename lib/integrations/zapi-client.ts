/**
 * Z-API client (Brazilian WhatsApp provider, paid SaaS).
 * Docs: https://developer.z-api.io/
 *
 * Each clinic brings its own Z-API account (BYO credentials).
 */

const ZAPI_BASE = 'https://api.z-api.io'

export interface ZapiConfig {
  instanceId: string
  instanceToken: string
  clientToken: string // security token (Client-Token header)
}

export interface ZapiStatus {
  connected: boolean
  smartphoneConnected?: boolean
  session?: string
}

async function zapiRequest<T>(
  config: ZapiConfig,
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const url = `${ZAPI_BASE}/instances/${config.instanceId}/token/${config.instanceToken}${path}`
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'Client-Token': config.clientToken,
      ...(init.headers || {}),
    },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Z-API ${res.status}: ${text || res.statusText}`)
  }
  return res.json() as Promise<T>
}

export async function getStatus(config: ZapiConfig): Promise<ZapiStatus> {
  type Response = { connected?: boolean; smartphoneConnected?: boolean; session?: string }
  const data = await zapiRequest<Response>(config, '/status')
  return {
    connected: Boolean(data.connected),
    smartphoneConnected: data.smartphoneConnected,
    session: data.session,
  }
}

export async function sendText(
  config: ZapiConfig,
  phone: string,
  message: string
): Promise<unknown> {
  return zapiRequest(config, '/send-text', {
    method: 'POST',
    body: JSON.stringify({ phone, message }),
  })
}

export async function sendImage(
  config: ZapiConfig,
  phone: string,
  image: string,
  caption?: string
): Promise<unknown> {
  return zapiRequest(config, '/send-image', {
    method: 'POST',
    body: JSON.stringify({ phone, image, caption }),
  })
}
