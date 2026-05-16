import { makeSettingsHandler } from '@/lib/integrations/settings-handlers'
export const POST = makeSettingsHandler({
  enabledColumn: 'bradescoSaudeEnabled',
  fields: [{ name: 'bradescoSaudeCredentialsJson', sensitive: true }],
})
