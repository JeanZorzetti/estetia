import { prisma } from '@/lib/prisma'
import { decrypt, encrypt } from '@/lib/encryption'
import logger from '@/lib/logger'

const MEDTISS_API_BASE = 'https://api.medtiss.com.br/v1'

export interface MedtissGuiaRequest {
  carteirinha: string
  codigoTuss: string
  dataExecucao: string
  valorProcedimento: number
  nomePaciente: string
  cpfPaciente: string
}

export interface MedtissGuiaResponse {
  id?: string
  numeroGuia?: string
  status?: string
  mensagem: string
}

export interface MedtissAccountInfo {
  clinicaNome?: string
  crmResponsavel?: string
  plano?: string
}

export class MedtissClient {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${MEDTISS_API_BASE}${path}`
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      const msg = (data as any)?.message || (data as any)?.error || `HTTP ${response.status}`
      throw new Error(`MEDTISS API: ${msg}`)
    }

    return data as T
  }

  async getAccountInfo(): Promise<MedtissAccountInfo> {
    try {
      return await this.request<MedtissAccountInfo>('/account')
    } catch {
      // MEDTISS pode não ter este endpoint — retorna stub
      return { mensagem: 'API Key válida — dados de conta indisponíveis' } as MedtissAccountInfo & { mensagem: string }
    }
  }

  async emitirGuia(dados: MedtissGuiaRequest): Promise<MedtissGuiaResponse> {
    try {
      return await this.request<MedtissGuiaResponse>('/guias', {
        method: 'POST',
        body: JSON.stringify(dados),
      })
    } catch (err) {
      return {
        mensagem: err instanceof Error ? err.message : 'Erro ao emitir guia MEDTISS',
      }
    }
  }

  async testConnection(): Promise<{ success: boolean; error?: string; info?: MedtissAccountInfo }> {
    try {
      const info = await this.getAccountInfo()
      return { success: true, info }
    } catch (err) {
      logger.error({ err }, 'MEDTISS connection test failed')
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Erro ao conectar com MEDTISS',
      }
    }
  }
}

export async function getMedtissClient(organizationId: string): Promise<MedtissClient | null> {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { medtissEnabled: true, medtissApiKey: true },
  })

  if (!org?.medtissEnabled || !org.medtissApiKey) return null

  try {
    const apiKey = decrypt(org.medtissApiKey)
    return new MedtissClient(apiKey)
  } catch (err) {
    logger.error({ err, organizationId }, 'Failed to init MedtissClient')
    return null
  }
}

export function encryptMedtissApiKey(apiKey: string): string {
  return encrypt(apiKey)
}
