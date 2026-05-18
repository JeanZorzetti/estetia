'use client'

import { useState } from 'react'
import Link from 'next/link'
import * as LucideIcons from 'lucide-react'
import { Lock, Sparkles, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ModuleUpgradeModal } from '@/components/upgrade/module-upgrade-modal'
import { cn } from '@/lib/utils'

type Props = {
  slug: string
  nome: string
  descricao: string
  features: string[]
  priceCents: number
  iconLucide: string
  category: string
}

export function ModuleLockedScreen(props: Props) {
  const [open, setOpen] = useState(false)

  const Icon =
    (LucideIcons as any)[props.iconLucide]
      ? ((LucideIcons as any)[props.iconLucide] as React.ComponentType<{ className?: string }>)
      : Sparkles

  const price = (props.priceCents / 100).toFixed(2).replace('.', ',')

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8 min-h-[80vh]">
      <div className="w-full max-w-xl">
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card">
          {/* Ambient glow */}
          <div className="pointer-events-none absolute -top-32 -right-24 h-64 w-64 rounded-full bg-[#c5a059]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-64 w-64 rounded-full bg-[#0a1f3d]/8 dark:bg-[#489fb5]/10 blur-3xl" />

          <div className="relative px-6 sm:px-8 pt-8 pb-6">
            <div className="flex items-center justify-between mb-6">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <Lock className="h-3 w-3" />
                Módulo bloqueado
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {props.category}
              </span>
            </div>

            <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#0a1f3d] dark:bg-[#c5a059]/15 ring-1 ring-inset ring-white/10 mb-4">
              <Icon className="h-6 w-6 text-white dark:text-[#c5a059]" />
            </div>

            <h1 className="font-display text-3xl sm:text-4xl tracking-tighter font-bold text-foreground leading-[1.05]">
              {props.nome}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md">
              {props.descricao}
            </p>
          </div>

          <div className="relative px-6 sm:px-8 pb-2">
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {props.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-foreground/85">
                  <Check
                    className="h-3.5 w-3.5 mt-1 flex-shrink-0 text-[#0a1f3d] dark:text-[#c5a059]"
                    strokeWidth={3}
                  />
                  <span className="leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mt-6 px-6 sm:px-8 py-5 border-t border-border/50 bg-muted/30">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Acréscimo mensal
                </p>
                <p className="mt-1 font-display tracking-tight">
                  <span className="text-sm text-muted-foreground">+R$ </span>
                  <span className="text-3xl font-bold text-foreground">{price}</span>
                  <span className="text-sm text-muted-foreground">/mês</span>
                </p>
              </div>

              <Button
                onClick={() => setOpen(true)}
                className={cn(
                  'group h-11 px-5 bg-[#0a1f3d] hover:bg-[#0a1f3d]/90 text-white',
                  'dark:bg-[#c5a059] dark:hover:bg-[#c5a059]/90 dark:text-[#0a1f3d]',
                )}
              >
                Adicionar agora
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Prefere ajustar todo o plano?{' '}
          <Link
            href="/dashboard/billing/plans"
            className="text-foreground/80 underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Ver todos os módulos
          </Link>
        </p>

        <ModuleUpgradeModal open={open} onOpenChange={setOpen} slug={props.slug} />
      </div>
    </div>
  )
}
