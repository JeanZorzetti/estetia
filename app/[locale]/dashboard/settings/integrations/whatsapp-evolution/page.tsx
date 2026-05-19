import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Smartphone } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { EvolutionForm } from '@/components/integrations/forms/evolution-form'
import { requireModule } from '@/lib/guards/require-module'
import { ModuleLocked } from '@/components/upgrade/module-locked'

export const metadata = { title: 'WhatsApp Evolution | Estetia CRM' }

export default async function WhatsappEvolutionPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const gate = await requireModule('whatsapp_evolution')
  if (!gate.allowed) return <ModuleLocked slug={gate.slug} />

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          evolutionEnabled: true,
          evolutionBaseUrl: true,
          evolutionApiKey: true,
          evolutionInstance: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="WhatsApp Evolution"
        description="API WhatsApp self-hosted — você hospeda sua própria instância, sem custos por mensagem"
        icon={Smartphone}
        iconBg="bg-green-500/10"
        iconColor="text-green-600"
        docsUrl="https://doc.evolution-api.com/"
      />

      <EvolutionForm
        initial={{
          enabled: org.evolutionEnabled,
          baseUrl: org.evolutionBaseUrl ?? '',
          instance: org.evolutionInstance ?? '',
          hasApiKey: !!org.evolutionApiKey,
        }}
      />
    </div>
  )
}
