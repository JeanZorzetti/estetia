import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { ListChecks } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { AsanaForm } from '@/components/integrations/forms/asana-form'

export const metadata = { title: 'Asana | Estetia CRM' }

export default async function AsanaPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          asanaEnabled: true,
          asanaApiKey: true,
          asanaProjectId: true,
        },
      },
    },
  })
  if (!user?.organization) return <div>Organização não encontrada</div>
  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="Asana"
        description="Gestão de projetos da clínica — tasks automáticas por procedimento agendado"
        icon={ListChecks}
        iconBg="bg-rose-500/10"
        iconColor="text-rose-500"
        docsUrl="https://developers.asana.com/"
      />

      <AsanaForm
        initial={{
          enabled: org.asanaEnabled,
          hasApiKey: !!org.asanaApiKey,
          projectId: org.asanaProjectId ?? '',
        }}
      />
    </div>
  )
}
