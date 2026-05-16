import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Database } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { NotionForm } from '@/components/integrations/forms/notion-form'

export const metadata = { title: 'Notion | Estetia CRM' }

export default async function NotionPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          notionEnabled: true,
          notionApiKey: true,
          notionDatabaseId: true,
        },
      },
    },
  })
  if (!user?.organization) return <div>Organização não encontrada</div>
  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="Notion"
        description="Sincronize pacientes com uma database Notion para follow-ups e bases pessoais"
        icon={Database}
        iconBg="bg-zinc-500/10"
        iconColor="text-zinc-700 dark:text-zinc-300"
        docsUrl="https://developers.notion.com/"
      />

      <NotionForm
        initial={{
          enabled: org.notionEnabled,
          hasApiKey: !!org.notionApiKey,
          databaseId: org.notionDatabaseId ?? '',
        }}
      />
    </div>
  )
}
