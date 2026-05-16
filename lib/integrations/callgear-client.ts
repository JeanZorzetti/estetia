/**
 * CallGear API client (stub — provider-specific endpoints vary by region)
 */

interface CgConfig {
  apiKey: string
}

export async function ping({ apiKey }: CgConfig) {
  if (!apiKey) throw new Error('CallGear API key required')
  return { ok: true, providerHint: 'callgear-stub' }
}
