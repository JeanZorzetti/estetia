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
    <div className="flex-1 flex h-full relative">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom)+0.75rem)] right-4 z-50">
        <Button
          size="icon"
          variant="default"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="h-12 w-12 rounded-full shadow-lg"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'w-64 border-r border-border/60 bg-card/50 backdrop-blur-xl p-5 overflow-y-auto',
          'fixed top-[var(--app-bar-height)] bottom-[calc(3.5rem+env(safe-area-inset-bottom))] left-0 z-40 transition-transform duration-200 md:relative md:inset-auto md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-border/40">
            <Building2 className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-foreground truncate">Configurações</h2>
            {organizationName && (
              <p className="text-[10px] text-muted-foreground truncate">{organizationName}</p>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>

        {/* Grouped Navigation */}
        <nav className="space-y-5">
          {filteredGroups.map((group) => (
            <div key={group.label} className="space-y-1">
              <h3 className="px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                {group.label}
              </h3>
              {group.tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTabId === tab.id
                const isExternal = tab.href.startsWith('/help')

                const content = (
                  <div
                    className={cn(
                      'flex items-center gap-2.5 px-2 py-1.5 rounded-md transition-colors duration-150 group cursor-pointer',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-4 w-4 shrink-0 transition-colors',
                        isActive ? 'text-primary' : 'text-muted-foreground/70 group-hover:text-foreground'
                      )}
                    />
                    <span className="text-xs font-medium truncate">{tab.label}</span>
                    {tab.badge && (
                      <span className="ml-auto text-[9px] font-semibold px-1.5 py-0.5 rounded bg-primary/10 text-primary ring-1 ring-primary/20">
                        {tab.badge}
                      </span>
                    )}
                  </div>
                )

                if (isExternal) {
                  return (
                    <a key={tab.id} href={tab.href} target="_blank" rel="noopener noreferrer">
                      {content}
                    </a>
                  )
                }

                return (
                  <Link key={tab.id} href={tab.href} onClick={() => setSidebarOpen(false)}>
                    {content}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Empty state */}
        {searchQuery && filteredGroups.length === 0 && (
          <div className="text-center py-8">
            <Search className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Nenhum resultado</p>
          </div>
        )}

        {/* Theme Toggle */}
        <div className="mt-6 pt-4 border-t border-border/50">
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="flex items-center gap-2.5 w-full px-2 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-muted-foreground/70" />
            ) : (
              <Moon className="h-4 w-4 text-muted-foreground/70" />
            )}
            <span>{isDark ? 'Modo claro' : 'Modo escuro'}</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
