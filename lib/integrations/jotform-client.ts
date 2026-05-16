/**
 * JotForm API client.
 * Docs: https://api.jotform.com/docs/
 */

import { decrypt } from '@/lib/encryption'

const JOTFORM_BASE = 'https://api.jotform.com'

function resolveToken(stored: string): string {
  if (stored.includes(':') && stored.split(':').length === 3) {
    return decrypt(stored)
  }
  return stored
}

async function jotformRequest<T>(
  tokenEncrypted: string,
  path: string
): Promise<T> {
  const token = resolveToken(tokenEncrypted)
  const sep = path.includes('?') ? '&' : '?'
  const res = await fetch(`${JOTFORM_BASE}${path}${sep}apiKey=${encodeURIComponent(token)}`)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`JotForm ${res.status}: ${text || res.statusText}`)
  }
  const data = (await res.json()) as { responseCode: number; content: T; message?: string }
  if (data.responseCode !== 200) {
    throw new Error(data.message ?? `JotForm responseCode ${data.responseCode}`)
  }
  return data.content
}

export async function getJotform(token: string, formId: string) {
  return jotformRequest<{ id: string; title: string; status: string }>(
    token,
    `/form/${formId}`
  )
}

export async function getJotformSubmissions(token: string, formId: string, limit = 20) {
  return jotformRequest<
    Array<{ id: string; created_at: string; answers: Record<string, { answer?: unknown }> }>
  >(token, `/form/${formId}/submissions?limit=${limit}`)
}
