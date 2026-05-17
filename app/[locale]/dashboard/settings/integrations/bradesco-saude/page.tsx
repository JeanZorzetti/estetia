import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { ShieldCheck } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { BradescoSaudeForm } from '@/components/integrations/forms/bradesco-saude-form'

export const metadata = { title: 'Bradesco Saúde | Estetia CRM' }

export default async function BradescoSaudePage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          bradescoSaudeEnabled: true,
          bradescoSaudeCredentialsJson: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="Bradesco Saúde"
        description="Elegibilidade e guias Bradesco — faturamento eletrônico TISS para prestadores credenciados"
        icon={ShieldCheck}
        iconBg="bg-red-500/10"
        iconColor="text-red-600"
        docsUrl="https://bradescosaude.com.br/prestadores"
      />

      <BradescoSaudeForm
        initial={{
          enabled: org.bradescoSaudeEnabled,
          hasCredentials: !!org.bradescoSaudeCredentialsJson,
        }}
      />
    </div>
  )
}
