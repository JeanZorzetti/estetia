import { makeSettingsHandler } from '@/lib/integrations/settings-handlers'
export const POST = makeSettingsHandler({
  enabledColumn: 'hapvidaEnabled',
  fields: [{ name: 'hapvidaCredentialsJson', sensitive: true }],
})
