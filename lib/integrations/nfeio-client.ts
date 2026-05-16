/**
 * NFE.io API client.
 * Docs: https://nfe.io/docs/
 *
 * Auth: header Authorization com a API key
 * Base URL: https://api.nfe.io/v1
 */

export interface NfeioConfig {
  apiKey: string
  companyId: string
}

export interface NfeioNfseInput {
  tomadorNome: string
  tomadorCpfCnpj?: string
  tomadorEmail?: string
  discriminacao: string
  valorServicos: number
  codigoServico: string
  aliquotaIss?: number
  issRetido?: boolean
}

export interface NfeioNfseResult {
  ok: boolean
  id?: string
  numero?: string
  status: 'issued' | 'pending' | 'error'
  pdfUrl?: string
  xmlUrl?: string
  message?: string
}

export interface NfeioCompany {
  id?: string
  name?: string
  federalTaxNumber?: string
}

async function nfeioRequest<T>(
  config: NfeioConfig,
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const res = await fetch(`https://api.nfe.io/v1${path}`, {
    ...init,
    headers: {
      Authorization: config.apiKey,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`NFE.io ${res.status}: ${text || res.statusText}`)
  }
  return res.json() as Promise<T>
}

export async function getNfeioCompany(config: NfeioConfig): Promise<NfeioCompany> {
  return nfeioRequest<NfeioCompany>(config, `/companies/${config.companyId}`)
}

export async function emitirNfse(
  config: NfeioConfig,
  input: NfeioNfseInput
): Promise<NfeioNfseResult> {
  try {
    const payload = {
      borrower: {
        name: input.tomadorNome,
        federalTaxNumber: input.tomadorCpfCnpj?.replace(/\D/g, '') ?? undefined,
        email: input.tomadorEmail ?? undefined,
      },
      cityServiceCode: input.codigoServico,
      description: input.discriminacao,
      servicesAmount: input.valorServicos,
      issTaxRate: input.aliquotaIss ?? 0.05,
      issTaxType: input.issRetido ? 'withheld' : 'collected',
    }

    const data = await nfeioRequest<{ id?: string; number?: string; flowStatus?: string; pdfUrl?: string; xmlUrl?: string }>(
      config,
      `/companies/${config.companyId}/serviceinvoices`,
      { method: 'POST', body: JSON.stringify(payload) }
    )

    const isIssued = data.flowStatus && !['IssuedWithErrors', 'Error'].includes(data.flowStatus)

    return {
      ok: true,
      id: data.id,
      numero: data.number,
      status: isIssued ? 'pending' : 'error',
      pdfUrl: data.pdfUrl,
      xmlUrl: data.xmlUrl,
    }
  } catch (err) {
    return { ok: false, status: 'error', message: String(err) }
  }
}
