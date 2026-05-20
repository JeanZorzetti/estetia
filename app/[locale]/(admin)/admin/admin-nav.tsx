'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Users,
    Building2,
    BarChart3,
    Smartphone,
    Search,
    TrendingUp,
    Network,
    Activity,
    LifeBuoy,
    Stethoscope,
    Scale,
    DollarSign,
    ClipboardList,
    Heart,
    Server,
    ChevronDown,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type NavItem = {
    href: string
    label: string
    icon: React.ElementType
}

type NavGroup = {
    label: string
    items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
    {
        label: "Plataforma",
        items: [
            { href: "/admin", label: "Overview", icon: LayoutDashboard },
            { href: "/admin/users", label: "Usuários", icon: Users },
            { href: "/admin/organizations", label: "Organizações", icon: Building2 },
            { href: "/admin/clinics", label: "Clínicas", icon: Stethoscope },
        ],
    },
    {
        label: "Compliance",
        items: [
            { href: "/admin/access-logs", label: "Logs de Acesso", icon: Activity },
            { href: "/admin/lgpd", label: "Solicitações LGPD", icon: Scale },
            { href: "/admin/cfm-moderation", label: "Moderação CFM", icon: ClipboardList },
        ],
    },
    {
        label: "Financeiro",
        items: [
            { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
            { href: "/admin/revenue", label: "MRR / Churn", icon: DollarSign },
            { href: "/admin/operadoras", label: "Operadoras", icon: Heart },
        ],
    },
    {
        label: "Marketing",
        items: [
            { href: "/admin/seo", label: "SEO", icon: Search },
            { href: "/admin/funnel", label: "Funil", icon: TrendingUp },
            { href: "/admin/knowledge-graph", label: "Knowledge Graph", icon: Network },
            { href: "/admin/pwa-metrics", label: "PWA Metrics", icon: Smartphone },
        ],
    },
    {
        label: "Operações",
        items: [
            { href: "/admin/support", label: "Tickets", icon: LifeBuoy },
            { href: "/admin/feature-adoption", label: "Adoção Features", icon: BarChart3 },
            { href: "/admin/system-health", label: "Saúde do Sistema", icon: Server },
        ],
    },
]

function NavGroupDropdown({ group, pathname }: { group: NavGroup; pathname: string }) {
    const isActive = group.items.some((item) => {
        if (item.href === "/admin") return pathname === "/admin"
        return pathname.startsWith(item.href)
    })

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className={cn(
                    "flex items-center gap-1 text-sm font-medium transition-colors px-2 py-1 rounded-md",
                    isActive
                        ? "text-amber-400"
                        : "text-slate-400 hover:text-slate-100"
                )}
            >
                {group.label}
                <ChevronDown className="h-3 w-3 opacity-60" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="start"
                className="bg-slate-900 border-slate-800 text-slate-200 min-w-[180px]"
            >
                {group.items.map((item) => {
                    const isItemActive =
                        item.href === "/admin"
                            ? pathname === "/admin"
                            : pathname.startsWith(item.href)
                    const Icon = item.icon
                    return (
                        <DropdownMenuItem key={item.href} asChild>
                            <Link
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2 cursor-pointer",
                                    isItemActive
                                        ? "text-amber-400 bg-amber-400/10"
                                        : "hover:text-white"
                                )}
                            >
                                <Icon className="h-3.5 w-3.5 opacity-70" />
                                {item.label}
                            </Link>
                        </DropdownMenuItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export function AdminNav() {
    const pathname = usePathname()

    return (
        <nav className="ml-8 flex items-center gap-1">
            {NAV_GROUPS.map((group) => (
                <NavGroupDropdown key={group.label} group={group} pathname={pathname} />
            ))}
        </nav>
    )
}
