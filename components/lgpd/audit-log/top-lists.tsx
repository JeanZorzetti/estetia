import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Users } from 'lucide-react'

interface TopUser {
  user: { id: string; name: string | null; email?: string } | null
  count: number
}
interface TopPaciente {
  paciente: { id: string; nome: string } | null
  count: number
}

export function TopUsersList({ users }: { users: TopUser[] }) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3 flex flex-row items-center gap-2 space-y-0">
        <User className="w-4 h-4 text-muted-foreground" />
        <CardTitle className="text-base">Top 5 Usuários (30d)</CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Nenhum acesso registrado.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {users.map((u, i) => (
              <div key={u.user?.id ?? i} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{u.user?.name ?? '—'}</p>
                  </div>
                </div>
                <span className="text-sm tabular-nums font-semibold flex-shrink-0">{u.count.toLocaleString('pt-BR')}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function TopPacientesList({ pacientes }: { pacientes: TopPaciente[] }) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3 flex flex-row items-center gap-2 space-y-0">
        <Users className="w-4 h-4 text-muted-foreground" />
        <CardTitle className="text-base">Top 5 Pacientes Acessados (30d)</CardTitle>
      </CardHeader>
      <CardContent>
        {pacientes.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Nenhum acesso registrado.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {pacientes.map((p, i) => (
              <div key={p.paciente?.id ?? i} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  {p.paciente ? (
                    <Link
                      href={`/dashboard/lgpd/audit-log/paciente/${p.paciente.id}`}
                      className="text-sm font-medium hover:underline truncate"
                    >
                      {p.paciente.nome}
                    </Link>
                  ) : (
                    <p className="text-sm font-medium truncate">—</p>
                  )}
                </div>
                <span className="text-sm tabular-nums font-semibold flex-shrink-0">{p.count.toLocaleString('pt-BR')}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
