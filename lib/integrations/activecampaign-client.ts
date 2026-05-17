import { decrypt } from '@/lib/encryption'

export interface ActiveCampaignContactData {
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  tags?: string[]
}

export function createActiveCampaignClient(encryptedApiKey: string, accountUrl: string) {
  const apiKey = decrypt(encryptedApiKey)
  const baseUrl = accountUrl.replace(/\/$/, '')

  const headers = {
    'Api-Token': apiKey,
    'Content-Type': 'application/json',
  }

  return {
    async getAccountInfo() {
      const res = await fetch(`${baseUrl}/api/3/users/me`, { headers })
      if (!res.ok) throw new Error(`ActiveCampaign auth failed: ${res.status}`)
      const data = await res.json()
      return data.user as { username: string; email: string }
    },

    async addOrUpdateContact(contact: ActiveCampaignContactData) {
      const body = {
        contact: {
          email: contact.email,
          firstName: contact.firstName ?? '',
          lastName: contact.lastName ?? '',
          phone: contact.phone ?? '',
        },
      }

      const res = await fetch(`${baseUrl}/api/3/contact/sync`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message ?? `ActiveCampaign error: ${res.status}`)
      }

      const { contact: created } = await res.json()

      if (contact.tags?.length) {
        await Promise.all(
          contact.tags.map((tag) =>
            fetch(`${baseUrl}/api/3/contactTags`, {
              method: 'POST',
              headers,
              body: JSON.stringify({ contactTag: { contact: created.id, tag } }),
            }).catch(() => null)
          )
        )
      }

      return created
    },
  }
}
