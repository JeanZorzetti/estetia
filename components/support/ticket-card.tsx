import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { MessageCircle, Circle } from 'lucide-react'
import { TicketStatusBadge } from './ticket-status-badge'
import { TicketPriorityBadge } from './ticket-priority-badge'
import type { TicketStatus, TicketPriority, TicketCategory } from '@prisma/client'
import { cn } from '@/lib/utils'


const CATEGORY_LABELS: Record<TicketCategory, string> = {
  BUG: 'Bug',
  QUESTION: 'Dúvida',
  FEATURE_REQUEST: 'Sugestão',
  BILLING: 'Financeiro',
  ONBOARDING: 'Onboarding',
  OTHER: 'Outro',
}

interface TicketCardProps {
  ticket: {
    id: string
    subject: string
    status: TicketStatus
    priority: TicketPriority
    category: TicketCategory
    createdAt: Date | string
    lastMessageAt: Date | string | null
    unreadByUser: boolean
    unreadByStaff: boolean
    createdByUser?: { name?: string | null; email: string }
    organization?: { name: string }
    _count?: { messages: number }
  }
  isStaff?: boolean
  href: string
}

export function TicketCard({ ticket, isStaff, href }: TicketCardProps) {
  const isUnread = isStaff ? ticket.unreadByStaff : ticket.unreadByUser
  const timeAgo = ticket.lastMessageAt
    ? formatDistanceToNow(new Date(ticket.lastMessageAt), { addSuffix: true, locale: ptBR })
    : formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true, locale: ptBR })

  return (
    <Link
      href={href}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl relative z-10"
      aria-label={`Ticket: ${ticket.subject}`}
    >
      <div
        className={cn(
          'relative rounded-2xl p-5 border bg-card/45 backdrop-blur-md flex items-start gap-4 overflow-hidden',
          'transition-all duration-300 ease-out',
          'group-hover:-translate-y-0.5 group-hover:shadow-md group-hover:border-indigo-500/20',
          isUnread ? 'border-indigo-500/25 bg-indigo-500/[0.01] shadow-[0_4px_20px_-4px_rgba(99,102,241,0.03)]' : 'border-border/40'
        )}
      >
        {/* Ambient Corner Glow */}
        <div className="absolute -right-16 -bottom-16 w-36 h-36 rounded-full blur-3xl opacity-0 group-hover:opacity-10 bg-indigo-500 transition-opacity duration-500 pointer-events-none" />

        {/* Status Indicator Beacon */}
        <div className="flex-shrink-0 mt-1">
          {isUnread ? (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
          ) : (
            <div className="w-2 h-2 rounded-full bg-transparent" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn(
              'text-sm truncate transition-colors group-hover:text-primary',
              isUnread ? 'text-foreground font-bold' : 'text-foreground/80 font-semibold'
            )}>
              {ticket.subject}
            </span>
          </div>

          {isStaff && ticket.organization && (
            <p className="text-xs text-muted-foreground mt-0.5 font-medium">{ticket.organization.name}</p>
          )}

          <div className="flex items-center gap-1.5 flex-wrap mt-3">
            <TicketStatusBadge status={ticket.status} />
            <TicketPriorityBadge priority={ticket.priority} />
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-muted/80 text-muted-foreground border border-border/30">
              {CATEGORY_LABELS[ticket.category]}
            </span>
          </div>
        </div>

        {/* Right Info: Time & Message Count */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0 text-[10px] text-muted-foreground font-semibold">
          <span className="whitespace-nowrap">{timeAgo}</span>
          {ticket._count && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-muted/50 border border-border/20">
              <MessageCircle className="h-3 w-3 text-muted-foreground/75" />
              <span className="tabular-nums">{ticket._count.messages}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
