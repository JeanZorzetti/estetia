// SVG paths normalized to 100×100 viewBox
export const SHAPES = {
  circle: 'M 50,10 A 40,40 0 1,1 50,90 A 40,40 0 1,1 50,10 Z',
  triangle: 'M 50,5 L 95,90 L 5,90 Z',
  line: 'M 5,50 L 95,50 L 95,52 L 5,52 Z',
  asterisk: 'M 48,5 L 52,5 L 52,45 L 90,20 L 95,28 L 58,50 L 95,72 L 90,80 L 52,55 L 52,95 L 48,95 L 48,55 L 10,80 L 5,72 L 42,50 L 5,28 L 10,20 L 48,45 Z',
}

export const PHRASES = [
  {
    text: 'Cada paciente merece ser lembrado.',
    shape: 'circle' as const,
    accent: '#C5A059',
    caption: 'Relacionamento',
    metric: 92,
    metricPrefix: '',
    metricSuffix: '%',
    metricLabel: 'retenção de pacientes',
    metricColor: '#E8917A',
  },
  {
    text: 'Protocolos que não se perdem em papel.',
    shape: 'triangle' as const,
    accent: '#489FB5',
    caption: 'Precisão',
    metric: 0,
    metricPrefix: '',
    metricSuffix: '',
    metricLabel: 'prontuários perdidos',
    metricColor: '#9CAF88',
  },
  {
    text: 'Uma linha do tempo clínica clara.',
    shape: 'line' as const,
    accent: '#F0EDE8',
    caption: 'Clareza',
    metric: 3,
    metricPrefix: '',
    metricSuffix: 'M+',
    metricLabel: 'sessões registradas',
    metricColor: '#489FB5',
  },
  {
    text: 'Resultados que viram indicações.',
    shape: 'asterisk' as const,
    accent: '#C5A059',
    caption: 'Crescimento',
    metric: 58,
    metricPrefix: '+',
    metricSuffix: '%',
    metricLabel: 'mais indicações',
    metricColor: '#C5A059',
  },
]
