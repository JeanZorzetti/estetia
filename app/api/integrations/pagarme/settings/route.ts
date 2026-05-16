import { makeSettingsHandler } from '@/lib/integrations/settings-handlers'

export const POST = makeSettingsHandler({
  enabledColumn: 'pagarmeEnabled',
  fields: [
    { name: 'pagarmeApiKey', sensitive: true },
    { name: 'pagarmeRecipientId', sensitive: false },
  ],
})
