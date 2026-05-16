/**
 * Evolution API client (self-hosted WhatsApp gateway).
 * Docs: https://doc.evolution-api.com/
 *
 * Each clinic brings its own Evolution API instance (BYO infrastructure).
 */

export interface EvolutionConfig {
  baseUrl: string
  apiKey: string
  instance: string
}

export interface EvolutionInstanceStatus {
  state: 'open' | 'connecting' | 'close' | 'unknown'
  connected: boolean
}

async function evolutionRequest<T>(
  config: EvolutionConfig,
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const url = `${config.baseUrl.replace(/\/+$/, '')}${path}`
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      apikey: config.apiKey,
      ...(init.headers || {}),
    },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Evolution API ${res.status}: ${text || res.statusText}`)
  }
  return res.json() as Promise<T>
}

export async function getInstanceStatus(config: EvolutionConfig): Promise<EvolutionInstanceStatus> {
  type Response = { instance?: { state?: string } }
  const data = await evolutionRequest<Response>(
    config,
    `/instance/connectionState/${encodeURIComponent(config.instance)}`
  )
  const state = (data.instance?.state ?? 'unknown') as EvolutionInstanceStatus['state']
  return { state, connected: state === 'open' }
}

export async function getQrCode(config: EvolutionConfig): Promise<{ base64?: string; code?: string }> {
  type Response = { base64?: string; code?: string }
  return evolutionRequest<Response>(
    config,
    `/instance/connect/${encodeURIComponent(config.instance)}`
  )
}

export async function sendText(
  config: EvolutionConfig,
  to: string,
  text: string
): Promise<unknown> {
  return evolutionRequest(config, `/message/sendText/${encodeURIComponent(config.instance)}`, {
    method: 'POST',
    body: JSON.stringify({ number: to, text }),
  })
}

export async function logoutInstance(config: EvolutionConfig): Promise<unknown> {
  return evolutionRequest(config, `/instance/logout/${encodeURIComponent(config.instance)}`, {
    method: 'DELETE',
  })
}
