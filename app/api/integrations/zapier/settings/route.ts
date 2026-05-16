import { makeSettingsHandler } from '@/lib/integrations/settings-handlers'
export const POST = makeSettingsHandler({
  enabledColumn: 'zapierEnabled',
  fields: [{ name: 'zapierWebhookUrl', sensitive: true }],
})
