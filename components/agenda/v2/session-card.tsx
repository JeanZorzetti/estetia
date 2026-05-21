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
        backgroundColor: `${color}18`,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 50 : 1,
      }}
      className={cn(
        'absolute rounded-xl border border-white/60 border-l-[5px] px-2.5 py-1.5 cursor-grab active:cursor-grabbing overflow-hidden transition-all duration-300',
        'hover:shadow-[0_8px_20px_rgba(0,0,0,0.05)] hover:border-white/90 hover:-translate-y-[1px] hover:z-20',
        finalizado && 'opacity-55',
        isDragging && 'shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-2 ring-[#489FB5] opacity-90 scale-[1.01] z-50',
      )}
      {...listeners}
      {...attributes}
    >
      {/* Delicate white inner shine line */}
      <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-[10px]" />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <div className="flex items-start justify-between gap-1 mb-0.5">
            <p className="text-[11px] font-bold text-slate-800 leading-tight truncate flex-1">
              {session.treatment.paciente.nome}
            </p>
            <NoShowBadge score={session.noShowScore} />
          </div>
          {session.treatment.procedure && (
            <p className="text-[9px] font-semibold text-slate-500 truncate leading-tight">
              {session.treatment.procedure.nome}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 mt-auto pt-1">
          <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
            <Clock className="w-2.5 h-2.5 text-slate-400/80" />
            <span className="tabular-nums">
              {new Date(session.dataAgendada).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </span>
            {session.profissional && (
              <span className="truncate max-w-[50px]">· {session.profissional.nome.split(' ')[0]}</span>
            )}
          </div>
          {heightPx > 64 && <StatusBadge status={session.status} className="scale-90 origin-bottom-right shrink-0" />}
        </div>
      </div>
    </div>
  )
}

