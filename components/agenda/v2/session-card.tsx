'use client'

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Clock } from 'lucide-react'
import { StatusBadge } from './status-badge'
import { NoShowBadge } from './no-show-badge'
import type { AgendaSession } from './types'
import { cn } from '@/lib/utils'

interface Props {
  session: AgendaSession
  onClick: () => void
  /** Pixel height of the card (calculated from duration × pxPerMinute). */
  heightPx: number
  /** Pixel offset from top of column (minutes from view start × pxPerMinute). */
  topPx: number
  /** Column width as percentage (for overlap support). */
  widthPct?: number
  leftPct?: number
}

export function SessionCard({ session, onClick, heightPx, topPx, widthPct = 100, leftPct = 0 }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: session.id,
    data: { session },
  })

  const finalizado = ['REALIZADA', 'NO_SHOW', 'CANCELADA'].includes(session.status)
  const color = session.sala?.cor || '#6366f1'

  return (
    <div
      ref={setNodeRef}
      onClick={(e) => {
        if (isDragging) return
        e.stopPropagation()
        onClick()
      }}
      style={{
        top: `${topPx}px`,
        height: `${Math.max(heightPx, 32)}px`,
        left: `calc(${leftPct}% + 2px)`,
        width: `calc(${widthPct}% - 4px)`,
        borderLeftColor: color,
        backgroundColor: `${color}15`,
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 50 : 1,
      }}
      className={cn(
        'absolute rounded-md border border-border/40 border-l-4 px-2 py-1 cursor-grab active:cursor-grabbing overflow-hidden transition-all',
        'hover:shadow-md hover:border-border hover:z-10',
        finalizado && 'opacity-60',
        isDragging && 'shadow-2xl ring-2 ring-primary opacity-90',
      )}
      {...listeners}
      {...attributes}
    >
      <div className="flex items-start justify-between gap-1 mb-0.5">
        <p className="text-[11px] font-semibold leading-tight truncate flex-1">
          {session.treatment.paciente.nome}
        </p>
        <NoShowBadge score={session.noShowScore} />
      </div>
      {session.treatment.procedure && (
        <p className="text-[10px] text-muted-foreground truncate leading-tight">
          {session.treatment.procedure.nome}
        </p>
      )}
      <div className="flex items-center gap-1 mt-1 text-[9px] text-muted-foreground">
        <Clock className="w-2.5 h-2.5" />
        <span className="tabular-nums">
          {new Date(session.dataAgendada).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </span>
        {session.profissional && (
          <span className="truncate">· {session.profissional.nome}</span>
        )}
      </div>
      {heightPx > 60 && <StatusBadge status={session.status} className="mt-1" />}
    </div>
  )
}
