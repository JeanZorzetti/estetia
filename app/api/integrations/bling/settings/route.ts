import { makeSettingsHandler } from '@/lib/integrations/settings-handlers'
export const POST = makeSettingsHandler({
  enabledColumn: 'blingEnabled',
  fields: [
    { name: 'blingClientId', sensitive: false },
    { name: 'blingClientSecret', sensitive: true },
    { name: 'blingRefreshToken', sensitive: true },
  ],
})
