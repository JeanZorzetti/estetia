/**
 * Outgoing webhook dispatch helper.
 * Used by Zapier and Make integrations to push events out of Estetia CRM.
 */

import { decrypt } from '@/lib/encryption'

function resolveUrl(stored: string): string {
  if (stored.includes(':') && stored.split(':').length === 3) {
    try {
      return decrypt(stored)
    } catch {
      return stored
    }
  }
  return stored
}

export interface WebhookEvent {
  event: string
  occurredAt: string
  organizationId: string
  data: Record<string, unknown>
}

export async function dispatchWebhook(urlEncrypted: string, event: WebhookEvent): Promise<void> {
  const url = resolveUrl(urlEncrypted)
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Webhook ${res.status}: ${text || res.statusText}`)
  }
}
