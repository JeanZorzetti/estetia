import { makeSettingsHandler } from '@/lib/integrations/settings-handlers'

export const POST = makeSettingsHandler({
  enabledColumn: 'linkedinAdsEnabled',
  fields: [
    { name: 'linkedinAdsAccessToken', sensitive: true },
    { name: 'linkedinAdsAccountId', sensitive: false },
  ],
})
