import { makeSettingsHandler } from '@/lib/integrations/settings-handlers'
export const POST = makeSettingsHandler({
  enabledColumn: 'unimedEnabled',
  fields: [{ name: 'unimedCredentialsJson', sensitive: true }],
})
