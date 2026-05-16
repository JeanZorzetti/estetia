/**
 * Conexa Saúde API Client
 *
 * Plataforma de telemedicina brasileira
 * Core function: gerar link de teleconsulta
 *
 * Docs: https://developers.conexasaude.com.br/
 */

const CONEXA_BASE_URL = 'https://api.conexasaude.com.br/v1'

interface ConexaConfig {
  apiKey: string
  clinicId: string
}

interface TeleconsultaLink {
  url: string
  roomId: string
  expiresAt: string
  patientUrl: string
  doctorUrl: string
}

interface ConexaAccountInfo {
  clinicId: string
  clinicName: string
  status: string
}

/**
 * Validates Conexa credentials by checking account status
 */
export async function validateConexaCredentials(config: ConexaConfig): Promise<ConexaAccountInfo> {
  const response = await fetch(`${CONEXA_BASE_URL}/clinics/${config.clinicId}`, {
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`Conexa API error ${response.status}: ${body || response.statusText}`)
  }

  const data = await response.json()
  return {
    clinicId: data.id ?? config.clinicId,
    clinicName: data.name ?? 'Clínica',
    status: data.status ?? 'active',
  }
}

/**
 * Creates a teleconsulta room and returns patient + doctor access links
 */
export async function createTeleconsultaLink(
  config: ConexaConfig,
  options: {
    patientName: string
    patientEmail?: string
    scheduledAt?: string
    durationMinutes?: number
  }
): Promise<TeleconsultaLink> {
  const response = await fetch(`${CONEXA_BASE_URL}/rooms`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      clinicId: config.clinicId,
      patient: {
        name: options.patientName,
        email: options.patientEmail,
      },
      scheduledAt: options.scheduledAt,
      durationMinutes: options.durationMinutes ?? 30,
    }),
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`Conexa room creation error ${response.status}: ${body || response.statusText}`)
  }

  const data = await response.json()
  return {
    url: data.url ?? data.patientUrl,
    roomId: data.id ?? data.roomId,
    expiresAt: data.expiresAt ?? new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    patientUrl: data.patientUrl ?? data.url,
    doctorUrl: data.doctorUrl ?? data.url,
  }
}
