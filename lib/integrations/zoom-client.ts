/**
 * Zoom client (OAuth Server-to-Server).
 * Docs: https://developers.zoom.us/docs/internal-apps/s2s-oauth/
 */

const ZOOM_OAUTH = 'https://zoom.us/oauth/token'
const ZOOM_API = 'https://api.zoom.us/v2'

export interface ZoomConfig {
  accountId: string
  clientId: string
  clientSecret: string
}

async function getAccessToken(config: ZoomConfig): Promise<string> {
  const credentials = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')
  const url = `${ZOOM_OAUTH}?grant_type=account_credentials&account_id=${config.accountId}`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Zoom OAuth ${res.status}: ${text || res.statusText}`)
  }
  const data = (await res.json()) as { access_token?: string }
  if (!data.access_token) throw new Error('Zoom OAuth: access_token ausente')
  return data.access_token
}

export interface ZoomUserInfo {
  id?: string
  email?: string
  first_name?: string
  last_name?: string
  type?: number
  account_id?: string
}

export async function getMe(config: ZoomConfig): Promise<ZoomUserInfo> {
  const token = await getAccessToken(config)
  const res = await fetch(`${ZOOM_API}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Zoom API ${res.status}: ${text || res.statusText}`)
  }
  return res.json() as Promise<ZoomUserInfo>
}
