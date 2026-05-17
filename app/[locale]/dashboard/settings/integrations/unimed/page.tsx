import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { ShieldCheck } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { UnimedForm } from '@/components/integrations/forms/unimed-form'

export const metadata = { title: 'Unimed | Estetia CRM' }

export default async function UnimedPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          unimedEnabled: true,
          unimedCredentialsJson: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="Unimed"
        description="Integração com a Unimed singular — elegibilidade e guias TISS para faturamento de convênio"
        icon={ShieldCheck}
        iconBg="bg-emerald-500/10"
        iconColor="text-emerald-600"
        docsUrl="https://www.unimed.coop.br/site/web/unimed-do-brasil/prestadores"
      />

      <UnimedForm
        initial={{
          enabled: org.unimedEnabled,
          hasCredentials: !!org.unimedCredentialsJson,
        }}
      />
    </div>
  )
}
