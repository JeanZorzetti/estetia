'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  Search,
  Settings,
  Users,
  UserCheck,
  DoorOpen,
  Bell,
  Key,
  Webhook,
  Zap,
  BookOpen,
  Menu,
  X,
  RotateCw,
  Sun,
  Moon,
  LifeBuoy,
  Building2,
  FileText,
  Palette,
  Clock,
  Stethoscope,
  ShieldCheck,
  ClipboardList,
  CreditCard,
  Crown,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useAppBar } from '@/components/mobile/app-bar-context'

interface SettingsTab {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  badge?: string
  description: string
}

interface TabGroup {
  label: string
  tabs: SettingsTab[]
}

const tabGroups: TabGroup[] = [
  {
    label: 'Geral',
    tabs: [
      {
        id: 'general',
        label: 'Visão geral',
        icon: Settings,
        href: '/dashboard/settings',
        description: 'Hub principal',
      },
    ],
  },
  {
    label: 'Clínica',
    tabs: [
      {
        id: 'clinica-dados',
        label: 'Dados & Documentos',
        icon: FileText,
        href: '/dashboard/settings/clinica/dados',
        description: 'CNPJ, razão social, endereço',
      },
      {
        id: 'clinica-identidade',
        label: 'Identidade Visual',
        icon: Palette,
        href: '/dashboard/settings/clinica/identidade',
        description: 'Logo, cor e slogan',
      },
      {
        id: 'clinica-horarios',
        label: 'Horários',
        icon: Clock,
        href: '/dashboard/settings/clinica/horarios',
        description: 'Janela global da agenda',
      },
      {
        id: 'clinica-rt',
        label: 'Responsável Técnico',
        icon: Stethoscope,
        href: '/dashboard/settings/clinica/responsavel-tecnico',
        description: 'RT da clínica (Anvisa)',
      },
    ],
  },
  {
    label: 'Equipe & Acessos',
    tabs: [
      {
        id: 'team',
        label: 'Equipe Clínica',
        icon: Users,
        href: '/dashboard/settings/team',
        description: 'Membros e permissões',
      },
      {
        id: 'profissionais',
        label: 'Profissionais',
        icon: UserCheck,
        href: '/dashboard/settings/profissionais',
        description: 'Médicos e terapeutas',
      },
      {
        id: 'salas',
        label: 'Salas',
        icon: DoorOpen,
        href: '/dashboard/settings/salas',
        description: 'Salas e equipamentos',
      },
    ],
  },
  {
    label: 'Pacientes & Atendimento',
    tabs: [
      {
        id: 'round-robin',
        label: 'Distribuição',
        icon: RotateCw,
        href: '/dashboard/settings/round-robin',
        description: 'Rotação entre profissionais',
      },
    ],
  },
  {
    label: 'Comunicação',
    tabs: [
      {
        id: 'integrations',
        label: 'Integrações',
        icon: Zap,
        href: '/dashboard/settings/integrations',
        description: 'WhatsApp, Google, ERP',
      },
      {
        id: 'notifications',
        label: 'Notificações',
        icon: Bell,
        href: '/dashboard/settings/notifications',
        description: 'Preferências pessoais',
      },
    ],
  },
  {
    label: 'Compliance',
    tabs: [
      {
        id: 'lgpd',
        label: 'LGPD & Privacidade',
        icon: ShieldCheck,
        href: '/dashboard/settings/lgpd',
        description: 'DPO, retenção e direitos',
      },
      {
        id: 'consent-audit',
        label: 'Auditoria',
        icon: ClipboardList,
        href: '/dashboard/settings/lgpd/consent-audit',
        description: 'Consentimentos registrados',
      },
    ],
  },
  {
    label: 'Conta & Dev',
    tabs: [
      {
        id: 'billing',
        label: 'Plano & Faturamento',
        icon: CreditCard,
        href: '/dashboard/billing',
        description: 'Assinatura e notas',
      },
      {
        id: 'api',
        label: 'API Keys',
        icon: Key,
        href: '/dashboard/settings/api',
        description: 'Chaves de acesso',
      },
      {
        id: 'webhooks',
        label: 'Webhooks',
        icon: Webhook,
        href: '/dashboard/settings/webhooks',
        description: 'Notificações de eventos',
      },
    ],
  },
  {
    label: 'Suporte',
    tabs: [
      {
        id: 'help',
        label: 'Ajuda',
        icon: BookOpen,
        href: '/help',
        description: 'Central de ajuda',
      },
      {
        id: 'support',
        label: 'Suporte',
        icon: LifeBuoy,
        href: '/dashboard/support',
        description: 'Tickets e chat',
      },
    ],
  },
]

interface SettingsLayoutProps {
  children: React.ReactNode
  organizationName?: string
}

export function SettingsLayout({ children, organizationName }: SettingsLayoutProps) {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState('')
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'

  // Flatten all tabs for active detection and search
  const allTabs = useMemo(() => tabGroups.flatMap((g) => g.tabs), [])

  const filteredGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return tabGroups

    return tabGroups
      .map((group) => ({
        ...group,
        tabs: group.tabs.filter(
          (tab) =>
            tab.label.toLowerCase().includes(q) ||
            tab.description.toLowerCase().includes(q) ||
            group.label.toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.tabs.length > 0)
  }, [searchQuery])

  const activeTabId = useMemo(() => {
    // Find the most specific (longest matching) tab href
    const matches = allTabs.filter((tab) => {
      if (tab.href === '/dashboard/settings') {
        return pathname === '/dashboard/settings'
      }
      return pathname?.startsWith(tab.href)
    })
    if (matches.length === 0) return 'general'
    return matches.reduce((longest, current) =>
      current.href.length > longest.href.length ? current : longest
    ).id
  }, [pathname, allTabs])

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { setConfig } = useAppBar()

  useEffect(() => {
    const activeTab = allTabs.find((t) => t.id === activeTabId)
    setConfig({
      title: activeTab?.label ?? 'Configurações',
      showBack: activeTabId !== 'general',
    })
    return () => setConfig(null)
  }, [activeTabId, setConfig, allTabs])

  return (
    <div className="flex-1 flex h-full min-h-screen relative bg-slate-50 dark:bg-[#0B0F19] transition-colors duration-300 overflow-hidden">
      {/* TEXTURA DE MICRO-GRÃO FÍSICO */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.015] dark:opacity-[0.025] mix-blend-overlay z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* SUPER-HALOS ESTELARES DESFOCADOS PERIFÉRICOS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Superior Esquerdo - Azul Marinho Profundo */}
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 dark:bg-blue-600/15 blur-[120px] mix-blend-screen" />
        {/* Centro - Turquesa Cirúrgico */}
        <div className="absolute top-[30%] left-[25%] w-[45%] h-[45%] rounded-full bg-teal-500/5 dark:bg-teal-500/10 blur-[130px] mix-blend-screen" />
        {/* Direito - Ouro Imperial / Sofisticação */}
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-amber-500/10 dark:bg-[#C5A059]/15 blur-[140px] mix-blend-screen" />
      </div>

      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom)+0.75rem)] right-4 z-50">
        <Button
          size="icon"
          variant="default"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="h-12 w-12 rounded-full shadow-2xl bg-gradient-to-r from-[#9A7D42] to-[#C5A059] hover:from-[#866B35] hover:to-[#B48F47] text-white border border-[#C5A059]/30 transition-all duration-300"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Glassmorphic */}
      <aside
        className={cn(
          'w-66 border-r border-white/20 dark:border-white/[0.05] bg-white/40 dark:bg-[#0E1322]/55 backdrop-blur-2xl p-5 overflow-y-auto z-40 transition-all duration-300 md:relative md:inset-auto md:translate-x-0 flex flex-col',
          'fixed top-[var(--app-bar-height)] bottom-[calc(3.5rem+env(safe-area-inset-bottom))] left-0 md:h-[calc(100vh-var(--app-bar-height))]',
          sidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full'
        )}
      >
        {/* Header da Sidebar */}
        <div className="flex items-center gap-3 mb-6 group">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/10 to-[#C5A059]/20 text-[#9A7D42] dark:text-[#E2C799] border border-[#C5A059]/30 shadow-inner overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
            <Building2 className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-tight truncate">
                Configurações
              </h2>
              <Crown className="h-3 w-3 text-[#C5A059] shrink-0 animate-pulse" />
            </div>
            {organizationName && (
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate tracking-wide">
                {organizationName.toUpperCase()}
              </p>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
          <Input
            type="text"
            placeholder="Buscar configuração..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 h-9 text-xs rounded-xl bg-white/50 dark:bg-slate-900/50 border-white/40 dark:border-slate-800/40 text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-[#C5A059]/40 focus-visible:border-[#C5A059]/30 transition-all duration-300 shadow-sm"
          />
        </div>

        {/* Grouped Navigation */}
        <nav className="flex-1 space-y-6 overflow-y-auto pr-1 custom-scrollbar">
          {filteredGroups.map((group) => (
            <div key={group.label} className="space-y-1.5">
              <h3 className="px-2.5 text-[10px] font-bold uppercase tracking-widest text-[#9A7D42] dark:text-[#C5A059]/80 opacity-90">
                {group.label}
              </h3>
              <div className="space-y-0.5">
                {group.tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTabId === tab.id
                  const isExternal = tab.href.startsWith('/help')

                  const content = (
                    <div
                      className={cn(
                        'flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-300 group cursor-pointer relative overflow-hidden',
                        isActive
                          ? 'bg-gradient-to-r from-[#C5A059]/10 to-[#C5A059]/5 text-[#9A7D42] dark:text-[#E2C799] border-l-2 border-[#C5A059] font-semibold shadow-[0_2px_10px_rgba(197,160,89,0.05)]'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-100 border-l-2 border-transparent'
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-6 w-6 items-center justify-center rounded-lg transition-all duration-300',
                          isActive 
                            ? 'bg-[#C5A059]/20 text-[#9A7D42] dark:text-[#E2C799]' 
                            : 'bg-slate-100/50 dark:bg-slate-800/30 text-slate-400 dark:text-slate-500 group-hover:bg-white dark:group-hover:bg-slate-800 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                        )}
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0" />
                      </div>
                      <span className="text-xs font-medium truncate">{tab.label}</span>
                      {tab.badge && (
                        <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-[#C5A059] text-white border border-[#C5A059]/30">
                          {tab.badge}
                        </span>
                      )}
                    </div>
                  )

                  if (isExternal) {
                    return (
                      <a key={tab.id} href={tab.href} target="_blank" rel="noopener noreferrer" className="block">
                        {content}
                      </a>
                    )
                  }

                  return (
                    <Link key={tab.id} href={tab.href} onClick={() => setSidebarOpen(false)} className="block">
                      {content}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Empty state */}
        {searchQuery && filteredGroups.length === 0 && (
          <div className="text-center py-10 bg-white/20 dark:bg-slate-900/20 rounded-2xl border border-white/10 p-4 mb-auto">
            <Search className="h-6 w-6 text-slate-400/50 dark:text-slate-600/50 mx-auto mb-2 animate-bounce" />
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Nenhum resultado</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Tente termos mais simples</p>
          </div>
        )}

        {/* Theme Toggle Capsule */}
        <div className="mt-auto pt-4 border-t border-slate-200/50 dark:border-slate-800/40">
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 bg-white/60 dark:bg-[#0B0F19]/40 border border-white/40 dark:border-slate-800/30 hover:bg-[#C5A059]/10 dark:hover:bg-[#C5A059]/5 hover:text-[#9A7D42] dark:hover:text-[#E2C799] transition-all duration-300 hover:shadow-md"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100/80 dark:bg-slate-800/50 text-[#C5A059] shadow-inner">
                {isDark ? (
                  <Sun className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '8s' }} />
                ) : (
                  <Moon className="h-3.5 w-3.5 text-[#9A7D42]" />
                )}
              </div>
              <span className="font-medium">{isDark ? 'Modo Claro' : 'Modo Escuro'}</span>
            </div>
            <div className="w-6 h-3 rounded-full bg-slate-200 dark:bg-slate-800 relative transition-colors duration-300">
              <div 
                className={cn(
                  "absolute top-0.5 w-2 h-2 rounded-full transition-all duration-300 bg-[#C5A059]",
                  isDark ? "left-3.5 bg-yellow-400" : "left-0.5 bg-[#9A7D42]"
                )}
              />
            </div>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto z-20 relative max-h-screen">
        {children}
      </main>
    </div>
  )
}
