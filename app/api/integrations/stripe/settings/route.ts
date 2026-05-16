import { makeSettingsHandler } from '@/lib/integrations/settings-handlers'

export const POST = makeSettingsHandler({
  enabledColumn: 'stripeEnabled',
  fields: [
    { name: 'stripeSecretKey', sensitive: true },
    { name: 'stripeWebhookSecret', sensitive: true },
  ],
})
