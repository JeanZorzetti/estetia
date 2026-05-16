import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface Props {
  title: string
  description: string
  icon: LucideIcon
  iconBg: string
  iconColor: string
  docsUrl?: string
  docsLabel?: string
}

export function IntegrationPageHeader({
  title,
  description,
  icon: Icon,
  iconBg,
  iconColor,
  docsUrl,
  docsLabel = 'Documentação',
}: Props) {
  return (
    <div className="space-y-4">
      <Link href="/dashboard/settings/integrations">
        <Button variant="ghost" size="sm" className="gap-2 -ml-3">
          <ArrowLeft className="h-4 w-4" />
          Integrações
        </Button>
      </Link>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 ring-border/40',
              iconBg,
              iconColor
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{description}</p>
          </div>
        </div>

        {docsUrl && (
          <a href={docsUrl} target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ExternalLink className="h-3.5 w-3.5" />
              {docsLabel}
            </Button>
          </a>
        )}
      </div>
    </div>
  )
}
