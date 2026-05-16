import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Package } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { OAuthCredentialsForm } from '@/components/integrations/forms/oauth-credentials-form'

export const metadata = { title: 'Bling | Estetia CRM' }

export default async function BlingPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          blingEnabled: true,
          blingClientId: true,
          blingClientSecret: true,
          blingRefreshToken: true,
        },
      },
    },
  })
  if (!user?.organization) return <div>Organização não encontrada</div>
  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="Bling"
        description="ERP brasileiro — sincronize NF-e, estoque e financeiro da clínica via OAuth 2.0"
        icon={Package}
        iconBg="bg-blue-500/10"
        iconColor="text-blue-500"
        docsUrl="https://developer.bling.com.br/"
      />

      <OAuthCredentialsForm
        integrationId="bling"
        clientIdField="blingClientId"
        clientSecretField="blingClientSecret"
        refreshTokenField="blingRefreshToken"
        oauthHelperText="App criado em developer.bling.com.br — cole Client ID, Secret e Refresh Token aqui"
        initial={{
          enabled: org.blingEnabled,
          clientId: org.blingClientId ?? '',
          hasClientSecret: !!org.blingClientSecret,
          hasRefreshToken: !!org.blingRefreshToken,
        }}
      />
    </div>
  )
}
