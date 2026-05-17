import { decrypt } from '@/lib/encryption'

export interface MailchimpContactData {
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  tags?: string[]
}

export function createMailchimpClient(encryptedApiKey: string, server: string) {
  const apiKey = decrypt(encryptedApiKey)
  const baseUrl = `https://${server}.api.mailchimp.com/3.0`

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  }

  return {
    async getAccountInfo() {
      const res = await fetch(baseUrl, { headers })
      if (!res.ok) throw new Error(`Mailchimp auth failed: ${res.status}`)
      return res.json() as Promise<{ account_name: string; email: string }>
    },

    async addOrUpdateContact(listId: string, contact: MailchimpContactData) {
      const mergeFields: Record<string, string> = {}
      if (contact.firstName) mergeFields.FNAME = contact.firstName
      if (contact.lastName) mergeFields.LNAME = contact.lastName
      if (contact.phone) mergeFields.PHONE = contact.phone

      const emailHash = await hashEmail(contact.email)
      const url = `${baseUrl}/lists/${listId}/members/${emailHash}`

      const res = await fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          email_address: contact.email,
          status_if_new: 'subscribed',
          merge_fields: mergeFields,
          tags: contact.tags ?? [],
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail ?? `Mailchimp error: ${res.status}`)
      }

      return res.json()
    },
  }
}

async function hashEmail(email: string): Promise<string> {
  const lower = email.toLowerCase()
  const encoder = new TextEncoder()
  const data = encoder.encode(lower)
  const hashBuffer = await crypto.subtle.digest('MD5', data).catch(() => null)
  if (hashBuffer) {
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  }
  // Fallback: use btoa for environments without MD5
  return Buffer.from(lower).toString('hex')
}
