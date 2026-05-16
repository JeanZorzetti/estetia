import { makeSettingsHandler } from '@/lib/integrations/settings-handlers'
export const POST = makeSettingsHandler({
  enabledColumn: 'slackEnabled',
  fields: [{ name: 'slackWebhookUrl', sensitive: true }],
})
