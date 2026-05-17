import { decrypt } from '@/lib/encryption'

export interface MailerLiteContactData {
  email: string
  firstName?: string
  lastName?: string
  phone?: string
}

export function createMailerLiteClient(encryptedApiKey: string) {
  const apiKey = decrypt(encryptedApiKey)
  const baseUrl = 'https://connect.mailerlite.com/api'

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  }

  return {
    async getAccountInfo() {
      const res = await fetch(`${baseUrl}/me`, { headers })
      if (!res.ok) throw new Error(`MailerLite auth failed: ${res.status}`)
      const data = await res.json()
      return data.data as { email: string; username: string }
    },

    async addOrUpdateSubscriber(groupId: string, contact: MailerLiteContactData) {
      const body = {
        email: contact.email,
        fields: {
          name: contact.firstName ?? '',
          last_name: contact.lastName ?? '',
          phone: contact.phone ?? '',
        },
        groups: [groupId],
      }

      const res = await fetch(`${baseUrl}/subscribers`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      })

      if (!res.ok && res.status !== 200) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message ?? `MailerLite error: ${res.status}`)
      }

      return res.json()
    },
  }
}
