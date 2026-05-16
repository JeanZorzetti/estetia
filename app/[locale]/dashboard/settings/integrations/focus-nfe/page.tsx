import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { FileText } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { FocusNfeForm } from '@/components/integrations/forms/focusnfe-form'

export const metadata = { title: 'Focus NFe | Estetia CRM' }

export default async function FocusNfePage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          focusnfeEnabled: true,
          focusnfeToken: true,
          focusnfeEnvironment: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="Focus NFe"
        description="Emissão automática de Nota Fiscal de Serviço — sem digitação manual"
        icon={FileText}
        iconBg="bg-amber-500/10"
        iconColor="text-amber-600"
        docsUrl="https://focusnfe.com.br/doc/"
      />

      <FocusNfeForm
        initial={{
          enabled: org.focusnfeEnabled,
          environment: (org.focusnfeEnvironment ?? 'homologacao') as 'homologacao' | 'producao',
          hasToken: !!org.focusnfeToken,
        }}
      />
    </div>
  )
}
