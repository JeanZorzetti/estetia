import { cn } from '@/lib/utils'

const TYPE_LABELS: Record<string, string> = {
  LGPD_DADOS_SAUDE: 'Dados de Saúde',
  USO_FOTO_MARKETING: 'Foto/Marketing',
  AUTORIZACAO_PROCEDIMENTO: 'Procedimento',
  TERMO_RISCO: 'Termo de Risco',
  TERMO_MENOR_IDADE: 'Menor de Idade',
}

const TYPE_COLORS: Record<string, string> = {
  LGPD_DADOS_SAUDE: 'bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 font-black shadow-xs',
  USO_FOTO_MARKETING: 'bg-gold-500/10 border border-gold-500/20 text-gold-600 dark:text-gold-400 font-black shadow-xs',
  AUTORIZACAO_PROCEDIMENTO: 'bg-navy-500/10 border border-navy-500/20 text-navy dark:text-navy-200 font-black shadow-xs',
  TERMO_RISCO: 'bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-black shadow-xs',
  TERMO_MENOR_IDADE: 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-black shadow-xs',
}

export function ConsentTypeBadge({ tipo }: { tipo: string }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-1 rounded-full text-[9px] uppercase tracking-widest leading-none select-none font-bold',
      TYPE_COLORS[tipo] ?? 'bg-muted border border-border/40 text-muted-foreground',
    )}>
      {TYPE_LABELS[tipo] ?? tipo}
    </span>
  )
}

