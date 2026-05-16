import { makeSettingsHandler } from '@/lib/integrations/settings-handlers'

export const POST = makeSettingsHandler({
  enabledColumn: 'mailerliteEnabled',
  fields: [
    { name: 'mailerliteApiKey', sensitive: true },
    { name: 'mailerliteGroupId', sensitive: false },
  ],
})
