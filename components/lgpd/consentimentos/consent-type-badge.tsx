import { cn } from '@/lib/utils'

const TYPE_LABELS: Record<string, string> = {
  LGPD_DADOS_SAUDE: 'Dados de Saúde',
  USO_FOTO_MARKETING: 'Foto/Marketing',
  AUTORIZACAO_PROCEDIMENTO: 'Procedimento',
  TERMO_RISCO: 'Termo de Risco',
  TERMO_MENOR_IDADE: 'Menor de Idade',
}

const TYPE_COLORS: Record<string, string> = {
  LGPD_DADOS_SAUDE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  USO_FOTO_MARKETING: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  AUTORIZACAO_PROCEDIMENTO: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  TERMO_RISCO: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  TERMO_MENOR_IDADE: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
}

export function ConsentTypeBadge({ tipo }: { tipo: string }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
      TYPE_COLORS[tipo] ?? 'bg-muted text-muted-foreground',
    )}>
      {TYPE_LABELS[tipo] ?? tipo}
    </span>
  )
}
