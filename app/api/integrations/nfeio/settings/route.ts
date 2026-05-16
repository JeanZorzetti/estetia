import { makeSettingsHandler } from '@/lib/integrations/settings-handlers'

export const POST = makeSettingsHandler({
  enabledColumn: 'nfeioEnabled',
  fields: [
    { name: 'nfeioApiKey', sensitive: true },
    { name: 'nfeioCompanyId', sensitive: false },
  ],
})
