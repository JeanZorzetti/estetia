import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, ChevronLeft } from 'lucide-react'
import { getMediaUrl } from '@/lib/storage'
import { ProfessionalsKpis } from '@/components/profissionais/professionals-kpis'
import { ProfessionalsTable } from '@/components/profissionais/professionals-table'

export const dynamic = 'force-dynamic'

const serialize = <T,>(v: T): T => JSON.parse(JSON.stringify(v))

export default async function ProfissionaisPage() {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) redirect('/login')

  const { organizationId } = user

  const [professionals, totalAtivos, comConselho, comFoto] = await Promise.all([
    prisma.professional.findMany({
      where: { organizationId },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: [{ ativo: 'desc' }, { nome: 'asc' }],
    }),
    prisma.professional.count({ where: { organizationId, ativo: true } }),
    prisma.professional.count({ where: { organizationId, conselho: { not: null } } }),
    prisma.professional.count({ where: { organizationId, fotoUrl: { not: null } } }),
  ])

  // Generate signed URLs for photos
  const withSignedUrls = await Promise.all(
    professionals.map(async (p) => {
      let fotoSignedUrl: string | null = null
      if (p.fotoUrl) {
        try { fotoSignedUrl = await getMediaUrl(p.fotoUrl) } catch { /* ignore */ }
      }
      return { ...p, fotoSignedUrl }
    }),
  )

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/dashboard/settings"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Configurações
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">Profissionais</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Equipe da clínica · {totalAtivos} ativo{totalAtivos !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/dashboard/settings/profissionais/novo"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Novo Profissional
        </Link>
      </div>

      <ProfessionalsKpis total={totalAtivos} comConselho={comConselho} comFoto={comFoto} />

      <ProfessionalsTable initialProfessionals={serialize(withSignedUrls) as any} />
    </div>
  )
}
