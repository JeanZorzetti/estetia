import { cn } from '@/lib/utils'

const STATUS_LABELS: Record<string, string> = {
  AGENDADA: 'Agendada',
  CONFIRMADA: 'Confirmada',
  REALIZADA: 'Realizada',
  NO_SHOW: 'No-show',
  REMARCADA: 'Remarcada',
  CANCELADA: 'Cancelada',
}

const STATUS_COLORS: Record<string, string> = {
  AGENDADA:   'bg-teal-50 text-teal-600 border-teal/30',
  CONFIRMADA: 'bg-navy-50 text-navy border-navy/20',
  REALIZADA:  'bg-gold-50 text-gold-600 border-gold/30',
  NO_SHOW:    'bg-red-50 text-red-600 border-red-300',
  REMARCADA:  'bg-gold-50 text-gold-600 border-gold/20',
  CANCELADA:  'bg-slate-100 text-slate-500 border-slate-200',
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span className={cn(
      'inline-flex items-center border font-bold text-[9px] px-2 py-0.5 rounded-full tracking-widest uppercase leading-none shadow-sm',
      STATUS_COLORS[status] ?? STATUS_COLORS.AGENDADA,
      className
    )}>
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}
