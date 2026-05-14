/**
 * NFS-e provider adapter — emit electronic service invoices on procedure completion.
 *
 * Supported providers (configured via env vars):
 *   - Focus NFe  (NFSE_PROVIDER=focus,  NFSE_FOCUS_TOKEN=...)
 *   - NFE.io     (NFSE_PROVIDER=nfeio,  NFSE_NFEIO_API_KEY=..., NFSE_NFEIO_COMPANY_ID=...)
 *   - Plug Notas (NFSE_PROVIDER=plugnotas, NFSE_PLUGNOTAS_API_KEY=...)
 *
 * Each adapter exposes the same interface: emit() → { numero, status, pdf?, xml? }
 */

import logger from '@/lib/logger'
import { prisma } from '@/lib/prisma'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NfseEmitInput {
  // Tomador (paciente / empresa)
  tomadorNome: string
  tomadorCpfCnpj?: string
  tomadorEmail?: string
  tomadorLogradouro?: string
  tomadorNumero?: string
  tomadorBairro?: string
  tomadorMunicipio?: string
  tomadorUf?: string
  tomadorCep?: string

  // Prestador (clínica)
  prestadorCnpj: string
  prestadorInscricaoMunicipal: string
  codigoMunicipio: string           // IBGE 7 dígitos

  // Serviço
  discriminacao: string             // Descrição do serviço na nota
  valorServicos: number
  codigoServico: string             // Lista de serviços municipal (ex: "14.01")
  aliquotaIss: number               // ex: 0.05 = 5%
  codigoTributacaoMunicipio?: string
  issRetido?: boolean

  // Referência interna
  guiaTissId?: string
  sessionId?: string
}

export interface NfseEmitResult {
  ok: boolean
  numero?: string
  status: 'issued' | 'pending' | 'error'
  pdfUrl?: string
  xmlUrl?: string
  message?: string
  rawResponse?: unknown
}

// ─── Focus NFe adapter ────────────────────────────────────────────────────────

async function emitFocusNfe(input: NfseEmitInput): Promise<NfseEmitResult> {
  const token = process.env.NFSE_FOCUS_TOKEN
  const env = process.env.NFSE_ENV === 'production' ? 'producao' : 'homologacao'
  if (!token) return { ok: false, status: 'error', message: 'NFSE_FOCUS_TOKEN not set' }

  const payload = {
    data_emissao: new Date().toISOString(),
    prestador: {
      cnpj: input.prestadorCnpj.replace(/\D/g, ''),
      inscricao_municipal: input.prestadorInscricaoMunicipal,
      codigo_municipio: input.codigoMunicipio,
    },
    tomador: {
      cpf_cnpj: input.tomadorCpfCnpj?.replace(/\D/g, '') ?? undefined,
      razao_social: input.tomadorNome,
      email: input.tomadorEmail ?? undefined,
      endereco: input.tomadorLogradouro ? {
        logradouro: input.tomadorLogradouro,
        numero: input.tomadorNumero ?? 'S/N',
        bairro: input.tomadorBairro ?? '',
        codigo_municipio: input.codigoMunicipio,
        uf: input.tomadorUf ?? '',
        cep: input.tomadorCep?.replace(/\D/g, '') ?? '',
      } : undefined,
    },
    servico: {
      aliquota: input.aliquotaIss,
      discriminacao: input.discriminacao,
      iss_retido: input.issRetido ? '1' : '2',
      item_lista_servico: input.codigoServico,
      codigo_tributacao_municipio: input.codigoTributacaoMunicipio ?? undefined,
      valor_servicos: input.valorServicos,
    },
  }

  try {
    const res = await fetch(`https://api.focusnfe.com.br/v2/nfse?ref=${Date.now()}`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${token}:`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    })

    const data = await res.json() as { status?: string; numero_nfse?: string; caminho_pdf_nfse?: string; caminho_xml_nfse?: string; mensagem_sefaz?: string }

    if (res.ok && (data.status === 'autorizado' || data.status === 'processando_autorizacao')) {
      return {
        ok: true,
        status: data.status === 'autorizado' ? 'issued' : 'pending',
        numero: data.numero_nfse,
        pdfUrl: data.caminho_pdf_nfse,
        xmlUrl: data.caminho_xml_nfse,
        rawResponse: data,
      }
    }

    return { ok: false, status: 'error', message: data.mensagem_sefaz ?? JSON.stringify(data), rawResponse: data }
  } catch (err) {
    return { ok: false, status: 'error', message: String(err) }
  }
}

// ─── NFE.io adapter ───────────────────────────────────────────────────────────

async function emitNfeIo(input: NfseEmitInput): Promise<NfseEmitResult> {
  const apiKey = process.env.NFSE_NFEIO_API_KEY
  const companyId = process.env.NFSE_NFEIO_COMPANY_ID
  if (!apiKey || !companyId) {
    return { ok: false, status: 'error', message: 'NFSE_NFEIO_API_KEY or NFSE_NFEIO_COMPANY_ID not set' }
  }

  const payload = {
    borrower: {
      name: input.tomadorNome,
      federalTaxNumber: input.tomadorCpfCnpj?.replace(/\D/g, '') ?? undefined,
      email: input.tomadorEmail ?? undefined,
    },
    cityServiceCode: input.codigoServico,
    description: input.discriminacao,
    servicesAmount: input.valorServicos,
    issTaxRate: input.aliquotaIss,
    issTaxType: input.issRetido ? 'withheld' : 'collected',
  }

  try {
    const res = await fetch(
      `https://api.nfe.io/v1/companies/${companyId}/serviceinvoices`,
      {
        method: 'POST',
        headers: { 'Authorization': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15000),
      }
    )

    const data = await res.json() as { id?: string; flowStatus?: string; number?: string; pdfUrl?: string; xmlUrl?: string }

    if (res.ok && data.id) {
      return {
        ok: true,
        status: data.flowStatus === 'IssuedWithErrors' ? 'error' : 'pending',
        numero: data.number,
        pdfUrl: data.pdfUrl,
        xmlUrl: data.xmlUrl,
        rawResponse: data,
      }
    }

    return { ok: false, status: 'error', message: JSON.stringify(data), rawResponse: data }
  } catch (err) {
    return { ok: false, status: 'error', message: String(err) }
  }
}

// ─── Main emit function ───────────────────────────────────────────────────────

export async function emitNfse(input: NfseEmitInput): Promise<NfseEmitResult> {
  const provider = (process.env.NFSE_PROVIDER ?? 'focus').toLowerCase()

  let result: NfseEmitResult

  if (provider === 'nfeio') {
    result = await emitNfeIo(input)
  } else {
    result = await emitFocusNfe(input)
  }

  // Persist result if linked to a GuiaTiss
  if (input.guiaTissId) {
    try {
      await prisma.guiaTiss.update({
        where: { id: input.guiaTissId },
        data: {
          nfseNumero: result.numero ?? null,
          nfseStatus: result.status,
          nfsePayload: result.rawResponse as object ?? undefined,
        },
      })
    } catch (err) {
      logger.error({ err, guiaTissId: input.guiaTissId }, 'Failed to persist NFS-e result')
    }
  }

  if (!result.ok) {
    logger.error({ result, provider }, 'NFS-e emission failed')
  } else {
    logger.info({ numero: result.numero, provider }, 'NFS-e emitted')
  }

  return result
}

/**
 * Quick health check — verifies provider credentials without emitting.
 */
export async function checkNfseConfig(): Promise<{ configured: boolean; provider: string; message?: string }> {
  const provider = (process.env.NFSE_PROVIDER ?? 'focus').toLowerCase()

  if (provider === 'focus' && !process.env.NFSE_FOCUS_TOKEN) {
    return { configured: false, provider, message: 'NFSE_FOCUS_TOKEN missing' }
  }
  if (provider === 'nfeio' && (!process.env.NFSE_NFEIO_API_KEY || !process.env.NFSE_NFEIO_COMPANY_ID)) {
    return { configured: false, provider, message: 'NFSE_NFEIO_API_KEY or NFSE_NFEIO_COMPANY_ID missing' }
  }

  return { configured: true, provider }
}
