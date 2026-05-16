/**
 * RingCentral REST API client
 * Docs: https://developers.ringcentral.com/api-reference
 */

const RC_API_BASE = 'https://platform.ringcentral.com'

interface RcConfig {
  jwtToken: string
}

export async function getMyExtension({ jwtToken }: RcConfig) {
  const res = await fetch(`${RC_API_BASE}/restapi/v1.0/account/~/extension/~`, {
    headers: { Authorization: `Bearer ${jwtToken}` },
  })
  if (!res.ok) throw new Error(`RingCentral: ${res.status} ${(await res.text()).slice(0, 200)}`)
  const data = await res.json()
  return { name: data.name as string, extensionNumber: data.extensionNumber as string }
}
