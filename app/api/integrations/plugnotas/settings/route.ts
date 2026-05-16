import { makeSettingsHandler } from '@/lib/integrations/settings-handlers'

export const POST = makeSettingsHandler({
  enabledColumn: 'plugnotasEnabled',
  fields: [
    { name: 'plugnotasApiKey', sensitive: true },
    { name: 'plugnotasCnpj', sensitive: false },
  ],
})
