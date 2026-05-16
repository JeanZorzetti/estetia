import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Smartphone } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { ZapiForm } from '@/components/integrations/forms/zapi-form'

export const metadata = { title: 'WhatsApp Z-API | Estetia CRM' }

export default async function ZapiPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          zapiEnabled: true,
          zapiInstanceId: true,
          zapiInstanceToken: true,
          zapiClientToken: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="WhatsApp Z-API"
        description="Provider brasileiro pago — setup simples, sem hospedagem própria"
        icon={Smartphone}
        iconBg="bg-teal-500/10"
        iconColor="text-teal-500"
        docsUrl="https://developer.z-api.io/"
      />

      <ZapiForm
        initial={{
          enabled: org.zapiEnabled,
          instanceId: org.zapiInstanceId ?? '',
          hasInstanceToken: !!org.zapiInstanceToken,
          hasClientToken: !!org.zapiClientToken,
        }}
      />
    </div>
  )
}
