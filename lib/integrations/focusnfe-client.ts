/**
 * Focus NFe API client.
 * Docs: https://focusnfe.com.br/doc/
 */

export interface FocusNfeConfig {
  token: string
  environment: 'homologacao' | 'producao'
}

function baseUrl(env: FocusNfeConfig['environment']): string {
  return env === 'producao'
    ? 'https://api.focusnfe.com.br'
    : 'https://homologacao.focusnfe.com.br'
}

async function focusRequest<T>(
  config: FocusNfeConfig,
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const url = `${baseUrl(config.environment)}${path}`
  const credentials = Buffer.from(`${config.token}:`).toString('base64')
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${credentials}`,
      ...(init.headers || {}),
    },
  })
  if (!res.ok && res.status !== 404) {
    const text = await res.text().catch(() => '')
    throw new Error(`Focus NFe ${res.status}: ${text || res.statusText}`)
  }
  return res.json() as Promise<T>
}

export interface FocusEmpresa {
  cnpj?: string
  nome?: string
  email?: string
  habilita_nfse?: boolean
}

export async function listEmpresas(config: FocusNfeConfig): Promise<FocusEmpresa[]> {
  return focusRequest<FocusEmpresa[]>(config, '/v2/empresas')
}
