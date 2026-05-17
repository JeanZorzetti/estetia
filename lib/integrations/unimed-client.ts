import { prisma } from '@/lib/prisma'
import { decrypt, encrypt } from '@/lib/encryption'

export interface UnimedCredentials {
  codigoPrestador: string
  senha: string
  codigoOperadora?: string // Código ANS da Unimed singular
}

export interface ElegibilidadeResult {
  elegivel: boolean
  nomeBeneficiario?: string
  numeroCarteirinha?: string
  plano?: string
  validade?: string
  mensagem?: string
}

export class UnimedClient {
  private credentials: UnimedCredentials

  constructor(credentials: UnimedCredentials) {
    this.credentials = credentials
  }

  async verificarElegibilidade(cpf: string): Promise<ElegibilidadeResult> {
    // Stub: Unimed não tem API REST pública — SOAP/certificado A1 por singular
    // Esta implementação valida o CPF e retorna mock para homologação
    const cpfDigits = cpf.replace(/\D/g, '')
    if (cpfDigits.length !== 11) {
      return { elegivel: false, mensagem: 'CPF inválido — deve ter 11 dígitos' }
    }

    return {
      elegivel: true,
      nomeBeneficiario: 'VERIFICAÇÃO PENDENTE',
      plano: 'Consultar portal Unimed singular',
      mensagem: 'Integração stub — conecte ao portal da sua Unimed singular para dados reais',
    }
  }

  async testConnection(): Promise<{ success: boolean; error?: string }> {
    if (!this.credentials.codigoPrestador || !this.credentials.senha) {
      return { success: false, error: 'Credenciais incompletas' }
    }
    // Validação básica de formato — integração real exige certificado A1
    if (this.credentials.codigoPrestador.length < 4) {
      return { success: false, error: 'Código do prestador inválido (mínimo 4 caracteres)' }
    }
    return { success: true }
  }
}

export async function getUnimedClient(organizationId: string): Promise<UnimedClient | null> {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { unimedEnabled: true, unimedCredentialsJson: true },
  })

  if (!org?.unimedEnabled || !org.unimedCredentialsJson) return null

  try {
    const json = decrypt(org.unimedCredentialsJson)
    const credentials = JSON.parse(json) as UnimedCredentials
    return new UnimedClient(credentials)
  } catch {
    return null
  }
}

export function encryptUnimedCredentials(credentials: UnimedCredentials): string {
  return encrypt(JSON.stringify(credentials))
}
