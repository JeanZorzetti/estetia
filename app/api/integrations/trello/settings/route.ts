import { makeSettingsHandler } from '@/lib/integrations/settings-handlers'
export const POST = makeSettingsHandler({
  enabledColumn: 'trelloEnabled',
  fields: [
    { name: 'trelloApiKey', sensitive: false },
    { name: 'trelloToken', sensitive: true },
    { name: 'trelloBoardId', sensitive: false },
  ],
})
