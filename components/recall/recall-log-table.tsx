import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'

interface RecallLog {
  id: string
  patientId: string
  enviadoEm: string
  status: 'ENVIADO' | 'ENTREGUE' | 'LIDO' | 'ERRO'
  canal: 'WHATSAPP' | 'EMAIL' | 'SMS'
  respondeu: boolean
  agendou: boolean
}

interface RecallLogTableProps {
  logs: RecallLog[]
}

const STATUS_CONFIG = {
  ENVIADO: { label: 'Enviado', icon: Clock, color: 'text-blue-600 bg-blue-50' },
  ENTREGUE: { label: 'Entregue', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50' },
  LIDO: { label: 'Lido', icon: CheckCircle, color: 'text-[#489FB5] bg-[#489FB5]/10' },
  ERRO: { label: 'Erro', icon: AlertCircle, color: 'text-red-600 bg-red-50' },
}

export function RecallLogTable({ logs }: RecallLogTableProps) {
  if (logs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center">
        <p className="text-sm text-muted-foreground">Nenhum envio realizado ainda</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Os logs aparecerão aqui após o cron processar esta regra.</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border/60 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/60 bg-muted/30">
            <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Paciente ID</th>
            <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Enviado em</th>
            <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Canal</th>
            <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Status</th>
            <th className="text-center px-4 py-2.5 text-xs font-medium text-muted-foreground">Respondeu</th>
            <th className="text-center px-4 py-2.5 text-xs font-medium text-muted-foreground">Agendou</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, i) => {
            const stCfg = STATUS_CONFIG[log.status] ?? STATUS_CONFIG.ENVIADO
            const StIcon = stCfg.icon
            return (
              <tr key={log.id} className={`border-b border-border/40 hover:bg-muted/20 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                <td className="px-4 py-2.5 text-xs text-muted-foreground font-mono">
                  {log.patientId.slice(0, 8)}…
                </td>
                <td className="px-4 py-2.5 text-xs text-foreground">
                  {new Date(log.enviadoEm).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-4 py-2.5 text-xs text-foreground">{log.canal}</td>
                <td className="px-4 py-2.5">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${stCfg.color}`}>
                    <StIcon className="w-2.5 h-2.5" />
                    {stCfg.label}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-center">
                  {log.respondeu
                    ? <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto" />
                    : <XCircle className="w-4 h-4 text-muted-foreground/40 mx-auto" />}
                </td>
                <td className="px-4 py-2.5 text-center">
                  {log.agendou
                    ? <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto" />
                    : <XCircle className="w-4 h-4 text-muted-foreground/40 mx-auto" />}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
