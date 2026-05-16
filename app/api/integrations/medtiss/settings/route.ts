import { makeSettingsHandler } from '@/lib/integrations/settings-handlers'
export const POST = makeSettingsHandler({
  enabledColumn: 'medtissEnabled',
  fields: [{ name: 'medtissApiKey', sensitive: true }],
})
