import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { FileText } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { TypeformForm } from '@/components/integrations/forms/typeform-form'

export const metadata = { title: 'Typeform | Estetia CRM' }

export default async function TypeformPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          id: true,
          typeformEnabled: true,
          typeformApiKey: true,
          typeformFormId: true,
        },
      },
    },
  })
  if (!user?.organization) return <div>Organização não encontrada</div>
  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="Typeform"
        description="Ficha de anamnese e pesquisas via Typeform — respostas chegam como leads"
        icon={FileText}
        iconBg="bg-zinc-500/10"
        iconColor="text-zinc-700 dark:text-zinc-300"
        docsUrl="https://www.typeform.com/developers/"
      />

      <TypeformForm
        orgId={org.id}
        initial={{
          enabled: org.typeformEnabled,
          hasApiKey: !!org.typeformApiKey,
          formId: org.typeformFormId ?? '',
        }}
      />
    </div>
  )
}
