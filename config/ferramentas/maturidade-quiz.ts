export type QuizQuestion = {
  id: string
  dimension: 'agenda' | 'prontuario' | 'marketing' | 'gestao'
  text: string
  options: { label: string; value: number }[]
}

export type MaturityLevel = {
  label: string
  range: [number, number]
  color: string
  bgColor: string
  description: string
  icon: string
}

export type MaturityRecommendation = {
  condition: (scores: Record<string, number>) => boolean
  featureSlug: string
  title: string
  description: string
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Agenda & Atendimento (30 pontos)
  {
    id: 'agenda_online',
    dimension: 'agenda',
    text: 'Seus pacientes conseguem se agendar online sem ligar para a clínica?',
    options: [
      { label: 'Não, só por telefone ou WhatsApp manual', value: 0 },
      { label: 'Parcialmente, temos um formulário básico', value: 5 },
      { label: 'Sim, agenda online 24h integrada ao sistema', value: 10 },
    ],
  },
  {
    id: 'confirmacao',
    dimension: 'agenda',
    text: 'Como é feita a confirmação de consultas?',
    options: [
      { label: 'Ligamos manualmente para cada paciente', value: 0 },
      { label: 'Enviamos mensagem manual no WhatsApp', value: 3 },
      { label: 'Confirmação automática por WhatsApp/SMS', value: 10 },
    ],
  },
  {
    id: 'recall',
    dimension: 'agenda',
    text: 'Como você faz o recall (reativação de pacientes que sumiram)?',
    options: [
      { label: 'Não faço recall sistemático', value: 0 },
      { label: 'Faço manualmente de vez em quando', value: 3 },
      { label: 'Recall automático com régua de comunicação', value: 10 },
    ],
  },
  // Prontuário & Clínico (20 pontos)
  {
    id: 'prontuario',
    dimension: 'prontuario',
    text: 'Como você registra prontuários e evoluções dos pacientes?',
    options: [
      { label: 'Em papel ou caderno', value: 0 },
      { label: 'Em planilhas ou Word/PDF', value: 3 },
      { label: 'Prontuário eletrônico digital no sistema', value: 10 },
    ],
  },
  {
    id: 'fotos',
    dimension: 'prontuario',
    text: 'Você registra fotos evolutivas dos tratamentos dos pacientes?',
    options: [
      { label: 'Não registro fotos sistematicamente', value: 0 },
      { label: 'Salvo no celular/galeria', value: 3 },
      { label: 'Fotos vinculadas ao prontuário digital', value: 10 },
    ],
  },
  // Marketing & Comunicação (30 pontos)
  {
    id: 'whatsapp',
    dimension: 'marketing',
    text: 'Como é o seu relacionamento com pacientes via WhatsApp?',
    options: [
      { label: 'Conversa pessoal sem organização', value: 0 },
      { label: 'WhatsApp Business com catálogo básico', value: 5 },
      { label: 'WhatsApp Business integrado ao CRM com histórico', value: 10 },
    ],
  },
  {
    id: 'campanhas',
    dimension: 'marketing',
    text: 'Você faz campanhas de marketing para pacientes inativos?',
    options: [
      { label: 'Não faço campanhas segmentadas', value: 0 },
      { label: 'Envio mensagens ocasionais para toda a base', value: 5 },
      { label: 'Campanhas automáticas segmentadas por perfil', value: 10 },
    ],
  },
  {
    id: 'nps',
    dimension: 'marketing',
    text: 'Você coleta feedback dos pacientes após as consultas?',
    options: [
      { label: 'Não coletamos feedback sistematicamente', value: 0 },
      { label: 'Pedimos avaliação manualmente às vezes', value: 3 },
      { label: 'NPS automático enviado após cada atendimento', value: 10 },
    ],
  },
  // Gestão & Compliance (20 pontos)
  {
    id: 'financeiro',
    dimension: 'gestao',
    text: 'Como você controla o financeiro da clínica?',
    options: [
      { label: 'Planilha manual ou caderno', value: 0 },
      { label: 'Software financeiro separado do sistema clínico', value: 5 },
      { label: 'Financeiro integrado ao sistema de gestão', value: 10 },
    ],
  },
  {
    id: 'lgpd',
    dimension: 'gestao',
    text: 'Como você trata os dados dos pacientes em relação à LGPD?',
    options: [
      { label: 'Não tenho processo formal de proteção de dados', value: 0 },
      { label: 'Tenho termos de consentimento em papel', value: 5 },
      { label: 'Consentimento digital, criptografia e backups automáticos', value: 10 },
    ],
  },
]

export const MATURITY_LEVELS: MaturityLevel[] = [
  {
    label: 'Tradicional',
    range: [0, 30],
    color: '#E05A4E',
    bgColor: '#FEF2F2',
    description: 'Sua clínica ainda opera com processos manuais. Há grande espaço para ganhos rápidos com digitalização básica.',
    icon: '📋',
  },
  {
    label: 'Em Transição',
    range: [31, 60],
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    description: 'Você já deu alguns passos na digitalização, mas ainda existem gargalos que custam tempo e dinheiro.',
    icon: '🔄',
  },
  {
    label: 'Digital',
    range: [61, 85],
    color: '#489FB5',
    bgColor: '#F0F9FF',
    description: 'Sua clínica tem boa base digital. Foco agora em automação e análise de dados para crescer com escala.',
    icon: '💻',
  },
  {
    label: 'Avançada',
    range: [86, 100],
    color: '#10B981',
    bgColor: '#F0FDF4',
    description: 'Clínica referência em gestão digital! Continue inovando com IA e análise preditiva.',
    icon: '🚀',
  },
]

export const RECOMMENDATIONS: MaturityRecommendation[] = [
  {
    condition: (s) => (s.agenda_online ?? 0) < 10,
    featureSlug: 'agenda-inteligente',
    title: 'Ative o agendamento online 24h',
    description: 'Pacientes que agendam online têm 3x mais taxa de confirmação. Reduza no-shows na raiz.',
  },
  {
    condition: (s) => (s.confirmacao ?? 0) < 10,
    featureSlug: 'recall-automatico',
    title: 'Automatize confirmações e recall',
    description: 'Confirmação automática reduz no-shows em até 70%. Recupere pacientes inativos sem esforço manual.',
  },
  {
    condition: (s) => (s.prontuario ?? 0) < 10,
    featureSlug: 'prontuario-eletronico',
    title: 'Migre para prontuário eletrônico',
    description: 'Prontuário digital reduz tempo de preenchimento em 60% e elimina risco de perda de dados.',
  },
  {
    condition: (s) => (s.fotos ?? 0) < 10,
    featureSlug: 'evolucao-fotos',
    title: 'Documente evolução com fotos',
    description: 'Fotos evolutivas aumentam percepção de valor do tratamento e motivam o paciente a continuar.',
  },
  {
    condition: (s) => (s.whatsapp ?? 0) < 10,
    featureSlug: 'whatsapp-business',
    title: 'Integre WhatsApp ao seu CRM',
    description: 'Histórico unificado de conversas, sem perder contexto entre atendentes.',
  },
  {
    condition: (s) => (s.campanhas ?? 0) < 10,
    featureSlug: 'marketing-clinico',
    title: 'Lance campanhas segmentadas',
    description: 'Reative pacientes inativos há 60-90 dias com campanhas automáticas de acordo com o perfil.',
  },
  {
    condition: (s) => (s.financeiro ?? 0) < 10,
    featureSlug: 'financeiro-tiss',
    title: 'Centralize a gestão financeira',
    description: 'DRE, fluxo de caixa e comissões integrados ao sistema clínico — sem planilha manual.',
  },
  {
    condition: (s) => (s.lgpd ?? 0) < 10,
    featureSlug: 'lgpd-seguranca',
    title: 'Adeque sua clínica à LGPD',
    description: 'Evite multas de até R$ 50M. Consentimento digital, criptografia e log de acesso automáticos.',
  },
]

export function calculateScore(answers: Record<string, number>): number {
  return Object.values(answers).reduce((sum, v) => sum + v, 0)
}

export function getMaturityLevel(score: number): MaturityLevel {
  return MATURITY_LEVELS.find(
    (l) => score >= l.range[0] && score <= l.range[1]
  ) ?? MATURITY_LEVELS[0]
}

export function getRecommendations(answers: Record<string, number>, max = 4): MaturityRecommendation[] {
  return RECOMMENDATIONS.filter((r) => r.condition(answers)).slice(0, max)
}
