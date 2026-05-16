/**
 * TikTok Business API client.
 * Docs: https://business-api.tiktok.com/portal/docs
 */

export interface TikTokAdsConfig {
  accessToken: string
  advertiserId: string
  pixelId?: string
}

const BASE_URL = 'https://business-api.tiktok.com/open_api/v1.3'

async function tiktokRequest<T>(
  config: Pick<TikTokAdsConfig, 'accessToken'>,
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${path}`
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'Access-Token': config.accessToken,
      ...(init.headers ?? {}),
    },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`TikTok API ${res.status}: ${text || res.statusText}`)
  }
  const json = (await res.json()) as { code: number; message: string; data: T }
  if (json.code !== 0) {
    throw new Error(`TikTok API error ${json.code}: ${json.message}`)
  }
  return json.data
}

export interface TikTokAdvertiser {
  advertiser_id: string
  advertiser_name: string
  status: string
}

export interface TikTokAdvertiserListResponse {
  list: TikTokAdvertiser[]
}

/**
 * Verifica acesso à conta de anunciante (Business Center).
 */
export async function getAdvertiserInfo(
  config: TikTokAdsConfig
): Promise<TikTokAdvertiser | undefined> {
  const data = await tiktokRequest<TikTokAdvertiserListResponse>(
    config,
    `/bc/advertiser/get/?bc_id=${config.advertiserId}&page_size=10`
  )
  return data.list?.[0]
}

export interface TikTokPixelEvent {
  pixel_code: string
  event: string
  timestamp: string
  context: {
    ip?: string
    user_agent?: string
    page?: { url?: string }
  }
  properties?: {
    value?: number
    currency?: string
    content_type?: string
  }
}

/**
 * Envia evento de conversão via TikTok Pixel (server-side).
 * Falha silenciosa — nunca quebra o fluxo principal.
 */
export async function trackPixelEvent(
  config: TikTokAdsConfig,
  event: Omit<TikTokPixelEvent, 'pixel_code'>
): Promise<void> {
  if (!config.pixelId) return
  try {
    await tiktokRequest(config, '/pixel/track/', {
      method: 'POST',
      body: JSON.stringify({
        pixel_code: config.pixelId,
        ...event,
      }),
    })
  } catch {
    // Falha silenciosa — integração de ads não deve quebrar fluxo do CRM
  }
}
