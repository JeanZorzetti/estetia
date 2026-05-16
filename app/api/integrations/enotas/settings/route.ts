import { makeSettingsHandler } from '@/lib/integrations/settings-handlers'

export const POST = makeSettingsHandler({
  enabledColumn: 'enotasEnabled',
  fields: [
    { name: 'enotasApiKey', sensitive: true },
    { name: 'enotasCompanyId', sensitive: false },
  ],
})
