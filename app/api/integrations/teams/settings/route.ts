import { makeSettingsHandler } from '@/lib/integrations/settings-handlers'
export const POST = makeSettingsHandler({
  enabledColumn: 'teamsEnabled',
  fields: [{ name: 'teamsWebhookUrl', sensitive: true }],
})
