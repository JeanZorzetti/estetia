/**
 * Asana API client.
 * Docs: https://developers.asana.com/reference
 */

import { decrypt } from '@/lib/encryption'

const ASANA_BASE = 'https://app.asana.com/api/1.0'

function resolveToken(stored: string): string {
  if (stored.includes(':') && stored.split(':').length === 3) {
    return decrypt(stored)
  }
  return stored
}

async function asanaRequest<T>(
  tokenEncrypted: string,
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const token = resolveToken(tokenEncrypted)
  const res = await fetch(`${ASANA_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(init.headers ?? {}),
    },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Asana ${res.status}: ${text || res.statusText}`)
  }
  const data = (await res.json()) as { data: T }
  return data.data
}

export async function getAsanaProject(token: string, projectId: string) {
  return asanaRequest<{ gid: string; name: string }>(token, `/projects/${projectId}`)
}

export async function createAsanaTask(
  token: string,
  projectId: string,
  name: string,
  notes?: string
) {
  return asanaRequest<{ gid: string; permalink_url: string }>(token, '/tasks', {
    method: 'POST',
    body: JSON.stringify({ data: { name, notes, projects: [projectId] } }),
  })
}
