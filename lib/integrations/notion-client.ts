/**
 * Notion API client (REST).
 * Docs: https://developers.notion.com/reference
 */

import { decrypt } from '@/lib/encryption'

const NOTION_BASE = 'https://api.notion.com/v1'
const NOTION_VERSION = '2022-06-28'

function resolveToken(stored: string): string {
  if (stored.includes(':') && stored.split(':').length === 3) {
    return decrypt(stored)
  }
  return stored
}

async function notionRequest<T>(
  tokenEncrypted: string,
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const token = resolveToken(tokenEncrypted)
  const res = await fetch(`${NOTION_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Notion ${res.status}: ${text || res.statusText}`)
  }
  return (await res.json()) as T
}

export async function getNotionDatabase(token: string, databaseId: string) {
  return notionRequest<{ id: string; title: Array<{ plain_text: string }> }>(
    token,
    `/databases/${databaseId}`
  )
}

export async function createPatientPage(
  token: string,
  databaseId: string,
  patient: { name: string; email?: string | null; phone?: string | null }
) {
  return notionRequest(token, '/pages', {
    method: 'POST',
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties: {
        Name: {
          title: [{ text: { content: patient.name } }],
        },
        ...(patient.email
          ? { Email: { email: patient.email } }
          : {}),
        ...(patient.phone
          ? { Phone: { phone_number: patient.phone } }
          : {}),
      },
    }),
  })
}
