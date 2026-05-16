import {
  Workflow,
  MessageSquare,
  Calendar,
  BarChart3,
  Share2,
  Database,
  Instagram,
  Mail,
  Webhook,
  Phone,
  ShieldCheck,
  Smartphone,
  type LucideIcon,
} from 'lucide-react'

export type IntegrationCategory =
  | 'mensageria'
  | 'agenda'
  | 'anuncios'
  | 'operacoes'
  | 'webhooks'
  | 'validacoes'

export interface IntegrationMeta {
  id: string
  name: string
  shortDescription: string
  category: IntegrationCategory
  icon: LucideIcon
  iconBg: string
  iconColor: string
  href: string
  requiresTier?: 'BUSINESS' | 'PRO'
  selfHostable?: boolean
  docsUrl?: string
  status?: 'stable' | 'beta' | 'maintenance' | 'soon'
  costNote?: string
}

export const CATEGORIES: { id: IntegrationCategory | 'todas'; label: string }[] = [
  { id: 'todas', label: 'Todas' },
  { id: 'mensageria', label: 'Mensageria' },
  { id: 'agenda', label: 'Agenda & E-mail' },
  { id: 'anuncios', label: 'Anúncios' },
  { id: 'operacoes', label: 'Operações' },
  { id: 'webhooks', label: 'Webhooks' },
  { id: 'validacoes', label: 'Validações' },
]

export const INTEGRATIONS: IntegrationMeta[] = [
  // Mensageria
  {
    id: 'whatsapp-oficial',
    name: 'WhatsApp Oficial',
    shortDescription: 'API Cloud da Meta — produção em larga escala',
    category: 'mensageria',
    icon: MessageSquare,
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
    href: '/dashboard/settings/integrations/whatsapp-official',
    requiresTier: 'BUSINESS',
    docsUrl: 'https://developers.facebook.com/docs/whatsapp/cloud-api',
    costNote: 'Cobrança por conversa pela Meta',
  },
  {
    id: 'whatsapp-evolution',
    name: 'WhatsApp Evolution',
    shortDescription: 'API self-hosted — você hospeda sua instância',
    category: 'mensageria',
    icon: Smartphone,
    iconBg: 'bg-green-500/10',
    iconColor: 'text-green-600',
    href: '/dashboard/settings/integrations/whatsapp-evolution',
    selfHostable: true,
    docsUrl: 'https://doc.evolution-api.com/',
    costNote: 'Hospedagem própria (VPS) — grátis',
  },
  {
    id: 'whatsapp-zapi',
    name: 'WhatsApp Z-API',
    shortDescription: 'Provider brasileiro pago — fácil setup',
    category: 'mensageria',
    icon: Smartphone,
    iconBg: 'bg-teal-500/10',
    iconColor: 'text-teal-500',
    href: '/dashboard/settings/integrations/whatsapp-zapi',
    docsUrl: 'https://developer.z-api.io/',
    costNote: '~R$ 99/mês com Z-API',
  },
  {
    id: 'instagram-dm',
    name: 'Instagram Direct',
    shortDescription: 'Receba DMs no Chat Center',
    category: 'mensageria',
    icon: Instagram,
    iconBg: 'bg-pink-500/10',
    iconColor: 'text-pink-500',
    href: '/dashboard/settings/integrations/instagram-dm',
    docsUrl: 'https://developers.facebook.com/docs/messenger-platform/instagram',
  },

  // Agenda & E-mail
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    shortDescription: 'Sincronize agendamentos com sua agenda Google',
    category: 'agenda',
    icon: Calendar,
    iconBg: 'bg-red-500/10',
    iconColor: 'text-red-500',
    href: '/dashboard/settings/integrations/google-calendar',
  },
  {
    id: 'smtp',
    name: 'E-mail (SMTP)',
    shortDescription: 'Envie e-mails do seu próprio domínio',
    category: 'agenda',
    icon: Mail,
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
    href: '/dashboard/settings/integrations/smtp',
    costNote: 'Gmail, Outlook, SendGrid, Resend...',
  },

  // Anúncios
  {
    id: 'google-ads',
    name: 'Google Ads',
    shortDescription: 'CAC real e ROI de campanhas',
    category: 'anuncios',
    icon: BarChart3,
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
    href: '/dashboard/settings/integrations/google-ads',
  },
  {
    id: 'facebook-ads',
    name: 'Meta Ads',
    shortDescription: 'Facebook e Instagram Ads — atribuição de leads',
    category: 'anuncios',
    icon: Share2,
    iconBg: 'bg-blue-600/10',
    iconColor: 'text-blue-600',
    href: '/dashboard/settings/integrations/facebook-ads',
  },
  {
    id: 'instagram-posts',
    name: 'Instagram (Posts)',
    shortDescription: 'Agendador de publicações automáticas',
    category: 'anuncios',
    icon: Instagram,
    iconBg: 'bg-fuchsia-500/10',
    iconColor: 'text-fuchsia-500',
    href: '/dashboard/settings/integrations/instagram',
  },

  // Operações
  {
    id: 'omie',
    name: 'Omie ERP',
    shortDescription: 'Sincronize clientes, pedidos e financeiro',
    category: 'operacoes',
    icon: Database,
    iconBg: 'bg-orange-500/10',
    iconColor: 'text-orange-500',
    href: '/dashboard/settings/integrations/omie',
    docsUrl: 'https://app.omie.com.br/api/v1/',
  },

  // Webhooks
  {
    id: 'n8n',
    name: 'N8N',
    shortDescription: 'Automação de workflows visuais',
    category: 'webhooks',
    icon: Workflow,
    iconBg: 'bg-indigo-500/10',
    iconColor: 'text-indigo-500',
    href: '/dashboard/settings/integrations/n8n',
    docsUrl: 'https://docs.n8n.io/',
  },
  {
    id: 'webhook-generic',
    name: 'Webhooks (Zapier/Make)',
    shortDescription: 'Integre com qualquer ferramenta via webhook',
    category: 'webhooks',
    icon: Webhook,
    iconBg: 'bg-violet-500/10',
    iconColor: 'text-violet-500',
    href: '/dashboard/settings/integrations/webhook-generic',
  },
  {
    id: 'pabx',
    name: 'Telefonia / PABX',
    shortDescription: 'Intelbras, Yealink, Asterisk e PABX genéricos',
    category: 'webhooks',
    icon: Phone,
    iconBg: 'bg-cyan-500/10',
    iconColor: 'text-cyan-500',
    href: '/dashboard/settings/integrations/pabx',
    costNote: 'Sua infraestrutura',
  },

  // Validações
  {
    id: 'cfm-validator',
    name: 'CFM / Conselhos',
    shortDescription: 'Valide automaticamente CRM, CRO e demais',
    category: 'validacoes',
    icon: ShieldCheck,
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
    href: '/dashboard/settings/team',
  },
]
