import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { TicketChat } from '@/components/support/ticket-chat'
import { TicketStatusBadge } from '@/components/support/ticket-status-badge'
import { TicketPriorityBadge } from '@/components/support/ticket-priority-badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const CATEGORY_LABELS: Record<string, string> = {
  BUG: 'Bug',
  QUESTION: 'Dúvida',
  FEATURE_REQUEST: 'Sugestão',
  BILLING: 'Financeiro',
  ONBOARDING: 'Onboarding',
  OTHER: 'Outro',
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function TicketDetailPage({ params }: Props) {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, organizationId: true, isRoiLabsStaff: true },
  })
  if (!user) redirect('/login')

  const { id } = await params

  const ticket = await prisma.supportTicket.findUnique({
    where: { id },
    include: {
      createdByUser: { select: { id: true, name: true, email: true } },
      assignedStaff: { select: { id: true, name: true, email: true } },
      organization: { select: { id: true, name: true } },
      messages: {
        where: { isInternal: false },
        orderBy: { createdAt: 'asc' },
        include: {
          author: { select: { id: true, name: true, email: true, isRoiLabsStaff: true } },
          attachments: true,
        },
      },
    },
  })

  if (!ticket) notFound()

  if (!user.isRoiLabsStaff && ticket.organizationId !== user.organizationId) {
    redirect('/dashboard/support')
  }

  // Mark as read
  if (ticket.unreadByUser) {
    prisma.supportTicket.update({ where: { id }, data: { unreadByUser: false } }).catch(() => {})
  }

  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col h-[calc(100vh-2rem)] relative">
      {/* Premium decorative gradient glow at the top right */}
      <div className="absolute top-0 right-0 w-[450px] h-[300px] bg-gradient-to-bl from-indigo-500/5 via-transparent to-transparent rounded-full blur-3xl pointer-events-none z-0" />

      {/* Header */}
      <div className="mb-6 flex-shrink-0 relative z-10">
        <Link 
          href="/dashboard/support" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground mb-4 transition-transform duration-200 hover:-translate-x-0.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Suporte
        </Link>
 
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-foreground">{ticket.subject}</h1>
            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
              <TicketStatusBadge status={ticket.status} />
              <TicketPriorityBadge priority={ticket.priority} />
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-muted/80 text-muted-foreground border border-border/30">
                {CATEGORY_LABELS[ticket.category] || ticket.category}
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold bg-muted/30 px-2 py-0.5 rounded border border-border/10">
                Aberto em {format(new Date(ticket.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </span>
            </div>
          </div>
 
          {ticket.status !== 'CLOSED' && ticket.status !== 'RESOLVED' && (
            <form 
              action={async () => {
                'use server'
                const session = await getSession()
                if (!session?.user?.email) return
                await prisma.supportTicket.update({
                  where: { id },
                  data: { status: 'CLOSED', closedAt: new Date() },
                })
                redirect('/dashboard/support')
              }}
              className="shrink-0"
            >
              <Button 
                type="submit" 
                variant="outline" 
                size="sm" 
                className="gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all shadow-sm font-bold text-xs"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                Marcar resolvido
              </Button>
            </form>
          )}
        </div>
      </div>
 
      {/* Chat */}
      <div className="flex-1 min-h-0 border border-border/40 rounded-2xl overflow-hidden bg-card/45 backdrop-blur-md shadow-sm relative z-10">
        <TicketChat
          ticketId={ticket.id}
          initialMessages={ticket.messages as never}
          currentUserId={user.id}
          isStaff={user.isRoiLabsStaff}
          ticketStatus={ticket.status}
        />
      </div>
    </div>
  )
}
