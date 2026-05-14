import {
  Calendar,
  ClipboardList,
  FileText,
  Camera,
  MessageSquare,
  RefreshCw,
  Brain,
  Megaphone,
  BarChart3,
  Building2,
  Shield,
  Smartphone,
  CreditCard,
  Heart,
} from 'lucide-react'

export type FeatureItem = {
  slug: string
  sectionKey: string    // key in sections.{section}
  featureKey: string    // key in sections.{section}.{feature}
  icon: typeof Calendar
}

export type FeatureCategory = {
  menuKey: string       // key in nav.features_menu
  sections: {
    sectionKey: string  // key in sections.{section} and features.nav.{section}
    features: FeatureItem[]
  }[]
}

export const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    menuKey: 'atendimento_clinico',
    sections: [
      {
        sectionKey: 'atendimento',
        features: [
          { slug: 'agenda-inteligente',    sectionKey: 'atendimento', featureKey: 'agendaInteligente',    icon: Calendar },
          { slug: 'anamnese-digital',      sectionKey: 'atendimento', featureKey: 'anamneseDigital',      icon: ClipboardList },
          { slug: 'prontuario-eletronico', sectionKey: 'atendimento', featureKey: 'prontuarioEletronico', icon: FileText },
          { slug: 'evolucao-fotos',        sectionKey: 'atendimento', featureKey: 'evolucaoFotos',        icon: Camera },
        ],
      },
    ],
  },
  {
    menuKey: 'comunicacao_ia',
    sections: [
      {
        sectionKey: 'comunicacao',
        features: [
          { slug: 'whatsapp-business',  sectionKey: 'comunicacao', featureKey: 'whatsappBusiness', icon: MessageSquare },
          { slug: 'recall-automatico',  sectionKey: 'comunicacao', featureKey: 'recallAutomatico', icon: RefreshCw },
          { slug: 'estetia-ia',         sectionKey: 'comunicacao', featureKey: 'estetiaIa',         icon: Brain },
          { slug: 'marketing-clinico',  sectionKey: 'comunicacao', featureKey: 'marketingClinico',  icon: Megaphone },
        ],
      },
    ],
  },
  {
    menuKey: 'gestao_compliance',
    sections: [
      {
        sectionKey: 'gestao',
        features: [
          { slug: 'financeiro-tiss',   sectionKey: 'gestao', featureKey: 'financeiroTiss',  icon: CreditCard },
          { slug: 'analytics-pro',     sectionKey: 'gestao', featureKey: 'analyticsPro',    icon: BarChart3 },
          { slug: 'multi-unidade',     sectionKey: 'gestao', featureKey: 'multiUnidade',    icon: Building2 },
          { slug: 'lgpd-seguranca',    sectionKey: 'gestao', featureKey: 'lgpdSeguranca',   icon: Shield },
          { slug: 'mobile-app',        sectionKey: 'gestao', featureKey: 'mobileApp',       icon: Smartphone },
        ],
      },
    ],
  },
]

export const ALL_FEATURES = FEATURE_CATEGORIES.flatMap((cat) =>
  cat.sections.flatMap((sec) => sec.features)
)

export function getFeatureBySlug(slug: string): FeatureItem | undefined {
  return ALL_FEATURES.find((f) => f.slug === slug)
}
