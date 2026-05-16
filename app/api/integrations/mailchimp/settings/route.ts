import { makeSettingsHandler } from '@/lib/integrations/settings-handlers'

export const POST = makeSettingsHandler({
  enabledColumn: 'mailchimpEnabled',
  fields: [
    { name: 'mailchimpApiKey', sensitive: true },
    { name: 'mailchimpListId', sensitive: false },
    { name: 'mailchimpServer', sensitive: false },
  ],
})
