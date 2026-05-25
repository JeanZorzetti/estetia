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
  Crown,
  Sparkles,
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
            href: '/dashboard/settings/anamnese',
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
              <Badge variant="outline" className="text-[9px] font-bold px-1.5 py-0 h-4 border-[#C5A059]/30 bg-[#C5A059]/10 text-[#9A7D42] dark:text-[#E2C799] uppercase tracking-wide">
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
                <Badge variant="outline" className="text-[9px] font-bold px-1.5 py-0 h-4 border-[#C5A059]/30 bg-[#C5A059]/10 text-[#9A7D42] dark:text-[#E2C799] uppercase tracking-wide">
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
    <div className="px-4 py-6 md:p-10 md:pt-8 space-y-10 max-w-6xl mx-auto">
      {/* Cabeçalho Monumental em Serif Clássico com Badge de Luxo */}
      <div className="flex flex-wrap items-start justify-between gap-6 pb-6 border-b border-slate-200/40 dark:border-slate-800/40 relative">
        <div className="flex-1 min-w-0 space-y-3">
          {/* Badge Real de Acento */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider text-[#9A7D42] dark:text-[#E2C799] bg-[#C5A059]/10 border border-[#C5A059]/30 uppercase select-none shadow-sm">
            <Crown className="h-3.5 w-3.5 text-[#C5A059] animate-pulse" />
            <span>Central de Gestão & Configurações VIP</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-serif text-3xl md:text-4xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
              Configurações
              <Sparkles className="h-5 w-5 text-[#C5A059] shrink-0 opacity-80" />
            </h1>
            
            {user.organization && (
              <Badge variant="outline" className="font-semibold text-xs border-[#C5A059]/30 bg-[#C5A059]/5 text-[#9A7D42] dark:text-[#E2C799] px-2.5 py-0.5 rounded-lg shadow-sm">
                {user.organization.name}
              </Badge>
            )}
            
            {user.organization?.tier && user.organization.tier !== 'FREE' && (
              <Badge className="bg-gradient-to-r from-[#9A7D42] via-[#C5A059] to-[#D4AF37] text-white border-0 px-2.5 py-0.5 rounded-lg font-bold text-xs shadow-md tracking-wide">
                {user.organization.tier.toUpperCase()}
              </Badge>
            )}
          </div>
          
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Configure a engrenagem interna da sua clínica. Gerencie dados operacionais, integre ferramentas externas, garanta a segurança jurídica da LGPD e personalize a jornada da sua equipe e pacientes com acabamento nobre.
          </p>
        </div>

        <div className="shrink-0 pt-1.5">
          <HubSearchBar value={query} onChange={setQuery} />
        </div>
      </div>

      {/* Grid de Seções */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/40 dark:border-white/[0.02] bg-white/30 dark:bg-slate-900/30 backdrop-blur-xl py-20 text-center shadow-lg relative overflow-hidden">
          <div className="absolute inset-[1px] rounded-[15px] border border-white/20 dark:border-white/[0.01] pointer-events-none" />
          <div className="max-w-md mx-auto space-y-3 px-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 dark:text-slate-500 shadow-inner">
              <Sparkles className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Nenhuma configuração encontrada</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              O termo digitado não corresponde a nenhuma clínica, membro, LGPD ou integração. Tente ajustar o termo de busca para localizar sua central VIP.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
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
                        <button type="button" className="text-left w-full h-full block focus-visible:outline-none">
                          <SettingsCard
                            icon={card.icon}
                            iconColor={card.iconColor}
                            iconBg={card.iconBg}
                            title={card.title}
                            description={card.description}
                            badge={card.badge}
                          />
                        </button>
                      </SheetTrigger>
                      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-2xl border-l border-white/20 dark:border-slate-800/40 p-6 shadow-2xl">
                        <SheetHeader className="pb-5 border-b border-slate-200/50 dark:border-slate-800/40">
                          <div className="flex items-center gap-2 mb-1">
                            <Crown className="h-4.5 w-4.5 text-[#C5A059]" />
                            <SheetTitle className="font-serif text-xl font-bold text-slate-800 dark:text-slate-100">
                              Meu Perfil
                            </SheetTitle>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Atualize seus dados pessoais e informações de acesso
                          </p>
                        </SheetHeader>
                        <div className="mt-8 relative">
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
