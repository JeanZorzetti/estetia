import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { ClipboardList, ShieldCheck, XCircle } from 'lucide-react'
import { normalizeRole } from '@/lib/role-permissions'
import { ClinicaPageHeader } from '@/components/settings/clinica-page-header'
import { Card, CardContent } from '@/components/ui/card'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export const metadata = { title: 'Auditoria de Consentimentos | Estetia CRM' }

const PAGE_SIZE = 30

export default async function ConsentAuditPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string; q?: string; page?: string }>
}) {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { orgRole: true, organizationId: true },
  })
  if (!user) return <div>Não encontrado</div>

  if (normalizeRole(user.orgRole) !== 'OWNER') {
    return (
      <div className="p-8 max-w-2xl">
        <p className="text-sm text-muted-foreground">Apenas o OWNER pode auditar consentimentos.</p>
      </div>
    )
  }

  const sp = await searchParams
  const tipo = sp.tipo
  const q = sp.q?.trim() ?? ''
  const page = Math.max(1, Number(sp.page ?? 1))

  const where = {
    organizationId: user.organizationId,
    ...(tipo ? { tipo: tipo as never } : {}),
    ...(q
      ? {
          paciente: { nome: { contains: q, mode: 'insensitive' as const } },
        }
      : {}),
  }

  const [total, consents] = await Promise.all([
    prisma.consentLog.count({ where }),
    prisma.consentLog.findMany({
      where,
      include: { paciente: { select: { nome: true } } },
      orderBy: { aceitoEm: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <div className="flex-1 space-y-6 p-6 max-w-5xl">
      <Link href="/dashboard/settings/lgpd">
        <Button variant="ghost" size="sm" className="gap-2 -ml-3">
          <ArrowLeft className="h-4 w-4" />
          LGPD
        </Button>
      </Link>

      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 ring-border/40 bg-red-500/10 text-red-500">
          <ClipboardList className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Auditoria de Consentimentos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {total} {total === 1 ? 'registro' : 'registros'} de consentimento
          </p>
        </div>
      </div>

      {/* Filtros via URL params */}
      <form className="flex flex-wrap gap-2 items-end" method="get">
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="q-input">Buscar paciente</label>
          <input
            id="q-input"
            name="q"
            defaultValue={q}
            placeholder="Nome do paciente..."
            className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="min-w-[180px]">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="tipo-select">Tipo</label>
          <select
            id="tipo-select"
            name="tipo"
            defaultValue={tipo ?? ''}
            className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Todos</option>
            <option value="LGPD_GERAL">LGPD geral</option>
            <option value="TRATAMENTO_DADOS_SAUDE">Dados de saúde</option>
            <option value="USO_FOTOS">Uso de fotos</option>
            <option value="MARKETING">Marketing</option>
            <option value="COMPARTILHAMENTO_TERCEIROS">Compartilhamento</option>
          </select>
        </div>
        <Button type="submit" size="sm">Filtrar</Button>
      </form>

      {consents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Nenhum consentimento registrado para esses filtros
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-xl border border-border/60 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/30">
              <tr className="text-left text-xs font-medium text-muted-foreground">
                <th className="py-2.5 px-4">Paciente</th>
                <th className="py-2.5 px-4">Tipo</th>
                <th className="py-2.5 px-4">Aceito em</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Versão</th>
              </tr>
            </thead>
            <tbody>
              {consents.map((c) => (
                <tr key={c.id} className="border-t border-border/30 hover:bg-muted/20 transition-colors">
                  <td className="py-2.5 px-4 font-medium">{c.paciente.nome}</td>
                  <td className="py-2.5 px-4">
                    <span className="text-xs bg-muted px-1.5 py-0.5 rounded">{c.tipo}</span>
                  </td>
                  <td className="py-2.5 px-4 text-muted-foreground tabular-nums">
                    {format(c.aceitoEm, "dd MMM yyyy 'às' HH:mm", { locale: ptBR })}
                  </td>
                  <td className="py-2.5 px-4">
                    {c.revokedAt ? (
                      <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 text-xs">
                        <XCircle className="h-3 w-3" />
                        Revogado em {format(c.revokedAt, 'dd/MM/yy', { locale: ptBR })}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs">
                        <ShieldCheck className="h-3 w-3" />
                        Ativo
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-[10px] text-muted-foreground">
                    {c.versaoDocumento.slice(0, 8)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-muted-foreground">
            Página {page} de {totalPages}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={`?page=${page - 1}${tipo ? `&tipo=${tipo}` : ''}${q ? `&q=${q}` : ''}`}>
                <Button variant="outline" size="sm">Anterior</Button>
              </Link>
            )}
            {page < totalPages && (
              <Link href={`?page=${page + 1}${tipo ? `&tipo=${tipo}` : ''}${q ? `&q=${q}` : ''}`}>
                <Button variant="outline" size="sm">Próxima</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
