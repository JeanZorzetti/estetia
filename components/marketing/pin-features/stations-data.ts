export type StationVisualId = 'agenda' | 'finance' | 'whatsapp' | 'photos'

export type Station = {
  id: StationVisualId
  index: string
  title: string
  description: string
  accent: string
}

export const stations: Station[] = [
  {
    id: 'agenda',
    index: '01',
    title: 'Agenda Inteligente',
    description:
      'Sua IA identifica horários ociosos e preenche com pacientes do recall — sem você levantar um dedo.',
    accent: '#489FB5',
  },
  {
    id: 'finance',
    index: '02',
    title: 'Financeiro Clínico',
    description:
      'Comissões de profissionais, custo real de procedimento e margem líquida em tempo real.',
    accent: '#C5A059',
  },
  {
    id: 'whatsapp',
    index: '03',
    title: 'Reativação WhatsApp',
    description:
      'A IA detecta pacientes elegíveis para retoque e dispara mensagens personalizadas no momento certo.',
    accent: '#22c55e',
  },
  {
    id: 'photos',
    index: '04',
    title: 'Evolução Antes/Depois',
    description:
      'Comparador de fotos com timeline clínica completa e consentimento digital integrado.',
    accent: '#C5A059',
  },
]
