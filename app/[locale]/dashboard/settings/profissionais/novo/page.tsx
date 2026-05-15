import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { ProfessionalForm } from '@/components/profissionais/professional-form'

export default async function NovoProfissionalPage() {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) redirect('/login')

  const [users, procedures] = await Promise.all([
    prisma.user.findMany({
      where: { organizationId: user.organizationId },
      select: { id: true, name: true, email: true },
      orderBy: { name: 'asc' },
    }),
    prisma.procedure.findMany({
      where: { organizationId: user.organizationId, ativo: true },
      select: { id: true, nome: true, categoria: true },
      orderBy: { nome: 'asc' },
    }),
  ])

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl">
      <div>
        <Link
          href="/dashboard/settings/profissionais"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Novo Profissional</h1>
        <p className="text-muted-foreground text-sm mt-1">Cadastre um membro da equipe clínica</p>
      </div>

      <ProfessionalForm users={users} procedures={procedures} />
    </div>
  )
}
