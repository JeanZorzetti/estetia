import { makeSettingsHandler } from '@/lib/integrations/settings-handlers'
export const POST = makeSettingsHandler({
  enabledColumn: 'amilEnabled',
  fields: [{ name: 'amilCredentialsJson', sensitive: true }],
})
