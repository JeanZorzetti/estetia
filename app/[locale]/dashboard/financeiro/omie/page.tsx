import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { OmieStatusCard } from '@/components/financeiro/omie/omie-status-card'
import { OmieSyncButton } from '@/components/financeiro/omie/omie-sync-button'

export const dynamic = 'force-dynamic'

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

const STATUS_COLORS: Record<string, string> = {
  RECEBIDO: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  A_VENCER: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  VENCIDO: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}

export default async function OmiePage() {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) redirect('/login')

  const { organizationId } = user

  const [org, recebiveis] = await Promise.all([
    prisma.organization.findUnique({
      where: { id: organizationId },
      select: { omieEnabled: true },
    }),
    prisma.omieFinanceiro.findMany({
      where: { organizationId },
      include: { contact: { select: { id: true, name: true } } },
      orderBy: { vencimento: 'asc' },
      take: 100,
    }),
  ])

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <Link
          href="/dashboard/financeiro"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Financeiro & TISS
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Integração Omie ERP</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Sincronize contas a receber do Omie ERP para o módulo financeiro
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <OmieStatusCard enabled={!!org?.omieEnabled} totalRecebiveis={recebiveis.length} />
        <OmieSyncButton />
      </div>

      <div>
        <h2 className="text-base font-semibold tracking-tight mb-3">Recebíveis Sincronizados</h2>
        {recebiveis.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2 border border-dashed border-border rounded-xl text-center">
            <p className="text-sm text-muted-foreground">Nenhum recebível sincronizado ainda.</p>
          </div>
        ) : (
          <div className="border border-border/60 rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="font-semibold text-xs uppercase tracking-wider">Omie ID</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider">Cliente</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider">Valor</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider">Vencimento</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recebiveis.map(r => (
                  <TableRow key={r.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs">{r.omieId}</TableCell>
                    <TableCell className="text-sm font-medium">{r.contact?.name ?? '—'}</TableCell>
                    <TableCell className="text-sm tabular-nums font-medium">{formatBRL(r.valor)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(r.vencimento).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`text-xs border-0 ${STATUS_COLORS[r.status] ?? ''}`}>
                        {r.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}
