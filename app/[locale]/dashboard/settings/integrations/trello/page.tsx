import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Trello } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { TrelloForm } from '@/components/integrations/forms/trello-form'

export const metadata = { title: 'Trello | Estetia CRM' }

export default async function TrelloPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          trelloEnabled: true,
          trelloApiKey: true,
          trelloToken: true,
          trelloBoardId: true,
        },
      },
    },
  })
  if (!user?.organization) return <div>Organização não encontrada</div>
  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="Trello"
        description="Kanban de procedimentos no Trello — um card por procedimento agendado"
        icon={Trello}
        iconBg="bg-sky-500/10"
        iconColor="text-sky-500"
        docsUrl="https://developer.atlassian.com/cloud/trello/rest/"
      />

      <TrelloForm
        initial={{
          enabled: org.trelloEnabled,
          apiKey: org.trelloApiKey ?? '',
          hasToken: !!org.trelloToken,
          boardId: org.trelloBoardId ?? '',
        }}
      />
    </div>
  )
}
