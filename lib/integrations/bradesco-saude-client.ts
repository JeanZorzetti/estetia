import { prisma } from '@/lib/prisma'
import { decrypt, encrypt } from '@/lib/encryption'
import logger from '@/lib/logger'

export interface BradescoSaudeCredentials {
  codigoPrestador: string
  senha: string
  cnpjPrestador?: string
}

export interface ElegibilidadeBradesco {
  elegivel: boolean
  nomeBeneficiario?: string
  matricula?: string
  plano?: string
  mensagem?: string
}

export class BradescoSaudeClient {
  private credentials: BradescoSaudeCredentials

  constructor(credentials: BradescoSaudeCredentials) {
    this.credentials = credentials
  }

  async verificarElegibilidade(carteirinha: string): Promise<ElegibilidadeBradesco> {
    // Stub: Bradesco Saúde usa portal TISS próprio com certificado A1
    const carteirinhaDigits = carteirinha.replace(/\D/g, '')
    if (carteirinhaDigits.length < 8) {
      return { elegivel: false, mensagem: 'Número de carteirinha inválido' }
    }

    return {
      elegivel: true,
      nomeBeneficiario: 'VERIFICAÇÃO PENDENTE',
      matricula: carteirinhaDigits,
      plano: 'Consultar portal Bradesco Saúde',
      mensagem: 'Integração stub — portal Bradesco Saúde exige certificado A1 + credenciais de prestador',
    }
  }

  async testConnection(): Promise<{ success: boolean; error?: string }> {
    if (!this.credentials.codigoPrestador || !this.credentials.senha) {
      return { success: false, error: 'Código do prestador e senha são obrigatórios' }
    }
    return { success: true }
  }
}

export async function getBradescoSaudeClient(organizationId: string): Promise<BradescoSaudeClient | null> {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { bradescoSaudeEnabled: true, bradescoSaudeCredentialsJson: true },
  })

  if (!org?.bradescoSaudeEnabled || !org.bradescoSaudeCredentialsJson) return null

  try {
    const json = decrypt(org.bradescoSaudeCredentialsJson)
    const credentials = JSON.parse(json) as BradescoSaudeCredentials
    return new BradescoSaudeClient(credentials)
  } catch (err) {
    logger.error({ err, organizationId }, 'Failed to init BradescoSaudeClient')
    return null
  }
}

export function encryptBradescoSaudeCredentials(credentials: BradescoSaudeCredentials): string {
  return encrypt(JSON.stringify(credentials))
}
