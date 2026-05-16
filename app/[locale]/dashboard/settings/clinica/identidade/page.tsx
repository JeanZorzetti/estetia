import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Palette } from 'lucide-react'
import { normalizeRole } from '@/lib/role-permissions'
import { ClinicaPageHeader } from '@/components/settings/clinica-page-header'
import { IdentidadeForm } from '@/components/settings/clinica/identidade-form'

export const metadata = { title: 'Identidade Visual | Estetia CRM' }

export default async function IdentidadePage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      orgRole: true,
      organization: {
        select: {
          name: true,
          logoUrl: true,
          brandColor: true,
          slogan: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  if (normalizeRole(user.orgRole) !== 'OWNER') {
    return (
      <div className="p-8 max-w-2xl">
        <p className="text-sm text-muted-foreground">
          Apenas o OWNER pode editar a identidade visual.
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6 max-w-3xl">
      <ClinicaPageHeader
        title="Identidade Visual"
        description="Logo, cor da marca e slogan — aplicados em e-mails, recibos e landing pública"
        icon={Palette}
        iconBg="bg-teal-500/10"
        iconColor="text-teal-500"
      />

      <IdentidadeForm
        initial={{
          orgName: user.organization.name,
          logoUrl: user.organization.logoUrl,
          brandColor: user.organization.brandColor,
          slogan: user.organization.slogan,
        }}
      />
    </div>
  )
}
