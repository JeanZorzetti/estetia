import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Calculator } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { OAuthCredentialsForm } from '@/components/integrations/forms/oauth-credentials-form'

export const metadata = { title: 'ContaAzul | Estetia CRM' }

export default async function ContaAzulPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          contaazulEnabled: true,
          contaazulClientId: true,
          contaazulClientSecret: true,
          contaazulRefreshToken: true,
        },
      },
    },
  })
  if (!user?.organization) return <div>Organização não encontrada</div>
  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="ContaAzul"
        description="ERP financeiro brasileiro — sincronize contas a receber/pagar da clínica via OAuth 2.0"
        icon={Calculator}
        iconBg="bg-cyan-500/10"
        iconColor="text-cyan-500"
        docsUrl="https://developers.contaazul.com/"
      />

      <OAuthCredentialsForm
        integrationId="contaazul"
        clientIdField="contaazulClientId"
        clientSecretField="contaazulClientSecret"
        refreshTokenField="contaazulRefreshToken"
        oauthHelperText="App criado em developers.contaazul.com — cole Client ID, Secret e Refresh Token aqui"
        initial={{
          enabled: org.contaazulEnabled,
          clientId: org.contaazulClientId ?? '',
          hasClientSecret: !!org.contaazulClientSecret,
          hasRefreshToken: !!org.contaazulRefreshToken,
        }}
      />
    </div>
  )
}
