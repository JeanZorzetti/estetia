import { makeSettingsHandler } from '@/lib/integrations/settings-handlers'

export const POST = makeSettingsHandler({
  enabledColumn: 'rdStationEnabled',
  fields: [
    { name: 'rdStationClientId', sensitive: false },
    { name: 'rdStationClientSecret', sensitive: true },
    { name: 'rdStationRefreshToken', sensitive: true },
  ],
})
