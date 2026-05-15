import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, CheckCircle2, XCircle } from 'lucide-react'

interface Props {
  enabled: boolean
  totalRecebiveis: number
}

export function OmieStatusCard({ enabled, totalRecebiveis }: Props) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Status da Integração</CardTitle>
        {enabled ? (
          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-0">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Conectado
          </Badge>
        ) : (
          <Badge variant="secondary" className="border-0">
            <XCircle className="w-3 h-3 mr-1" />
            Desabilitado
          </Badge>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Recebíveis sincronizados</p>
            <p className="text-2xl font-bold">{totalRecebiveis}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Provedor</p>
            <p className="text-sm font-medium pt-1">Omie ERP</p>
          </div>
        </div>

        <Link
          href="/dashboard/integrations/omie"
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline self-start"
        >
          Configurar credenciais
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </CardContent>
    </Card>
  )
}
