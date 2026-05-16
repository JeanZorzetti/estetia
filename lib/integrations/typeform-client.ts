/**
 * Typeform Responses & Forms API client.
 * Docs: https://www.typeform.com/developers/get-started/
 */

import { decrypt } from '@/lib/encryption'

const TYPEFORM_BASE = 'https://api.typeform.com'

function resolveToken(stored: string): string {
  if (stored.includes(':') && stored.split(':').length === 3) {
    return decrypt(stored)
  }
  return stored
}

async function typeformRequest<T>(
  tokenEncrypted: string,
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const token = resolveToken(tokenEncrypted)
  const res = await fetch(`${TYPEFORM_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Typeform ${res.status}: ${text || res.statusText}`)
  }
  return (await res.json()) as T
}

export async function getTypeform(token: string, formId: string) {
  return typeformRequest<{ id: string; title: string }>(token, `/forms/${formId}`)
}

export async function getLatestResponses(token: string, formId: string, pageSize = 25) {
  return typeformRequest<{
    items: Array<{
      response_id: string
      submitted_at: string
      answers?: Array<{ field: { ref: string; type: string }; type: string; [k: string]: unknown }>
    }>
  }>(token, `/forms/${formId}/responses?page_size=${pageSize}`)
}
