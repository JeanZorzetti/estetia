import { makeSettingsHandler } from '@/lib/integrations/settings-handlers'

export const POST = makeSettingsHandler({
  enabledColumn: 'brevoEnabled',
  fields: [
    { name: 'brevoApiKey', sensitive: true },
    { name: 'brevoListId', sensitive: false },
  ],
})
