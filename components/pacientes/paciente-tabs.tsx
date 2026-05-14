'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface PacienteTabsProps {
  patientId: string
}

const TABS = [
  { label: 'Visão Geral', href: (id: string) => `/dashboard/pacientes/${id}`, exact: true },
  { label: 'Prontuário', href: (id: string) => `/dashboard/pacientes/${id}/prontuario`, exact: false },
  { label: 'Anamneses', href: (id: string) => `/dashboard/pacientes/${id}/anamnese`, exact: false },
  { label: 'Tratamentos', href: (id: string) => `/dashboard/pacientes/${id}/tratamentos`, exact: false },
  { label: 'Fotos', href: (id: string) => `/dashboard/pacientes/${id}/fotos`, exact: false },
]

export function PacienteTabs({ patientId }: PacienteTabsProps) {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-1 border-b border-border overflow-x-auto">
      {TABS.map(tab => {
        const href = tab.href(patientId)
        // Strip locale prefix for matching
        const cleanPath = pathname.replace(/^\/(en|pt-BR)/, '')
        const isActive = tab.exact
          ? cleanPath === href
          : cleanPath.startsWith(href)

        return (
          <Link
            key={tab.label}
            href={href}
            className={cn(
              'px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors',
              isActive
                ? 'border-[#489FB5] text-[#489FB5]'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
