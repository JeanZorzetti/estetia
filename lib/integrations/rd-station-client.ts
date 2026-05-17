import { decrypt } from '@/lib/encryption'

export interface RDStationContactData {
  email: string
  name?: string
  mobile_phone?: string
  job_title?: string
  tags?: string[]
}

const TOKEN_URL = 'https://api.rd.services/auth/token'
const API_URL = 'https://api.rd.services'

export function createRDStationClient(
  clientId: string,
  encryptedClientSecret: string,
  encryptedRefreshToken: string
) {
  const clientSecret = decrypt(encryptedClientSecret)
  const refreshToken = decrypt(encryptedRefreshToken)

  async function getAccessToken(): Promise<string> {
    const res = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    })

    if (!res.ok) throw new Error(`RD Station token refresh failed: ${res.status}`)
    const data = await res.json()
    return data.access_token as string
  }

  return {
    async getAccountInfo() {
      const token = await getAccessToken()
      const res = await fetch(`${API_URL}/marketing/account_info`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error(`RD Station auth failed: ${res.status}`)
      return res.json()
    },

    async upsertContact(contact: RDStationContactData) {
      const token = await getAccessToken()

      const payload = {
        event_type: 'CONVERSION',
        event_family: 'CDP',
        payload: {
          email: contact.email,
          name: contact.name ?? '',
          mobile_phone: contact.mobile_phone ?? '',
          job_title: contact.job_title ?? '',
          tags: contact.tags ?? ['estetia-crm'],
        },
      }

      const res = await fetch(`${API_URL}/marketing/conversions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message ?? `RD Station error: ${res.status}`)
      }

      return { success: true }
    },
  }
}
