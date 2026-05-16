import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { FileText } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { PlugnotasForm } from '@/components/integrations/forms/plugnotas-form'

export const metadata = { title: 'Plug.notas | Estetia CRM' }

export default async function PlugnotasPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          plugnotasEnabled: true,
          plugnotasApiKey: true,
          plugnotasCnpj: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="Plug.notas"
        description="Plataforma fiscal multi-município — NFS-e em mais de 1.000 cidades"
        icon={FileText}
        iconBg="bg-sky-500/10"
        iconColor="text-sky-500"
        docsUrl="https://docs.plugnotas.com.br/"
      />

      <PlugnotasForm
        initial={{
          enabled: org.plugnotasEnabled,
          hasApiKey: !!org.plugnotasApiKey,
          cnpj: org.plugnotasCnpj ?? '',
        }}
      />
    </div>
  )
}
