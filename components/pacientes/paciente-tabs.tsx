'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, FileText, ClipboardList, Calendar, Camera, Shield } from 'lucide-react'

interface PacienteTabsProps {
  patientId: string
}

const TABS = [
  { label: 'Visão Geral', href: (id: string) => `/dashboard/pacientes/${id}`, exact: true, icon: LayoutDashboard },
  { label: 'Prontuário', href: (id: string) => `/dashboard/pacientes/${id}/prontuario`, exact: false, icon: FileText },
  { label: 'Anamnese', href: (id: string) => `/dashboard/pacientes/${id}/anamnese`, exact: false, icon: ClipboardList },
  { label: 'Tratamentos', href: (id: string) => `/dashboard/pacientes/${id}/tratamentos`, exact: false, icon: Calendar },
  { label: 'Fotos', href: (id: string) => `/dashboard/pacientes/${id}/fotos`, exact: false, icon: Camera },
  { label: 'Consentimentos', href: (id: string) => `/dashboard/pacientes/${id}/consentimentos`, exact: false, icon: Shield },
]

export function PacienteTabs({ patientId }: PacienteTabsProps) {
  const pathname = usePathname()

  return (
    <div className="bg-muted/20 dark:bg-zinc-900/40 p-1 rounded-2xl border border-border/40 flex flex-wrap gap-1 w-fit max-w-full shadow-inner backdrop-blur-md relative z-10">
      {TABS.map(tab => {
        const href = tab.href(patientId)
        const cleanPath = pathname.replace(/^\/(en|pt-BR)/, '')
        const isActive = tab.exact
          ? cleanPath === href
          : cleanPath.startsWith(href)

        return (
          <Link
            key={tab.label}
            href={href}
            className={cn(
              'rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 border border-transparent shadow-sm flex items-center gap-1.5 cursor-pointer',
              isActive
                ? 'bg-navy text-white dark:bg-navy-500/20 dark:text-navy-200 border-navy-500/20'
                : 'text-muted-foreground hover:text-navy dark:hover:text-navy-200'
            )}
          >
            <tab.icon className="h-3.5 w-3.5 shrink-0" />
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
