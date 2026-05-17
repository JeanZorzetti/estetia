import { decrypt } from '@/lib/encryption'

export interface BrevoContactData {
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  attributes?: Record<string, string>
}

export function createBrevoClient(encryptedApiKey: string) {
  const apiKey = decrypt(encryptedApiKey)
  const baseUrl = 'https://api.brevo.com/v3'

  const headers = {
    'api-key': apiKey,
    'Content-Type': 'application/json',
  }

  return {
    async getAccountInfo() {
      const res = await fetch(`${baseUrl}/account`, { headers })
      if (!res.ok) throw new Error(`Brevo auth failed: ${res.status}`)
      return res.json() as Promise<{ companyName: string; email: string; plan: Array<{ type: string }> }>
    },

    async addOrUpdateContact(listId: string, contact: BrevoContactData) {
      const body: Record<string, unknown> = {
        email: contact.email,
        listIds: [Number(listId)],
        updateEnabled: true,
        attributes: {
          FIRSTNAME: contact.firstName ?? '',
          LASTNAME: contact.lastName ?? '',
          SMS: contact.phone ?? '',
          ...contact.attributes,
        },
      }

      const res = await fetch(`${baseUrl}/contacts`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      })

      if (!res.ok && res.status !== 204) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message ?? `Brevo error: ${res.status}`)
      }

      return { success: true }
    },
  }
}
