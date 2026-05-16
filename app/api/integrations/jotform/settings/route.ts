import { makeSettingsHandler } from '@/lib/integrations/settings-handlers'
export const POST = makeSettingsHandler({
  enabledColumn: 'jotformEnabled',
  fields: [
    { name: 'jotformApiKey', sensitive: true },
    { name: 'jotformFormId', sensitive: false },
  ],
})
