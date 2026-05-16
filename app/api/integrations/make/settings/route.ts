import { makeSettingsHandler } from '@/lib/integrations/settings-handlers'
export const POST = makeSettingsHandler({
  enabledColumn: 'makeEnabled',
  fields: [{ name: 'makeWebhookUrl', sensitive: true }],
})
