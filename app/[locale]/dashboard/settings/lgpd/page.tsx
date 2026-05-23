import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { ShieldCheck } from 'lucide-react'
import { normalizeRole } from '@/lib/role-permissions'
import { ClinicaPageHeader } from '@/components/settings/clinica-page-header'
import { DpoForm } from '@/components/settings/lgpd/dpo-form'
import { RetentionConfig } from '@/components/settings/lgpd/retention-config'
import { ExportCard } from '@/components/settings/lgpd/export-card'

export const metadata = { title: 'LGPD & Privacidade | Estetia CRM' }

export default async function LgpdPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      orgRole: true,
      organization: {
        select: {
          dpoName: true,
          dpoEmail: true,
          dpoPhone: true,
          dpoCpf: true,
          lgpdRetentionMonths: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  if (normalizeRole(user.orgRole) !== 'OWNER') {
    return (
      <div className="p-8 max-w-2xl">
        <p className="text-sm text-muted-foreground">Apenas o OWNER pode editar configurações de LGPD.</p>
      </div>
    )
  }

  const org = user.organization

  return (
    <div className="flex-1 p-6 max-w-3xl relative">
      {/* Decorative privacy-themed gradient glow at the top right */}
      <div className="absolute top-0 right-0 w-[450px] h-[300px] bg-gradient-to-bl from-emerald-500/[0.03] via-transparent to-transparent rounded-full blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 space-y-6">
        <ClinicaPageHeader
          title="LGPD & Privacidade"
          description="Encarregado de Dados, política de retenção e direitos dos titulares — em conformidade com a Lei Federal nº 13.709/2018"
          icon={ShieldCheck}
          iconBg="bg-emerald-500/10"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />

        <DpoForm
          initial={{
            dpoName: org.dpoName,
            dpoEmail: org.dpoEmail,
            dpoPhone: org.dpoPhone,
            dpoCpf: org.dpoCpf,
          }}
        />

        <RetentionConfig initial={org.lgpdRetentionMonths ?? 60} />

        <ExportCard />
      </div>
    </div>
  )
}
