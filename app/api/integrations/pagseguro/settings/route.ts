import { makeSettingsHandler } from '@/lib/integrations/settings-handlers'

export const POST = makeSettingsHandler({
  enabledColumn: 'pagseguroEnabled',
  fields: [
    { name: 'pagseguroToken', sensitive: true },
    { name: 'pagseguroEnvironment', sensitive: false },
  ],
})
