import { prisma } from '@/lib/prisma'
import { decrypt, encrypt } from '@/lib/encryption'
import logger from '@/lib/logger'

export interface HapvidaCredentials {
  codigoPrestador: string
  senha: string
  cnpjPrestador?: string
  regional?: string // ex: "CE", "SP", "RN"
}

export interface ElegibilidadeHapvida {
  elegivel: boolean
  nomeBeneficiario?: string
  matricula?: string
  plano?: string
  regional?: string
  mensagem?: string
}

export class HapvidaClient {
  private credentials: HapvidaCredentials

  constructor(credentials: HapvidaCredentials) {
    this.credentials = credentials
  }

  async verificarElegibilidade(carteirinha: string): Promise<ElegibilidadeHapvida> {
    // Stub: Hapvida NotreDame Intermédica usa portal TISS + certificado por regional
    const carteirinhaDigits = carteirinha.replace(/\D/g, '')
    if (carteirinhaDigits.length < 8) {
      return { elegivel: false, mensagem: 'Número de carteirinha inválido' }
    }

    return {
      elegivel: true,
      nomeBeneficiario: 'VERIFICAÇÃO PENDENTE',
      matricula: carteirinhaDigits,
      regional: this.credentials.regional ?? 'N/A',
      plano: 'Consultar portal Hapvida NotreDame',
      mensagem: 'Integração stub — portal Hapvida exige certificado A1 + credenciais regionais',
    }
  }

  async testConnection(): Promise<{ success: boolean; error?: string }> {
    if (!this.credentials.codigoPrestador || !this.credentials.senha) {
      return { success: false, error: 'Código do prestador e senha são obrigatórios' }
    }
    return { success: true }
  }
}

export async function getHapvidaClient(organizationId: string): Promise<HapvidaClient | null> {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { hapvidaEnabled: true, hapvidaCredentialsJson: true },
  })

  if (!org?.hapvidaEnabled || !org.hapvidaCredentialsJson) return null

  try {
    const json = decrypt(org.hapvidaCredentialsJson)
    const credentials = JSON.parse(json) as HapvidaCredentials
    return new HapvidaClient(credentials)
  } catch (err) {
    logger.error({ err, organizationId }, 'Failed to init HapvidaClient')
    return null
  }
}

export function encryptHapvidaCredentials(credentials: HapvidaCredentials): string {
  return encrypt(JSON.stringify(credentials))
}
