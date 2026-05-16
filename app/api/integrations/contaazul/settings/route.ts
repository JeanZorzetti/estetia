import { makeSettingsHandler } from '@/lib/integrations/settings-handlers'
export const POST = makeSettingsHandler({
  enabledColumn: 'contaazulEnabled',
  fields: [
    { name: 'contaazulClientId', sensitive: false },
    { name: 'contaazulClientSecret', sensitive: true },
    { name: 'contaazulRefreshToken', sensitive: true },
  ],
})
