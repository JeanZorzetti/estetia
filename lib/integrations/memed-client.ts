/**
 * Memed API Client — Prescrição Digital
 *
 * API base: https://integrations.memed.com.br
 * Core function: gerar token de prescrição JWT para embed do widget Memed
 *
 * Docs: https://memed.com.br/integracao/
 */

import crypto from 'crypto'

const MEMED_BASE_URL = 'https://integrations.memed.com.br'

interface MemedConfig {
  apiKey: string
  publicKey?: string
}

interface MemedPrescriptionToken {
  token: string
  expiresAt: string
  widgetUrl: string
}

interface MemedAccountInfo {
  partnerId: string
  partnerName: string
  status: string
}

/**
 * Validates Memed credentials by fetching partner account info
 */
export async function validateMemedCredentials(config: MemedConfig): Promise<MemedAccountInfo> {
  const response = await fetch(`${MEMED_BASE_URL}/modulos/plataforma.sinapse-prescricao/app/verify`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    // Memed may return 200 with error body — handle both
    const body = await response.text().catch(() => '')
    throw new Error(`Memed API error ${response.status}: ${body || response.statusText}`)
  }

  const data = await response.json()

  if (data.error || data.status === 'error') {
    throw new Error(data.message ?? 'Credenciais Memed inválidas')
  }

  return {
    partnerId: data.data?.id ?? 'unknown',
    partnerName: data.data?.name ?? 'Parceiro',
    status: data.data?.status ?? 'active',
  }
}

/**
 * Generates a signed JWT token for Memed prescription widget embed
 *
 * The token embeds doctor info so the widget pre-populates the prescriber data.
 * Uses HMAC-SHA256 signature with the partner API key.
 */
export async function generatePrescriptionToken(
  config: MemedConfig,
  doctor: {
    name: string
    crm: string
    uf: string
    specialty?: string
    email?: string
  }
): Promise<MemedPrescriptionToken> {
  const now = Math.floor(Date.now() / 1000)
  const exp = now + 3600 // 1 hour

  const payload = {
    iat: now,
    exp,
    data: {
      externalId: `estetia-${doctor.crm}-${doctor.uf}`.toLowerCase(),
      name: doctor.name,
      crm: doctor.crm,
      uf: doctor.uf,
      specialty: doctor.specialty ?? 'Clínica Geral',
      email: doctor.email,
    },
  }

  // JWT signing (HS256)
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signingKey = config.publicKey ?? config.apiKey
  const signature = crypto
    .createHmac('sha256', signingKey)
    .update(`${header}.${body}`)
    .digest('base64url')

  const token = `${header}.${body}.${signature}`

  return {
    token,
    expiresAt: new Date(exp * 1000).toISOString(),
    widgetUrl: `https://memed.com.br/modulos/plataforma.sinapse-prescricao/build/sinapse-prescricao.min.js`,
  }
}

/**
 * Fetches prescription history for a doctor
 */
export async function getPrescriptionHistory(
  config: MemedConfig,
  doctorExternalId: string,
  page = 1
): Promise<{ prescriptions: Array<{ id: string; createdAt: string; status: string }> }> {
  const response = await fetch(
    `${MEMED_BASE_URL}/modulos/plataforma.sinapse-prescricao/app/prescriptions?externalId=${encodeURIComponent(doctorExternalId)}&page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        Accept: 'application/json',
      },
    }
  )

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`Memed prescriptions error ${response.status}: ${body}`)
  }

  const data = await response.json()
  return {
    prescriptions: (data.data ?? []).map((p: { id: string; attributes?: { created_at?: string; status?: string } }) => ({
      id: p.id,
      createdAt: p.attributes?.created_at ?? '',
      status: p.attributes?.status ?? 'unknown',
    })),
  }
}
