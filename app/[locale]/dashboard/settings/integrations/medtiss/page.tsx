import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { getMedtissClient } from '@/lib/integrations/medtiss-client'
import { Layers } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { MedtissForm } from '@/components/integrations/forms/medtiss-form'

export const metadata = { title: 'MEDTISS | Estetia CRM' }

export default async function MedtissPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organizationId: true,
      organization: {
        select: {
          medtissEnabled: true,
          medtissApiKey: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  const org = user.organization

  // Try to fetch account info if already configured
  let accountInfo: { clinicaNome?: string; plano?: string } | undefined
  if (user.organizationId && org.medtissEnabled && org.medtissApiKey) {
    const client = await getMedtissClient(user.organizationId)
    if (client) {
      const result = await client.testConnection().catch(() => null)
      if (result?.success) accountInfo = result.info
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="MEDTISS"
        description="Plataforma TISS unificada — gerencie guias e faturamento para múltiplas operadoras em um único lugar"
        icon={Layers}
        iconBg="bg-emerald-500/10"
        iconColor="text-emerald-600"
        docsUrl="https://medtiss.com.br/docs"
      />

      <MedtissForm
        initial={{
          enabled: org.medtissEnabled,
          hasApiKey: !!org.medtissApiKey,
          accountInfo,
        }}
      />
    </div>
  )
}
