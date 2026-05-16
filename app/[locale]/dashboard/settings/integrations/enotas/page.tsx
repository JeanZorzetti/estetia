import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { FileText } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { EnotasForm } from '@/components/integrations/forms/enotas-form'

export const metadata = { title: 'eNotas | Estetia CRM' }

export default async function EnotasPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          enotasEnabled: true,
          enotasApiKey: true,
          enotasCompanyId: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="eNotas"
        description="Emissão automática de NFS-e para serviços clínicos — provedor brasileiro"
        icon={FileText}
        iconBg="bg-violet-500/10"
        iconColor="text-violet-500"
        docsUrl="https://enotas.com.br/docs"
      />

      <EnotasForm
        initial={{
          enabled: org.enotasEnabled,
          hasApiKey: !!org.enotasApiKey,
          companyId: org.enotasCompanyId ?? '',
        }}
      />
    </div>
  )
}
