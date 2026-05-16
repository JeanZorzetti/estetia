import { makeSettingsHandler } from '@/lib/integrations/settings-handlers'
export const POST = makeSettingsHandler({
  enabledColumn: 'memedEnabled',
  fields: [{ name: 'memedApiKey', sensitive: true }],
})
