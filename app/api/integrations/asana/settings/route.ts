import { makeSettingsHandler } from '@/lib/integrations/settings-handlers'
export const POST = makeSettingsHandler({
  enabledColumn: 'asanaEnabled',
  fields: [
    { name: 'asanaApiKey', sensitive: true },
    { name: 'asanaProjectId', sensitive: false },
  ],
})
