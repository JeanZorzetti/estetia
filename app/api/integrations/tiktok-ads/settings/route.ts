import { makeSettingsHandler } from '@/lib/integrations/settings-handlers'

export const POST = makeSettingsHandler({
  enabledColumn: 'tiktokAdsEnabled',
  fields: [
    { name: 'tiktokAdsAccessToken', sensitive: true },
    { name: 'tiktokAdsAdvertiserId', sensitive: false },
    { name: 'tiktokAdsPixelId', sensitive: false },
  ],
})
