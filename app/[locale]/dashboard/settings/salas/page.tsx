import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, ChevronLeft } from 'lucide-react'
import { SalasKpis } from '@/components/salas/salas-kpis'
import { SalasTable } from '@/components/salas/salas-table'

export const dynamic = 'force-dynamic'

const serialize = <T,>(v: T): T => JSON.parse(JSON.stringify(v))

const TIPO_LABELS: Record<string, string> = {
  CONSULTA: 'Consulta',
  PROCEDIMENTO: 'Procedimento',
  LASER: 'Laser',
  PEELING: 'Peeling',
  RECUPERACAO: 'Recuperação',
}

export default async function SalasPage() {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) redirect('/login')

  const { organizationId } = user

  const safe = async <T,>(fn: () => Promise<T>, fb: T): Promise<T> => {
    try { return await fn() } catch { return fb }
  }

  const [salas, totalAtivas, byTipo] = await Promise.all([
    prisma.clinicRoom.findMany({
      where: { organizationId },
      orderBy: [{ ativo: 'desc' }, { nome: 'asc' }],
      take: 200,
    }),
    prisma.clinicRoom.count({ where: { organizationId, ativo: true } }),
    safe(() => prisma.clinicRoom.groupBy({
      by: ['tipo'],
      where: { organizationId, ativo: true },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 1,
    }), [] as Array<{ tipo: string; _count: { id: number } }>),
  ])

  const comEquipamentos = salas.filter(s => s.equipamentos.length > 0 && s.ativo).length
  const comHorario = salas.filter(s => s.disponibilidade != null && s.ativo).length
  const tipoMaisComum = byTipo[0]?.tipo ? (TIPO_LABELS[byTipo[0].tipo] ?? byTipo[0].tipo) : '—'

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
          <h1 className="text-2xl font-semibold tracking-tight">Salas</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Salas de atendimento da clínica · {totalAtivas} ativa{totalAtivas !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/dashboard/settings/salas/novo"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Nova Sala
        </Link>
      </div>

      <SalasKpis
        total={totalAtivas}
        comEquipamentos={comEquipamentos}
        comHorario={comHorario}
        tipoMaisComum={tipoMaisComum}
      />

      <SalasTable initialSalas={serialize(salas) as any} />
    </div>
  )
}
