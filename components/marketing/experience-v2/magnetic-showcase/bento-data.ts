export type MockupKind = 'kanban' | 'triage' | 'chart' | 'inbox' | 'calendar' | 'payment'

export interface BentoItem {
  id: string
  title: string
  description: string
  accent: string
  tag: string
  iconName: 'LayoutGrid' | 'Brain' | 'BarChart3' | 'Mail' | 'Calendar' | 'CreditCard'
  mockup: MockupKind
}

export const BENTO_ITEMS: BentoItem[] = [
  {
    id: 'kanban',
    title: 'Kanban Clínico',
    description: 'Visualize cada paciente em seu estágio de tratamento. Arraste, priorize, nunca perca um follow-up.',
    accent: '#C5A059',
    tag: 'Organização',
    iconName: 'LayoutGrid',
    mockup: 'kanban',
  },
  {
    id: 'ai-triage',
    title: 'Triagem com IA',
    description: 'A IA classifica a urgência clínica em segundos e sugere o próximo passo antes de você abrir o prontuário.',
    accent: '#489FB5',
    tag: 'Inteligência',
    iconName: 'Brain',
    mockup: 'triage',
  },
  {
    id: 'analytics',
    title: 'Analytics em tempo real',
    description: 'LTV, churn, taxa de retorno — dashboards editoriais que revelam o que realmente impacta sua receita.',
    accent: '#C5A059',
    tag: 'Crescimento',
    iconName: 'BarChart3',
    mockup: 'chart',
  },
  {
    id: 'email',
    title: 'Automações de Email',
    description: 'Sequências personalizadas que reengajam pacientes no momento certo, com a mensagem certa.',
    accent: '#489FB5',
    tag: 'Retenção',
    iconName: 'Mail',
    mockup: 'inbox',
  },
  {
    id: 'calendar',
    title: 'Agenda Inteligente',
    description: 'Agendamento online com confirmação automática. Sem ligações, sem faltas, sem fricção.',
    accent: '#C5A059',
    tag: 'Eficiência',
    iconName: 'Calendar',
    mockup: 'calendar',
  },
  {
    id: 'payments',
    title: 'Pagamentos integrados',
    description: 'Link de cobrança, parcelamento e conciliação financeira — tudo dentro do CRM, em segundos.',
    accent: '#489FB5',
    tag: 'Financeiro',
    iconName: 'CreditCard',
    mockup: 'payment',
  },
]
