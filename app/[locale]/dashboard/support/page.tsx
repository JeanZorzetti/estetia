import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { TicketCard } from '@/components/support/ticket-card'
import { NewTicketDialog } from '@/components/support/new-ticket-dialog'
import { TicketStatus } from '@prisma/client'
import { LifeBuoy, MessageSquare } from 'lucide-react'

interface SearchParams {
  status?: string
  priority?: string
  category?: string
  page?: string
}

interface Props {
  searchParams: Promise<SearchParams>
}

export default async function SupportPage({ searchParams }: Props) {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, organizationId: true },
  })
  if (!user) redirect('/login')

  const { status, priority, category, page: pageStr } = await searchParams
  const page = Math.max(1, parseInt(pageStr || '1'))
  const limit = 20
  const skip = (page - 1) * limit

  const where = {
    organizationId: user.organizationId,
    ...(status && { status: status as TicketStatus }),
    ...(priority && { priority: priority as never }),
    ...(category && { category: category as never }),
  }

  const [tickets, total, unreadCount] = await Promise.all([
    prisma.supportTicket.findMany({
      where,
      orderBy: [{ unreadByUser: 'desc' }, { lastMessageAt: 'desc' }, { createdAt: 'desc' }],
      skip,
      take: limit,
      include: {
        createdByUser: { select: { id: true, name: true, email: true } },
        _count: { select: { messages: true } },
      },
    }),
    prisma.supportTicket.count({ where }),
    prisma.supportTicket.count({ where: { organizationId: user.organizationId, unreadByUser: true } }),
  ])

  const statuses: { value: string; label: string }[] = [
    { value: '', label: 'Todos' },
    { value: 'OPEN', label: 'Aberto' },
    { value: 'IN_PROGRESS', label: 'Em andamento' },
    { value: 'WAITING_USER', label: 'Aguardando resposta' },
    { value: 'RESOLVED', label: 'Resolvido' },
    { value: 'CLOSED', label: 'Fechado' },
  ]

  return (
    <div className="max-w-3xl mx-auto p-6 relative">
      {/* Premium decorative gradient glow at the top right */}
      <div className="absolute top-0 right-0 w-[450px] h-[300px] bg-gradient-to-bl from-indigo-500/5 via-transparent to-transparent rounded-full blur-3xl pointer-events-none z-0" />

      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10 flex-wrap gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-2xl shadow-inner relative overflow-hidden group">
            <LifeBuoy className="h-6 w-6 relative z-10 transition-transform duration-500 group-hover:rotate-45" />
            <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground bg-clip-text">
              Suporte
            </h1>
            <p className="text-xs font-semibold text-muted-foreground mt-0.5">
              {total > 0 ? (
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  {total} ticket{total !== 1 ? 's' : ''} registrado{total !== 1 ? 's' : ''}
                </span>
              ) : (
                'Nenhum ticket aberto no momento'
              )}
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  {unreadCount} não lido{unreadCount !== 1 ? 's' : ''}
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="relative z-20">
          <NewTicketDialog />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="bg-muted/[0.02] dark:bg-muted/[0.04] p-2.5 rounded-2xl border border-border/10 mb-6 flex gap-1.5 overflow-x-auto pb-1 max-w-full relative z-10 scrollbar-none shadow-sm">
        {statuses.map((s) => {
          const isActive = (status || '') === s.value
          return (
            <a
              key={s.value}
              href={s.value ? `?status=${s.value}` : '?'}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                isActive
                  ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] border'
                  : 'border border-border/30 bg-card/45 backdrop-blur-sm text-muted-foreground hover:border-indigo-500/20 hover:text-foreground hover:bg-card/75 shadow-sm'
              }`}
            >
              {s.label}
            </a>
          )
        })}
      </div>

      {/* Ticket list */}
      <div className="relative z-10">
        {tickets.length === 0 ? (
          <div className="text-center py-20 bg-card/30 backdrop-blur-sm border border-border/40 rounded-3xl p-8 shadow-sm">
            <div className="w-16 h-16 bg-muted/60 dark:bg-zinc-800/60 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner border border-border/10">
              <MessageSquare className="h-7 w-7 text-muted-foreground/60" />
            </div>
            <h3 className="font-extrabold text-base text-foreground mb-1">Nenhum ticket encontrado</h3>
            <p className="text-xs text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
              Precisa de ajuda com o sistema ou identificou alguma inconsistência? Abra um ticket para que nossa equipe de suporte possa lhe auxiliar.
            </p>
            <div className="flex flex-col items-center gap-3">
              <NewTicketDialog />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket as never}
                href={`/dashboard/support/${ticket.id}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {total > limit && (
        <div className="flex justify-center items-center gap-3 mt-8 relative z-10 font-semibold">
          {page > 1 && (
            <a 
              href={`?${new URLSearchParams({ ...(status && { status }), page: String(page - 1) })}`}
              className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs transition-colors shadow-sm"
            >
              Anterior
            </a>
          )}
          <span className="px-4 py-2 text-xs text-muted-foreground bg-muted/40 dark:bg-zinc-800/40 border border-border/20 rounded-xl tabular-nums">
            Página {page} de {Math.ceil(total / limit)}
          </span>
          {page < Math.ceil(total / limit) && (
            <a 
              href={`?${new URLSearchParams({ ...(status && { status }), page: String(page + 1) })}`}
              className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs transition-colors shadow-sm"
            >
              Próximo
            </a>
          )}
        </div>
      )}

    </div>
  )
}
