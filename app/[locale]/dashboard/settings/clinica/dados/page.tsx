import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { FileText } from 'lucide-react'
import { normalizeRole } from '@/lib/role-permissions'
import { ClinicaPageHeader } from '@/components/settings/clinica-page-header'
import { DadosForm } from '@/components/settings/clinica/dados-form'
import type { EnderecoData } from '@/app/[locale]/dashboard/settings/clinica/actions'

export const metadata = { title: 'Dados da Clínica | Estetia CRM' }

export default async function DadosPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      orgRole: true,
      organization: {
        select: {
          cnpj: true,
          razaoSocial: true,
          inscricaoEstadual: true,
          inscricaoMunicipal: true,
          enderecoCompleto: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  if (normalizeRole(user.orgRole) !== 'OWNER') {
    return (
      <div className="p-8 max-w-2xl">
        <p className="text-sm text-muted-foreground">
          Apenas o OWNER da organização pode editar dados da clínica.
        </p>
      </div>
    )
  }

  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6 max-w-3xl">
      <ClinicaPageHeader
        title="Dados & Documentos"
        description="Identificação jurídica e endereço da sua clínica — aparece em recibos, NF-Se e contratos"
        icon={FileText}
        iconBg="bg-teal-500/10"
        iconColor="text-teal-500"
      />

      <DadosForm
        initial={{
          cnpj: org.cnpj ?? '',
          razaoSocial: org.razaoSocial ?? '',
          inscricaoEstadual: org.inscricaoEstadual ?? '',
          inscricaoMunicipal: org.inscricaoMunicipal ?? '',
          endereco: (org.enderecoCompleto as EnderecoData) ?? {},
        }}
      />
    </div>
  )
}
