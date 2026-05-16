import { makeSettingsHandler } from '@/lib/integrations/settings-handlers'
export const POST = makeSettingsHandler({
  enabledColumn: 'doctoraliaEnabled',
  fields: [{ name: 'doctoraliaApiKey', sensitive: true }],
})
