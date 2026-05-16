import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { CalendarSearch } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { DoctoraliaForm } from '@/components/integrations/forms/doctoralia-form'

export const metadata = { title: 'Doctoralia | Estetia CRM' }

export default async function DoctoraliaPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          doctoraliaEnabled: true,
          doctoraliaApiKey: true,
          doctoraliaClinicId: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="Doctoralia"
        description="Agendamento online e sincronização de agenda pública via Docplanner API"
        icon={CalendarSearch}
        iconBg="bg-sky-500/10"
        iconColor="text-sky-500"
        docsUrl="https://developers.docplanner.com/"
      />

      <DoctoraliaForm
        initial={{
          enabled: org.doctoraliaEnabled,
          clinicId: org.doctoraliaClinicId ?? '',
          hasApiKey: !!org.doctoraliaApiKey,
        }}
      />
    </div>
  )
}
