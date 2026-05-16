'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAppBar } from '@/components/mobile/app-bar-context'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ProfileForm } from '@/components/settings/profile-form'
import { SettingsSection } from '@/components/settings/settings-section'
import { SettingsCard } from '@/components/settings/settings-card'
import { HubSearchBar } from '@/components/settings/hub-search-bar'
import {
  Building2,
  FileText,
  Palette,
  Clock,
  Stethoscope,
  Users,
  UserCheck,
  DoorOpen,
  RotateCw,
  Gift,
  Bell,
  ClipboardList,
  Zap,
  Mail,
  ShieldCheck,
  CreditCard,
  Key,
  Webhook,
  User as UserIcon,
  BookOpen,
  type LucideIcon,
} from 'lucide-react'

interface SettingsClientProps {
  user: {
    name: string | null
    email: string
    organization: {
      name: string
      tier: string
    } | null
  }
}

interface CardDef {
  href?: string
  external?: boolean
  drawer?: 'profile'
  icon: LucideIcon
  iconColor: string
  iconBg: string
  title: string
  description: string
  badge?: React.ReactNode
}

interface SectionDef {
  label: string
  description?: string
  icon: LucideIcon
  iconColor: string
  iconBg: string
  cards: CardDef[]
}

export function SettingsClient({ user }: SettingsClientProps) {
  const { setConfig } = useAppBar()
  const [query, setQuery] = useState('')

  useEffect(() => {
    setConfig({ title: 'Configurações' })
    return () => setConfig(null)
  }, [setConfig])

  const sections: SectionDef[] = useMemo(
    () => [
      {
        label: 'Clínica',
        description: 'Dados jurídicos, identidade e operação da sua clínica',
        icon: Building2,
        iconColor: 'text-teal-500',
        iconBg: 'bg-teal-500/10',
        cards: [
          {
            href: '/dashboard/settings/clinica/dados',
            icon: FileText,
            iconColor: 'text-teal-500',
            iconBg: 'bg-teal-500/10',
            title: 'Dados & Documentos',
            description: 'CNPJ, razão social, endereço',
          },
          {
            href: '/dashboard/settings/clinica/identidade',
            icon: Palette,
            iconColor: 'text-teal-500',
            iconBg: 'bg-teal-500/10',
            title: 'Identidade Visual',
            description: 'Logo, cor da marca e slogan',
          },
          {
            href: '/dashboard/settings/clinica/horarios',
            icon: Clock,
            iconColor: 'text-teal-500',
            iconBg: 'bg-teal-500/10',
            title: 'Horários de Funcionamento',
            description: 'Janela global de agendamento',
          },
          {
            href: '/dashboard/settings/clinica/responsavel-tecnico',
            icon: Stethoscope,
            iconColor: 'text-teal-500',
            iconBg: 'bg-teal-500/10',
            title: 'Responsável Técnico',
            description: 'RT clínico-administrativo (Anvisa)',
          },
        ],
      },
      {
        label: 'Equipe & Acessos',
        description: 'Gerencie quem trabalha na sua clínica',
        icon: Users,
        iconColor: 'text-emerald-500',
        iconBg: 'bg-emerald-500/10',
        cards: [
          {
            href: '/dashboard/settings/team',
            icon: Users,
            iconColor: 'text-emerald-500',
            iconBg: 'bg-emerald-500/10',
            title: 'Equipe Clínica',
            description: 'Membros, convites e permissões',
          },
          {
            href: '/dashboard/settings/profissionais',
            icon: UserCheck,
            iconColor: 'text-emerald-500',
            iconBg: 'bg-emerald-500/10',
            title: 'Profissionais',
            description: 'Cadastro de médicos e terapeutas',
          },
          {
            href: '/dashboard/settings/salas',
            icon: DoorOpen,
            iconColor: 'text-emerald-500',
            iconBg: 'bg-emerald-500/10',
            title: 'Salas',
            description: 'Salas e equipamentos',
          },
        ],
      },
      {
        label: 'Pacientes & Atendimento',
        description: 'Fluxos automáticos e templates clínicos',
        icon: Stethoscope,
        iconColor: 'text-blue-500',
        iconBg: 'bg-blue-500/10',
        cards: [
          {
            href: '/dashboard/settings/round-robin',
            icon: RotateCw,
            iconColor: 'text-blue-500',
            iconBg: 'bg-blue-500/10',
            title: 'Distribuição de Atendimentos',
            description: 'Rotação automática entre profissionais',
          },
          {
            href: '/dashboard/loyalty',
            icon: Gift,
            iconColor: 'text-blue-500',
            iconBg: 'bg-blue-500/10',
            title: 'Programa de Fidelidade',
            description: 'Pontos, regras e resgates',
          },
          {
            href: '/dashboard/recall',
            icon: Bell,
            iconColor: 'text-blue-500',
            iconBg: 'bg-blue-500/10',
            title: 'Recall Automático',
            description: 'Lembretes de retorno',
          },
          {
            href: '/dashboard/anamnese',
            icon: ClipboardList,
            iconColor: 'text-blue-500',
            iconBg: 'bg-blue-500/10',
            title: 'Templates de Anamnese',
            description: 'Modelos por procedimento',
          },
        ],
      },
      {
        label: 'Comunicação & Automação',
        description: 'Integrações com canais externos',
        icon: Zap,
        iconColor: 'text-amber-500',
        iconBg: 'bg-amber-500/10',
        cards: [
          {
            href: '/dashboard/settings/integrations',
            icon: Zap,
            iconColor: 'text-amber-500',
            iconBg: 'bg-amber-500/10',
            title: 'Integrações',
            description: 'WhatsApp, Instagram, Google, ERP',
            badge: (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                Marketplace
              </Badge>
            ),
          },
          {
            href: '/dashboard/settings/notifications',
            icon: Mail,
            iconColor: 'text-amber-500',
            iconBg: 'bg-amber-500/10',
            title: 'Notificações Pessoais',
            description: 'Suas preferências de notificação',
          },
        ],
      },
      {
        label: 'Compliance & LGPD',
        description: 'Privacidade, retenção e auditoria',
        icon: ShieldCheck,
        iconColor: 'text-red-500',
        iconBg: 'bg-red-500/10',
        cards: [
          {
            href: '/dashboard/settings/lgpd',
            icon: ShieldCheck,
            iconColor: 'text-red-500',
            iconBg: 'bg-red-500/10',
            title: 'LGPD & Privacidade',
            description: 'DPO, retenção e direitos dos titulares',
          },
          {
            href: '/dashboard/settings/lgpd/consent-audit',
            icon: ClipboardList,
            iconColor: 'text-red-500',
            iconBg: 'bg-red-500/10',
            title: 'Auditoria de Consentimentos',
            description: 'Histórico completo de consentimentos',
          },
        ],
      },
      {
        label: 'Conta & Billing',
        description: 'Sua conta, plano e recursos para desenvolvedores',
        icon: CreditCard,
        iconColor: 'text-purple-500',
        iconBg: 'bg-purple-500/10',
        cards: [
          {
            drawer: 'profile',
            icon: UserIcon,
            iconColor: 'text-purple-500',
            iconBg: 'bg-purple-500/10',
            title: 'Meu Perfil',
            description: 'Nome, e-mail e dados pessoais',
          },
          {
            href: '/dashboard/billing',
            icon: CreditCard,
            iconColor: 'text-purple-500',
            iconBg: 'bg-purple-500/10',
            title: 'Plano & Faturamento',
            description: 'Assinatura, pagamentos e notas',
            badge:
              user.organization?.tier && user.organization.tier !== 'FREE' ? (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                  {user.organization.tier}
                </Badge>
              ) : undefined,
          },
          {
            href: '/dashboard/settings/api',
            icon: Key,
            iconColor: 'text-purple-500',
            iconBg: 'bg-purple-500/10',
            title: 'API Keys',
            description: 'Chaves de acesso programático',
          },
          {
            href: '/dashboard/settings/webhooks',
            icon: Webhook,
            iconColor: 'text-purple-500',
            iconBg: 'bg-purple-500/10',
            title: 'Webhooks',
            description: 'Notificações para sistemas externos',
          },
          {
            href: '/help',
            external: true,
            icon: BookOpen,
            iconColor: 'text-purple-500',
            iconBg: 'bg-purple-500/10',
            title: 'Ajuda & Suporte',
            description: 'Central de ajuda e tutoriais',
          },
        ],
      },
    ],
    [user.organization?.tier]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return sections

    return sections
      .map((section) => ({
        ...section,
        cards: section.cards.filter(
          (c) =>
            c.title.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q) ||
            section.label.toLowerCase().includes(q)
        ),
      }))
      .filter((section) => section.cards.length > 0)
  }, [sections, query])

  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <div className="px-4 py-4 md:p-8 md:pt-6 space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Configurações
            </h1>
            {user.organization && (
              <Badge variant="outline" className="font-normal">
                {user.organization.name}
              </Badge>
            )}
            {user.organization?.tier && user.organization.tier !== 'FREE' && (
              <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
                {user.organization.tier}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Tudo que sua clínica precisa para operar com excelência
          </p>
        </div>

        <HubSearchBar value={query} onChange={setQuery} />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-border/50 bg-muted/20 py-16 text-center">
          <p className="text-sm text-muted-foreground">Nenhuma configuração encontrada</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Tente outro termo de busca</p>
        </div>
      ) : (
        <div className="space-y-8">
          {filtered.map((section) => (
            <SettingsSection
              key={section.label}
              label={section.label}
              description={section.description}
              icon={section.icon}
              iconColor={section.iconColor}
              iconBg={section.iconBg}
            >
              {section.cards.map((card) => {
                if (card.drawer === 'profile') {
                  return (
                    <Sheet key={card.title} open={profileOpen} onOpenChange={setProfileOpen}>
                      <SheetTrigger asChild>
                        <button type="button" className="text-left">
                          <div
                            className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 h-full transition-all duration-200 ease-out hover:border-primary/40 hover:shadow-sm hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          >
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ring-1 ring-border/40 ${card.iconBg} ${card.iconColor}`}>
                              <card.icon className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="text-sm font-semibold tracking-tight text-foreground truncate">
                                {card.title}
                              </h3>
                              <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                                {card.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      </SheetTrigger>
                      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                        <SheetHeader>
                          <SheetTitle>Meu Perfil</SheetTitle>
                        </SheetHeader>
                        <div className="mt-6">
                          <ProfileForm
                            initialData={{
                              name: user.name ?? '',
                              email: user.email,
                              organizationName: user.organization?.name ?? '',
                            }}
                          />
                        </div>
                      </SheetContent>
                    </Sheet>
                  )
                }

                return (
                  <SettingsCard
                    key={card.title}
                    href={card.href}
                    external={card.external}
                    icon={card.icon}
                    iconColor={card.iconColor}
                    iconBg={card.iconBg}
                    title={card.title}
                    description={card.description}
                    badge={card.badge}
                  />
                )
              })}
            </SettingsSection>
          ))}
        </div>
      )}
    </div>
  )
}
