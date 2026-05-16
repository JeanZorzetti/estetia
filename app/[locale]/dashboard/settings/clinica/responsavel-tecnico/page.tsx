import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Stethoscope } from 'lucide-react'
import { normalizeRole } from '@/lib/role-permissions'
import { ClinicaPageHeader } from '@/components/settings/clinica-page-header'
import { RtForm } from '@/components/settings/clinica/rt-form'

export const metadata = { title: 'Responsável Técnico | Estetia CRM' }

export default async function RtPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      orgRole: true,
      organization: {
        select: {
          rtNome: true,
          rtConselho: true,
          rtNumeroConselho: true,
          rtUfConselho: true,
          rtCpf: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  if (normalizeRole(user.orgRole) !== 'OWNER') {
    return (
      <div className="p-8 max-w-2xl">
        <p className="text-sm text-muted-foreground">Apenas o OWNER pode editar o RT.</p>
      </div>
    )
  }

  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6 max-w-3xl">
      <ClinicaPageHeader
        title="Responsável Técnico"
        description="Profissional registrado em conselho de classe — obrigação sanitária para clínicas"
        icon={Stethoscope}
        iconBg="bg-teal-500/10"
        iconColor="text-teal-500"
      />

      <RtForm
        initial={{
          rtNome: org.rtNome,
          rtConselho: org.rtConselho,
          rtNumeroConselho: org.rtNumeroConselho,
          rtUfConselho: org.rtUfConselho,
          rtCpf: org.rtCpf,
        }}
      />
    </div>
  )
}
