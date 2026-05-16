import { makeSettingsHandler } from '@/lib/integrations/settings-handlers'
export const POST = makeSettingsHandler({
  enabledColumn: 'typeformEnabled',
  fields: [
    { name: 'typeformApiKey', sensitive: true },
    { name: 'typeformFormId', sensitive: false },
  ],
})
