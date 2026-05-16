import { makeSettingsHandler } from '@/lib/integrations/settings-handlers'
export const POST = makeSettingsHandler({
  enabledColumn: 'notionEnabled',
  fields: [
    { name: 'notionApiKey', sensitive: true },
    { name: 'notionDatabaseId', sensitive: false },
  ],
})
