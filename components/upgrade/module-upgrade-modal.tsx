'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import * as LucideIcons from 'lucide-react'
import { Check, Loader2, Lock, Sparkles, ArrowRight, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ModuleData = {
  slug: string
  nome: string
  descricao: string
  features: string[]
  priceCents: number
  iconLucide: string
  category: string
}

export function ModuleUpgradeModal({
  open,
  onOpenChange,
  slug,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  slug: string | null
}) {
  const [data, setData] = useState<ModuleData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<{ invoiceUrl?: string; proration?: number } | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    if (!open || !slug) {
      setData(null)
      setError(null)
      setDone(null)
      return
    }
    setLoading(true)
    fetch(`/api/pricing/modules?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((res) => {
        if (res?.module) setData(res.module)
        else setError('Módulo não encontrado')
      })
      .catch(() => setError('Falha ao carregar módulo'))
      .finally(() => setLoading(false))
  }, [open, slug])

  const Icon =
    data?.iconLucide && (LucideIcons as any)[data.iconLucide]
      ? ((LucideIcons as any)[data.iconLucide] as React.ComponentType<{ className?: string }>)
      : Sparkles

  const priceR$ = data ? (data.priceCents / 100).toFixed(2).replace('.', ',') : '—'

  function handleAdd() {
    if (!slug || !data) return
    setError(null)
    startTransition(async () => {
      try {
        const res = await fetch('/api/billing/modules/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug }),
        })
        const json = await res.json()
        if (!res.ok || !json.ok) {
          setError(typeof json.error === 'string' ? json.error : 'Falha ao adicionar módulo')
          return
        }
        setDone({ invoiceUrl: json.invoiceUrl, proration: json.prorationR$ })
        router.refresh()
      } catch {
        setError('Falha de rede ao adicionar módulo')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] gap-0 p-0 overflow-hidden border-border/60">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-5 bg-gradient-to-br from-[#0a1f3d]/4 via-transparent to-[#c5a059]/6 dark:from-[#c5a059]/8 dark:via-transparent dark:to-[#0a1f3d]/8 border-b border-border/40">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>

          {loading || !data ? (
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-lg bg-muted animate-pulse" />
              <div className="h-5 w-3/5 rounded bg-muted animate-pulse" />
              <div className="h-4 w-4/5 rounded bg-muted animate-pulse" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-3">
                <div className="relative h-10 w-10 rounded-lg bg-[#0a1f3d] dark:bg-[#c5a059]/15 flex items-center justify-center ring-1 ring-inset ring-white/10">
                  <Icon className="h-5 w-5 text-white dark:text-[#c5a059]" />
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-background border border-border/60 flex items-center justify-center">
                    <Lock className="h-2.5 w-2.5 text-muted-foreground" />
                  </div>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {data.category}
                </span>
              </div>
              <DialogTitle className="font-display text-2xl tracking-tight leading-tight text-foreground">
                Adicionar {data.nome}
              </DialogTitle>
              <DialogDescription className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {data.descricao}
              </DialogDescription>
            </>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {done ? (
            <SuccessState
              moduleNome={data?.nome ?? ''}
              invoiceUrl={done.invoiceUrl}
              proration={done.proration}
              onClose={() => onOpenChange(false)}
            />
          ) : (
            <>
              {data?.features?.length ? (
                <ul className="space-y-2.5 mb-5">
                  {data.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <span className="flex h-4 w-4 mt-0.5 flex-shrink-0 items-center justify-center rounded-full bg-[#0a1f3d]/8 dark:bg-[#c5a059]/15">
                        <Check className="h-2.5 w-2.5 text-[#0a1f3d] dark:text-[#c5a059]" strokeWidth={3} />
                      </span>
                      <span className="text-foreground/85 leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="rounded-xl border border-border/60 bg-muted/40 px-4 py-3 flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Acréscimo mensal</span>
                <span className="font-display tracking-tight">
                  <span className="text-xs text-muted-foreground">+R$ </span>
                  <span className="text-2xl font-bold text-foreground">{priceR$}</span>
                  <span className="text-xs text-muted-foreground">/mês</span>
                </span>
              </div>

              {error && (
                <p
                  role="alert"
                  className="mt-3 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200/60 dark:border-red-900/40 rounded-md px-3 py-2"
                >
                  {error}
                </p>
              )}

              <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
                <Button
                  onClick={handleAdd}
                  disabled={!data || isPending}
                  className={cn(
                    'group w-full bg-[#0a1f3d] hover:bg-[#0a1f3d]/90 text-white',
                    'dark:bg-[#c5a059] dark:hover:bg-[#c5a059]/90 dark:text-[#0a1f3d]',
                    'transition-all duration-200',
                  )}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processando…
                    </>
                  ) : (
                    <>
                      Adicionar agora
                      <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => onOpenChange(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Agora não
                </Button>
              </div>

              <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground/80">
                Cobrança proporcional aos dias restantes do ciclo atual. Cancele a qualquer
                momento em <span className="font-medium text-foreground/80">Cobrança</span>.
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function SuccessState({
  moduleNome,
  invoiceUrl,
  proration,
  onClose,
}: {
  moduleNome: string
  invoiceUrl?: string
  proration?: number
  onClose: () => void
}) {
  return (
    <div className="text-center py-2">
      <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
        <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
      </div>
      <h3 className="font-display text-lg tracking-tight text-foreground">
        {moduleNome} liberado
      </h3>
      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
        Já está disponível no menu lateral.
        {typeof proration === 'number' && proration > 0 && (
          <>
            {' '}Cobrança proporcional de{' '}
            <span className="font-medium text-foreground">
              R$ {proration.toFixed(2).replace('.', ',')}
            </span>{' '}
            gerada.
          </>
        )}
      </p>

      <div className="mt-5 flex flex-col gap-2">
        {invoiceUrl && (
          <a
            href={invoiceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs underline underline-offset-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            Ver fatura
          </a>
        )}
        <Button onClick={onClose} className="w-full">
          Continuar
        </Button>
      </div>
    </div>
  )
}
