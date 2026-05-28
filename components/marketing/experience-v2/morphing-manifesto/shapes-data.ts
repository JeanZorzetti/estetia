// Manifesto phrases, each anchored to a real clinical product mockup
export type MockupKind = 'kanban' | 'inbox' | 'calendar' | 'chart'

export const PHRASES = [
  {
    text: 'Cada paciente merece ser lembrado.',
    caption: 'Relacionamento',
    accent: '#C5A059',
    mockup: 'kanban' as MockupKind,
    metric: 92,
    metricPrefix: '',
    metricSuffix: '%',
    metricLabel: 'retenção de pacientes',
    metricColor: '#E8917A',
  },
  {
    text: 'Protocolos que não se perdem em papel.',
    caption: 'Precisão',
    accent: '#489FB5',
    mockup: 'inbox' as MockupKind,
    metric: 0,
    metricPrefix: '',
    metricSuffix: '',
    metricLabel: 'prontuários perdidos',
    metricColor: '#9CAF88',
  },
  {
    text: 'Uma linha do tempo clínica clara.',
    caption: 'Clareza',
    accent: '#F0EDE8',
    mockup: 'calendar' as MockupKind,
    metric: 3,
    metricPrefix: '',
    metricSuffix: 'M+',
    metricLabel: 'sessões registradas',
    metricColor: '#489FB5',
  },
  {
    text: 'Resultados que viram indicações.',
    caption: 'Crescimento',
    accent: '#C5A059',
    mockup: 'chart' as MockupKind,
    metric: 58,
    metricPrefix: '+',
    metricSuffix: '%',
    metricLabel: 'mais indicações',
    metricColor: '#C5A059',
  },
]
