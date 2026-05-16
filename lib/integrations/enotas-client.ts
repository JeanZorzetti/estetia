/**
 * eNotas API client.
 * Docs: https://enotas.com.br/docs
 *
 * Auth: Bearer token no header Authorization
 * Base URL: https://api.enotas.com.br/v1
 */

export interface EnotasConfig {
  apiKey: string
}

export interface EnotasNfseInput {
  companyId: string
  tomadorNome: string
  tomadorCpfCnpj?: string
  tomadorEmail?: string
  discriminacao: string
  valorServicos: number
  codigoServico: string
  aliquotaIss?: number
  issRetido?: boolean
}

export interface EnotasNfseResult {
  ok: boolean
  numero?: string
  status: 'issued' | 'pending' | 'error'
  pdfUrl?: string
  xmlUrl?: string
  message?: string
}

export interface EnotasCompany {
  id?: string
  nome?: string
  cnpj?: string
}

async function enotasRequest<T>(
  config: EnotasConfig,
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const res = await fetch(`https://api.enotas.com.br/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`eNotas ${res.status}: ${text || res.statusText}`)
  }
  return res.json() as Promise<T>
}

export async function getEnotasAccount(config: EnotasConfig): Promise<EnotasCompany[]> {
  return enotasRequest<EnotasCompany[]>(config, '/empresas')
}

export async function emitirNfse(
  config: EnotasConfig,
  input: EnotasNfseInput
): Promise<EnotasNfseResult> {
  try {
    const payload = {
      tipo: 'NFS-e',
      ambiente: 'Producao',
      tomador: {
        razaoSocial: input.tomadorNome,
        cpfCnpj: input.tomadorCpfCnpj?.replace(/\D/g, '') ?? undefined,
        email: input.tomadorEmail ?? undefined,
      },
      servico: {
        descricao: input.discriminacao,
        valorTotal: input.valorServicos,
        codigoAtividade: input.codigoServico,
        aliquotaIss: input.aliquotaIss ?? 0.05,
        issRetido: input.issRetido ?? false,
      },
    }

    const data = await enotasRequest<{ id?: string; numero?: string; status?: string; urlPdf?: string; urlXml?: string }>(
      config,
      `/empresas/${input.companyId}/nfse`,
      { method: 'POST', body: JSON.stringify(payload) }
    )

    return {
      ok: true,
      numero: data.numero,
      status: data.status === 'Autorizado' ? 'issued' : 'pending',
      pdfUrl: data.urlPdf,
      xmlUrl: data.urlXml,
    }
  } catch (err) {
    return { ok: false, status: 'error', message: String(err) }
  }
}
