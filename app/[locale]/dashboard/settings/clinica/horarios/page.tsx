import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Clock } from 'lucide-react'
import { normalizeRole } from '@/lib/role-permissions'
import { ClinicaPageHeader } from '@/components/settings/clinica-page-header'
import { HorariosForm } from '@/components/settings/clinica/horarios-form'
import type { CargaHorariaInput } from '@/lib/profissionais/schema'

export const metadata = { title: 'Horários de Funcionamento | Estetia CRM' }

export default async function HorariosPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      orgRole: true,
      organization: {
        select: { horarioFuncionamento: true },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  if (normalizeRole(user.orgRole) !== 'OWNER') {
    return (
      <div className="p-8 max-w-2xl">
        <p className="text-sm text-muted-foreground">
          Apenas o OWNER pode editar horários da clínica.
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6 max-w-3xl">
      <ClinicaPageHeader
        title="Horários de Funcionamento"
        description="Janela global de agendamento da clínica — sobrescrevível por profissional ou sala"
        icon={Clock}
        iconBg="bg-teal-500/10"
        iconColor="text-teal-500"
      />

      <HorariosForm initial={user.organization.horarioFuncionamento as CargaHorariaInput | null} />
    </div>
  )
}
