import { prisma } from '@/lib/prisma'
import { decrypt, encrypt } from '@/lib/encryption'
import logger from '@/lib/logger'

export interface AmilCredentials {
  codigoPrestador: string
  senha: string
  cnpjPrestador?: string
}

export interface ElegibilidadeAmil {
  elegivel: boolean
  nomeBeneficiario?: string
  matricula?: string
  plano?: string
  mensagem?: string
}

export class AmilClient {
  private credentials: AmilCredentials

  constructor(credentials: AmilCredentials) {
    this.credentials = credentials
  }

  async verificarElegibilidade(carteirinha: string): Promise<ElegibilidadeAmil> {
    // Stub: Amil exige integração TISS/SOAP via certificado digital
    const carteirinhaDigits = carteirinha.replace(/\D/g, '')
    if (carteirinhaDigits.length < 8) {
      return { elegivel: false, mensagem: 'Número de carteirinha inválido' }
    }

    return {
      elegivel: true,
      nomeBeneficiario: 'VERIFICAÇÃO PENDENTE',
      matricula: carteirinhaDigits,
      plano: 'Consultar portal Amil',
      mensagem: 'Integração stub — API TISS Amil exige certificado A1 do prestador',
    }
  }

  async gerarGuia(dados: {
    carteirinha: string
    codigoTuss: string
    dataExecucao: string
    valorProcedimento: number
  }): Promise<{ numeroGuia?: string; mensagem: string }> {
    // Stub: emissão de guia via TISS
    return {
      mensagem: `Guia stub para carteirinha ${dados.carteirinha} — integração TISS pendente`,
    }
  }

  async testConnection(): Promise<{ success: boolean; error?: string }> {
    if (!this.credentials.codigoPrestador || !this.credentials.senha) {
      return { success: false, error: 'Código do prestador e senha são obrigatórios' }
    }
    return { success: true }
  }
}

export async function getAmilClient(organizationId: string): Promise<AmilClient | null> {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { amilEnabled: true, amilCredentialsJson: true },
  })

  if (!org?.amilEnabled || !org.amilCredentialsJson) return null

  try {
    const json = decrypt(org.amilCredentialsJson)
    const credentials = JSON.parse(json) as AmilCredentials
    return new AmilClient(credentials)
  } catch (err) {
    logger.error({ err, organizationId }, 'Failed to init AmilClient')
    return null
  }
}

export function encryptAmilCredentials(credentials: AmilCredentials): string {
  return encrypt(JSON.stringify(credentials))
}
