import { TrendingUp, Clock, Users, DollarSign, Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type FerramentaItem = {
  slug: string
  icon: LucideIcon
  label: string
  description: string
  cardColor: string
  ctaFeatureSlug?: string
  tKey: string
}

export const FERRAMENTAS: FerramentaItem[] = [
  {
    slug: 'calculadora-roi',
    icon: TrendingUp,
    label: 'Calculadora ROI',
    description: 'Descubra quanto sua clínica pode faturar a mais com gestão inteligente de agenda e retenção de pacientes.',
    cardColor: '#489FB5',
    ctaFeatureSlug: 'agenda-inteligente',
    tKey: 'roi_general',
  },
  {
    slug: 'calculadora-no-show',
    icon: Clock,
    label: 'Custo de No-Show',
    description: 'Calcule quanto dinheiro sua clínica perde por mês com faltas sem aviso e veja o impacto real do recall automático.',
    cardColor: '#E05A4E',
    ctaFeatureSlug: 'recall-automatico',
    tKey: 'no_show',
  },
  {
    slug: 'calculadora-ltv',
    icon: Users,
    label: 'LTV do Cliente',
    description: 'Calcule o valor real de cada paciente ao longo do tempo e descubra quanto vale investir em retenção.',
    cardColor: '#C5A059',
    ctaFeatureSlug: 'recall-automatico',
    tKey: 'ltv',
  },
  {
    slug: 'calculadora-precificacao',
    icon: DollarSign,
    label: 'Precificação de Procedimento',
    description: 'Calcule o preço mínimo, sugerido e premium para seus procedimentos com base em custos reais e margem desejada.',
    cardColor: '#0A1F3D',
    ctaFeatureSlug: 'financeiro-tiss',
    tKey: 'pricing',
  },
  {
    slug: 'avaliacao-maturidade-digital',
    icon: Zap,
    label: 'Maturidade Digital',
    description: 'Quiz de 10 perguntas que avalia o nível digital da sua clínica e entrega recomendações personalizadas.',
    cardColor: '#489FB5',
    tKey: 'maturity',
  },
]
