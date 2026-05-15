import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'

interface LogEntry {
  id: string
  pacienteId: string
  pacienteNome: string
  userName: string | null
  ipAddress: string | null
  createdAt: string
  metadata: Record<string, unknown> | null
}

interface Props {
  entries: LogEntry[]
  emptyMessage: string
}

export function HistoricoTabela({ entries, emptyMessage }: Props) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2 border border-dashed border-border rounded-xl text-center">
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="border border-border/60 rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Data/Hora</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Paciente</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Solicitado por</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">IP</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map(e => (
            <TableRow key={e.id} className="hover:bg-muted/30">
              <TableCell className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
                {new Date(e.createdAt).toLocaleString('pt-BR')}
              </TableCell>
              <TableCell className="text-sm font-medium">{e.pacienteNome}</TableCell>
              <TableCell className="text-sm">{e.userName ?? <span className="text-muted-foreground italic">Sistema</span>}</TableCell>
              <TableCell className="text-xs font-mono text-muted-foreground">{e.ipAddress ?? '—'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
