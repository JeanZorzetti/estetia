/**
 * Whitebook (PEBMED) API Client
 *
 * Ferramenta de decisão clínica e protocolos — parceria PEBMED
 * Core function: gerar link contextual deep-link para bula/CID
 *
 * Docs: https://pebmed.com.br/whitebook/integracao/
 */

const WHITEBOOK_BASE_URL = 'https://api.whitebook.com.br/v1'

interface WhitebookConfig {
  apiKey: string
}

interface WhitebookDeepLink {
  url: string
  type: 'drug' | 'cid' | 'protocol' | 'calculator'
  query: string
  expiresAt: string
}

interface WhitebookAccountInfo {
  partnerId: string
  partnerName: string
  plan: string
  activeUsers: number
}

/**
 * Validates Whitebook credentials by fetching partner account info
 */
export async function validateWhitebookCredentials(config: WhitebookConfig): Promise<WhitebookAccountInfo> {
  const response = await fetch(`${WHITEBOOK_BASE_URL}/partner/account`, {
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`Whitebook API error ${response.status}: ${body || response.statusText}`)
  }

  const data = await response.json()
  return {
    partnerId: data.id ?? 'unknown',
    partnerName: data.name ?? 'Parceiro',
    plan: data.plan ?? 'standard',
    activeUsers: data.activeUsers ?? 0,
  }
}

/**
 * Generates a signed deep-link to open a specific drug, CID, or protocol in Whitebook
 *
 * @param config - Whitebook credentials
 * @param type - Type of content to open
 * @param query - Search term or code (e.g., drug name, CID-10 code)
 * @param context - Optional clinical context (patient age, weight, diagnosis)
 */
export async function generateDeepLink(
  config: WhitebookConfig,
  type: 'drug' | 'cid' | 'protocol' | 'calculator',
  query: string,
  context?: {
    patientAge?: number
    patientWeight?: number
    diagnosis?: string
  }
): Promise<WhitebookDeepLink> {
  const params = new URLSearchParams({
    type,
    q: query,
    ...(context?.patientAge ? { age: String(context.patientAge) } : {}),
    ...(context?.patientWeight ? { weight: String(context.patientWeight) } : {}),
    ...(context?.diagnosis ? { diagnosis: context.diagnosis } : {}),
  })

  const response = await fetch(`${WHITEBOOK_BASE_URL}/deeplink?${params}`, {
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    // Fallback: build direct app link if API fails
    const fallbackUrl = buildFallbackDeepLink(type, query)
    return {
      url: fallbackUrl,
      type,
      query,
      expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    }
  }

  const data = await response.json()
  return {
    url: data.url,
    type,
    query,
    expiresAt: data.expiresAt ?? new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
  }
}

/**
 * Builds a fallback deep-link using the Whitebook app URI scheme
 * Used when the API is unavailable but the app is installed on mobile
 */
function buildFallbackDeepLink(
  type: 'drug' | 'cid' | 'protocol' | 'calculator',
  query: string
): string {
  const encoded = encodeURIComponent(query)
  const paths: Record<string, string> = {
    drug: `bulas/${encoded}`,
    cid: `cid/${encoded}`,
    protocol: `protocolos/${encoded}`,
    calculator: `calculadoras/${encoded}`,
  }
  return `whitebook://${paths[type] ?? `busca/${encoded}`}`
}

/**
 * Searches Whitebook content library (drugs, CIDs, protocols)
 */
export async function searchWhitebook(
  config: WhitebookConfig,
  query: string,
  type?: 'drug' | 'cid' | 'protocol'
): Promise<Array<{ id: string; title: string; type: string; summary: string }>> {
  const params = new URLSearchParams({ q: query, ...(type ? { type } : {}) })
  const response = await fetch(`${WHITEBOOK_BASE_URL}/search?${params}`, {
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`Whitebook search error ${response.status}: ${body}`)
  }

  const data = await response.json()
  return (data.results ?? []).map((r: { id: string; title: string; type: string; summary?: string }) => ({
    id: r.id,
    title: r.title,
    type: r.type,
    summary: r.summary ?? '',
  }))
}
