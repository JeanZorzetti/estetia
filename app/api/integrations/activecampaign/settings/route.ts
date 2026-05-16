import { makeSettingsHandler } from '@/lib/integrations/settings-handlers'

export const POST = makeSettingsHandler({
  enabledColumn: 'activecampaignEnabled',
  fields: [
    { name: 'activecampaignApiKey', sensitive: true },
    { name: 'activecampaignUrl', sensitive: false },
  ],
})
