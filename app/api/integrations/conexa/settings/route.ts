import { makeSettingsHandler } from '@/lib/integrations/settings-handlers'
export const POST = makeSettingsHandler({
  enabledColumn: 'conexaEnabled',
  fields: [{ name: 'conexaApiKey', sensitive: true }],
})
