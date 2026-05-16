'use client'

import { UserCategoria } from '@prisma/client'
import { cn } from '@/lib/utils'

const CONFIG: Record<UserCategoria, { label: string; className: string }> = {
  CLINICO: {
    label: 'Clínico',
    className: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  },
  ADMINISTRATIVO: {
    label: 'Administrativo',
    className: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  },
  PROPRIETARIO: {
    label: 'Proprietário',
    className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  },
}

export function CategoriaBadge({ categoria }: { categoria: UserCategoria }) {
  const { label, className } = CONFIG[categoria]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        className
      )}
    >
      {label}
    </span>
  )
}
