/**
 * Trello API client.
 * Docs: https://developer.atlassian.com/cloud/trello/rest/
 */

import { decrypt } from '@/lib/encryption'

const TRELLO_BASE = 'https://api.trello.com/1'

function resolveToken(stored: string): string {
  if (stored.includes(':') && stored.split(':').length === 3) {
    return decrypt(stored)
  }
  return stored
}

function buildAuthQS(apiKey: string, tokenEncrypted: string): string {
  const token = resolveToken(tokenEncrypted)
  return `key=${encodeURIComponent(apiKey)}&token=${encodeURIComponent(token)}`
}

export async function getTrelloBoard(apiKey: string, token: string, boardId: string) {
  const res = await fetch(
    `${TRELLO_BASE}/boards/${boardId}?${buildAuthQS(apiKey, token)}&fields=name,url`
  )
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Trello ${res.status}: ${text || res.statusText}`)
  }
  return (await res.json()) as { id: string; name: string; url: string }
}

export async function getBoardLists(apiKey: string, token: string, boardId: string) {
  const res = await fetch(
    `${TRELLO_BASE}/boards/${boardId}/lists?${buildAuthQS(apiKey, token)}`
  )
  if (!res.ok) throw new Error(`Trello lists ${res.status}`)
  return (await res.json()) as Array<{ id: string; name: string }>
}

export async function createTrelloCard(
  apiKey: string,
  token: string,
  listId: string,
  name: string,
  desc?: string
) {
  const res = await fetch(
    `${TRELLO_BASE}/cards?${buildAuthQS(apiKey, token)}&idList=${encodeURIComponent(listId)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, desc }),
    }
  )
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Trello card ${res.status}: ${text || res.statusText}`)
  }
  return (await res.json()) as { id: string; shortUrl: string }
}
