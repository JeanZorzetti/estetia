import type { IntegrationCategory } from './integration-registry'

const CATEGORY_META: Record<IntegrationCategory, { emoji: string; label: string }> = {
  mensageria: { emoji: '💬', label: 'Mensageria' },
  telefonia: { emoji: '☎', label: 'Telefonia' },
  calendarios: { emoji: '📅', label: 'Calendários' },
  'email-marketing': { emoji: '📧', label: 'E-mail & Marketing' },
  anuncios: { emoji: '📣', label: 'Anúncios' },
  pagamentos: { emoji: '💳', label: 'Pagamentos' },
  nfse: { emoji: '🧾', label: 'NF-Se' },
  convenios: { emoji: '🏥', label: 'Convênios & TISS' },
  telemedicina: { emoji: '🩺', label: 'Telemedicina' },
  erp: { emoji: '🏢', label: 'ERP & Operações' },
  produtividade: { emoji: '⚡', label: 'Produtividade' },
  webhooks: { emoji: '🔗', label: 'Webhooks & Automação' },
  validacoes: { emoji: '✅', label: 'Validações' },
}

interface Props {
  category: IntegrationCategory
  count: number
}

export function CategorySectionHeader({ category, count }: Props) {
  const meta = CATEGORY_META[category]
  return (
    <div className="flex items-center gap-2 border-b border-border/40 pb-2">
      <span className="text-base leading-none" aria-hidden>
        {meta.emoji}
      </span>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-foreground/70">
        {meta.label}
      </h2>
      <span className="text-[10px] text-muted-foreground">({count})</span>
    </div>
  )
}
