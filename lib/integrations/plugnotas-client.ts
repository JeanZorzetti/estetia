/**
 * Plug.notas API client.
 * Docs: https://docs.plugnotas.com.br/
 *
 * Auth: header X-Api-Key
 * Base URL: https://app.plugnotas.com.br/api
 */

export interface PlugnotasConfig {
  apiKey: string
}

export interface PlugnotasNfseInput {
  cnpjPrestador: string
  tomadorNome: string
  tomadorCpfCnpj?: string
  tomadorEmail?: string
  discriminacao: string
  valorServicos: number
  codigoServico: string
  aliquotaIss?: number
  issRetido?: boolean
  codigoMunicipio?: string
}

export interface PlugnotasNfseResult {
  ok: boolean
  protocoloId?: string
  numero?: string
  status: 'issued' | 'pending' | 'error'
  pdfUrl?: string
  message?: string
}

export interface PlugnotasCertificate {
  cnpj?: string
  razaoSocial?: string
}

async function plugnotasRequest<T>(
  config: PlugnotasConfig,
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const res = await fetch(`https://app.plugnotas.com.br/api${path}`, {
    ...init,
    headers: {
      'X-Api-Key': config.apiKey,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Plug.notas ${res.status}: ${text || res.statusText}`)
  }
  return res.json() as Promise<T>
}

export async function getPlugnotasAccount(config: PlugnotasConfig): Promise<{ status?: string }> {
  return plugnotasRequest<{ status?: string }>(config, '/ping')
}

export async function emitirNfse(
  config: PlugnotasConfig,
  input: PlugnotasNfseInput
): Promise<PlugnotasNfseResult> {
  try {
    const payload = {
      nfse: [
        {
          prestador: {
            cpfCnpj: input.cnpjPrestador.replace(/\D/g, ''),
          },
          tomador: {
            razaoSocial: input.tomadorNome,
            cpfCnpj: input.tomadorCpfCnpj?.replace(/\D/g, '') ?? undefined,
            email: input.tomadorEmail ?? undefined,
          },
          servico: {
            descricao: input.discriminacao,
            codigoTributacaoMunicipio: input.codigoServico,
            valorTotal: input.valorServicos,
            aliquota: input.aliquotaIss ?? 0.05,
            issRetido: input.issRetido ?? false,
            codigoMunicipio: input.codigoMunicipio ?? '3550308',
          },
        },
      ],
    }

    const data = await plugnotasRequest<{ protocoloId?: string; situacao?: string }>(
      config,
      '/nfse',
      { method: 'POST', body: JSON.stringify(payload) }
    )

    return {
      ok: true,
      protocoloId: data.protocoloId,
      status: 'pending',
    }
  } catch (err) {
    return { ok: false, status: 'error', message: String(err) }
  }
}
