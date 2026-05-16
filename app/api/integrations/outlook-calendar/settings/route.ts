import { makeSettingsHandler } from '@/lib/integrations/settings-handlers'

export const POST = makeSettingsHandler({
  enabledColumn: 'outlookCalendarEnabled',
  fields: [
    { name: 'outlookCalendarEmail', sensitive: false },
    { name: 'outlookCalendarRefreshToken', sensitive: true },
  ],
})
