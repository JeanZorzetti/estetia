import { cn } from '@/lib/utils'

const ACTION_LABELS: Record<string, string> = {
  VIEW: 'Visualização',
  CREATE: 'Criação',
  UPDATE: 'Edição',
  EXPORT: 'Exportação',
  DELETE: 'Exclusão',
  ANONYMIZE: 'Anonimização',
}

const ACTION_COLORS: Record<string, string> = {
  VIEW: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  CREATE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  UPDATE: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  EXPORT: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  ANONYMIZE: 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400',
}

export function ActionBadge({ action }: { action: string }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
      ACTION_COLORS[action] ?? ACTION_COLORS.VIEW,
    )}>
      {ACTION_LABELS[action] ?? action}
    </span>
  )
}
