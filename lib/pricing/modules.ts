// Pricing v3.0 — Modular plan composition
// All prices in CENTS (Int) to avoid float arithmetic issues

export const BASE_PRICE_CENTS = 3900 // R$ 39 — Plataforma Base obrigatória

export const EXTRA_USER_CENTS = 1900 // R$ 19 / usuário extra
export const EXTRA_ROOM_CENTS = 900  // R$ 9 / sala extra
export const EXTRA_PROF_CENTS = 1500 // R$ 15 / profissional extra na agenda

export const INCLUDED_BASE_QUOTAS = {
  users: 2,
  rooms: 1,
  profs: 1,
}

export const ANNUAL_DISCOUNT_PCT = 15 // 15% off no anual

// Mutex groups: only one module per group can be selected
export const MUTEX_GROUPS: Record<string, string[]> = {
  ia_tier: ['ia_lite', 'ia_pro', 'ia_scale'],
}

export type PricingCategory = 'BASE' | 'CLINICO' | 'COMUNICACAO' | 'GESTAO' | 'IA' | 'ADDON'

export interface PricingModuleData {
  slug: string
  category: PricingCategory
  nome: string
  descricao: string
  features: string[]
  priceCents: number
  iconLucide: string
  exclusiveGroup?: string | null
  required?: boolean
  ordem: number
}

// SEED data — source of truth para o catálogo
export const PRICING_MODULES_SEED: PricingModuleData[] = [
  // ============ BASE (obrigatório) ============
  {
    slug: 'base',
    category: 'BASE',
    nome: 'Plataforma Base',
    descricao: 'Infraestrutura essencial: cadastro de pacientes, agenda básica, LGPD e suporte.',
    features: [
      'Pacientes ilimitados',
      'Agenda (1 profissional, 1 sala)',
      '2 usuários incluídos',
      'LGPD essencial (consentimentos + audit log)',
      'Dashboard básico',
      'Suporte por e-mail',
    ],
    priceCents: 3900,
    iconLucide: 'LayoutDashboard',
    required: true,
    ordem: 0,
  },

  // ============ CLÍNICO ============
  {
    slug: 'prontuario',
    category: 'CLINICO',
    nome: 'Prontuário Eletrônico',
    descricao: 'Prontuários completos + anamneses customizáveis com templates por procedimento.',
    features: [
      'Prontuários ilimitados',
      'Anamneses customizáveis',
      'Biblioteca de templates',
      'Histórico clínico completo',
      'Hipótese diagnóstica + plano de tratamento',
    ],
    priceCents: 2900,
    iconLucide: 'ClipboardList',
    ordem: 10,
  },
  {
    slug: 'procedimentos',
    category: 'CLINICO',
    nome: 'Procedimentos & Tratamentos',
    descricao: 'Catálogo de procedimentos com preço/duração + planos de tratamento multi-sessão.',
    features: [
      'Catálogo de procedimentos',
      'Planos de tratamento multi-sessão',
      'Profissionais habilitados por procedimento',
      'Controle de sessões realizadas/previstas',
      'Faturamento por tratamento',
    ],
    priceCents: 1900,
    iconLucide: 'Syringe',
    ordem: 20,
  },
  {
    slug: 'fotos',
    category: 'CLINICO',
    nome: 'Fotos Before/After',
    descricao: 'Galeria fotográfica por paciente com consentimento LGPD e organização por sessão.',
    features: [
      'Upload com consentimento',
      'Galeria por paciente',
      'Tipos: antes/depois/evolução',
      'Ângulos padronizados',
      'Storage criptografado',
    ],
    priceCents: 1900,
    iconLucide: 'Camera',
    ordem: 30,
  },
  {
    slug: 'pacotes',
    category: 'CLINICO',
    nome: 'Pacotes de Sessões',
    descricao: 'Venda de pacotes com controle de sessões consumidas e expiração.',
    features: [
      'Pacotes customizáveis',
      'Controle de sessões consumidas',
      'Intervalo mínimo entre sessões',
      'Expiração configurável',
      'Status: ativo/concluído/expirado',
    ],
    priceCents: 1500,
    iconLucide: 'Package',
    ordem: 40,
  },
  {
    slug: 'recall',
    category: 'CLINICO',
    nome: 'Recall Automático',
    descricao: 'Regras automáticas de re-engajamento via WhatsApp/Email após N dias.',
    features: [
      'Regras customizáveis',
      'Disparo via WhatsApp ou Email',
      'Templates personalizáveis',
      'Por procedimento ou geral',
      'Histórico de envios',
    ],
    priceCents: 2500,
    iconLucide: 'Repeat2',
    ordem: 50,
  },

  // ============ COMUNICAÇÃO ============
  {
    slug: 'whatsapp_evolution',
    category: 'COMUNICACAO',
    nome: 'WhatsApp Evolution',
    descricao: 'Integração WhatsApp não-oficial (Evolution API) + Chat Center completo.',
    features: [
      '1 instância WhatsApp',
      'Chat Center completo',
      'Mídia (fotos/vídeos/áudios)',
      'Templates de mensagem',
      'Histórico por contato',
    ],
    priceCents: 7900,
    iconLucide: 'MessageCircle',
    ordem: 110,
  },
  {
    slug: 'whatsapp_waba',
    category: 'COMUNICACAO',
    nome: 'WhatsApp Cloud API (Oficial Meta)',
    descricao: 'WhatsApp Business oficial Meta com templates aprovados e selo verificado.',
    features: [
      'WABA oficial Meta',
      'Templates aprovados',
      'Selo verificado',
      'Webhooks oficiais',
      'Conformidade enterprise',
    ],
    priceCents: 14900,
    iconLucide: 'BadgeCheck',
    ordem: 120,
  },
  {
    slug: 'marketing_clinico',
    category: 'COMUNICACAO',
    nome: 'Marketing Clínico',
    descricao: 'Campanhas em massa + Fidelidade (pontos) + Indicações paciente→paciente.',
    features: [
      'Campanhas WhatsApp/Email em massa',
      'Programa de Fidelidade (pontos)',
      'Indicações P2P com recompensas',
      'Segmentação por tags',
      'Métricas de campanhas',
    ],
    priceCents: 4900,
    iconLucide: 'Megaphone',
    ordem: 130,
  },
  {
    slug: 'instagram',
    category: 'COMUNICACAO',
    nome: 'Integração Instagram',
    descricao: 'Bot Instagram para respostas automáticas + agendamento de posts.',
    features: [
      'Bot de DMs Instagram',
      'Posts agendados',
      'Aprovação multi-usuário',
      'Comentários gerenciados',
      'Métricas integradas',
    ],
    priceCents: 3900,
    iconLucide: 'Instagram',
    ordem: 140,
  },

  // ============ GESTÃO ============
  {
    slug: 'financeiro',
    category: 'GESTAO',
    nome: 'Financeiro & Fluxo de Caixa',
    descricao: 'Dashboard analítico de recebíveis, gráficos mensais e exportação CSV.',
    features: [
      'KPIs (recebido/a receber/vencidos)',
      'Gráfico mensal 12 meses',
      'Comparativo por operadora',
      'Exportação CSV (Excel BR)',
      'Filtros avançados',
    ],
    priceCents: 3900,
    iconLucide: 'Wallet',
    ordem: 210,
  },
  {
    slug: 'tiss',
    category: 'GESTAO',
    nome: 'TISS & Operadoras',
    descricao: 'Operadoras + Convênios + Geração de Guias TISS 4.01 conforme padrão ANS.',
    features: [
      'Cadastro de operadoras',
      'Tabela de convênios negociados',
      'Geração XML TISS 4.01 (ANS)',
      'Hash MD5 padrão ANS',
      'Tracking de status das guias',
    ],
    priceCents: 5900,
    iconLucide: 'FileCheck2',
    ordem: 220,
  },
  {
    slug: 'omie',
    category: 'GESTAO',
    nome: 'Integração Omie ERP',
    descricao: 'Sincronização de recebíveis e clientes com Omie ERP.',
    features: [
      'Sync de recebíveis',
      'Sync de clientes',
      'Sync manual sob demanda',
      'Status de integração',
      'Logs de erros',
    ],
    priceCents: 2900,
    iconLucide: 'RefreshCw',
    ordem: 230,
  },
  {
    slug: 'analytics_avancado',
    category: 'GESTAO',
    nome: 'Analytics Avançado',
    descricao: 'Dashboards customizáveis com drill-down e relatórios exportáveis.',
    features: [
      'Dashboards customizáveis',
      'Relatórios drill-down',
      'Comparativos período a período',
      'Export PDF/Excel',
      'Agendamento de relatórios',
    ],
    priceCents: 3900,
    iconLucide: 'BarChart3',
    ordem: 240,
  },

  // ============ IA (mutex: ia_tier) ============
  {
    slug: 'ia_lite',
    category: 'IA',
    nome: 'Estetia IA — Lite',
    descricao: 'Agente inteligente para qualificar leads e fazer follow-up automático.',
    features: [
      '1 agente IA',
      '200 ações/mês',
      'Qualificação de leads',
      'Follow-up automático',
      'Aprovação manual de ações',
    ],
    priceCents: 4900,
    iconLucide: 'Sparkles',
    exclusiveGroup: 'ia_tier',
    ordem: 310,
  },
  {
    slug: 'ia_pro',
    category: 'IA',
    nome: 'Estetia IA — Pro',
    descricao: 'Trio de agentes IA com 5x mais capacidade para clínicas com volume médio.',
    features: [
      '3 agentes IA',
      '1.000 ações/mês',
      'Múltiplas habilidades por agente',
      'Knowledge base RAG',
      'Confiança configurável',
    ],
    priceCents: 12900,
    iconLucide: 'Brain',
    exclusiveGroup: 'ia_tier',
    ordem: 320,
  },
  {
    slug: 'ia_scale',
    category: 'IA',
    nome: 'Estetia IA — Scale',
    descricao: 'Suite completa de IA para clínicas grandes com automação intensiva.',
    features: [
      '5 agentes IA',
      '3.000 ações/mês',
      'Skills customizadas',
      'Webhook triggers',
      'Auditoria completa',
    ],
    priceCents: 29900,
    iconLucide: 'Rocket',
    exclusiveGroup: 'ia_tier',
    ordem: 330,
  },
  {
    slug: 'n8n',
    category: 'IA',
    nome: 'Integração N8N',
    descricao: 'Workflow automation builder para criar automações customizadas.',
    features: [
      'Workflows visuais',
      'Webhook triggers',
      'Integração com 200+ apps',
      'Self-hosted ou cloud',
      'Logs detalhados',
    ],
    priceCents: 1900,
    iconLucide: 'Workflow',
    ordem: 340,
  },
]
