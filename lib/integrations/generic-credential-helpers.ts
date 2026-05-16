import { encrypt } from '@/lib/encryption'

export interface CredentialFieldSpec {
  name: string // Prisma column name
  sensitive: boolean // true → encrypted before persisting
}

/**
 * Generic builder for /api/integrations/<id>/settings POST handler payload.
 *
 * For each field:
 *  - sensitive=true & value present & not masked → encrypt(value)
 *  - sensitive=false & string value → persist raw
 *  - boolean `enabled` flag → toggles the {id}Enabled column
 */
export function buildSettingsData(
  body: Record<string, unknown>,
  enabledColumn: string,
  fields: CredentialFieldSpec[]
): Record<string, unknown> {
  const data: Record<string, unknown> = {}

  if (typeof body.enabled === 'boolean') {
    data[enabledColumn] = body.enabled
  }

  for (const f of fields) {
    const val = body[f.name]
    if (typeof val !== 'string') continue
    if (f.sensitive) {
      if (val && !val.startsWith('•')) {
        data[f.name] = encrypt(val)
      }
    } else {
      data[f.name] = val
    }
  }

  return data
}
