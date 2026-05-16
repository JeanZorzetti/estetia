import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  title: string
  description: string
  icon: LucideIcon
  iconBg: string
  iconColor: string
}

export function ClinicaPageHeader({ title, description, icon: Icon, iconBg, iconColor }: Props) {
  return (
    <div className="space-y-4">
      <Link href="/dashboard/settings">
        <Button variant="ghost" size="sm" className="gap-2 -ml-3">
          <ArrowLeft className="h-4 w-4" />
          Configurações
        </Button>
      </Link>

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
    </div>
  )
}
