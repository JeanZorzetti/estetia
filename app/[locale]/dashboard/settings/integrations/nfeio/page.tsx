import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { FileText } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { NfeioForm } from '@/components/integrations/forms/nfeio-form'

export const metadata = { title: 'NFE.io | Estetia CRM' }

export default async function NfeioPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          nfeioEnabled: true,
          nfeioApiKey: true,
          nfeioCompanyId: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="NFE.io"
        description="Plataforma de emissão de NFS-e em nuvem com suporte a centenas de municípios"
        icon={FileText}
        iconBg="bg-indigo-500/10"
        iconColor="text-indigo-500"
        docsUrl="https://nfe.io/docs/"
      />

      <NfeioForm
        initial={{
          enabled: org.nfeioEnabled,
          hasApiKey: !!org.nfeioApiKey,
          companyId: org.nfeioCompanyId ?? '',
        }}
      />
    </div>
  )
}
