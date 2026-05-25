import { cva } from 'class-variance-authority'

export const TREATMENT_STATUS_LABELS: Record<string, string> = {
  AVALIACAO: 'Avaliação',
  ORCAMENTO_ENVIADO: 'Orçamento Enviado',
  AGENDADO: 'Agendado',
  EM_ANDAMENTO: 'Em Andamento',
  EM_TRATAMENTO: 'Em Tratamento',
  FINALIZADO: 'Finalizado',
  CONCLUIDO: 'Concluído',
  PAUSADO: 'Pausado',
  RETORNO: 'Retorno',
  CANCELADO: 'Cancelado',
}

export const SESSION_STATUS_LABELS: Record<string, string> = {
  REALIZADA: 'Realizada',
  NO_SHOW: 'Falta',
  AGENDADA: 'Agendada',
  CONFIRMADA: 'Confirmada',
  CANCELADA: 'Cancelada',
}

export const CONSENT_LABELS: Record<string, string> = {
  LGPD_DADOS_SAUDE: 'LGPD — Dados de Saúde',
  USO_FOTO: 'Uso de Imagem',
  AUTORIZACAO_PROCEDIMENTO: 'Autorização de Procedimento',
  TERMO_RISCO: 'Termo de Risco',
}

export const ORIGEM_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  indicacao: 'Indicação',
  google: 'Google',
  walk_in: 'Walk-in',
  outros: 'Outros',
}

export const treatmentStatusBadge = cva(
  'font-bold px-2.5 py-0.5 rounded-full border text-[10px] tracking-wide leading-tight',
  {
    variants: {
      status: {
        AVALIACAO: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        ORCAMENTO_ENVIADO: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        AGENDADO: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
        EM_ANDAMENTO: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        EM_TRATAMENTO: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        FINALIZADO: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        CONCLUIDO: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        PAUSADO: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        RETORNO: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
        CANCELADO: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
      },
    },
    defaultVariants: {
      status: 'AVALIACAO',
    },
  }
)
