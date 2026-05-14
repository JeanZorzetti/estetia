'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ReferralStatusBadge } from './referral-status-badge'
import { ReferralActionDialog } from './referral-action-dialog'
import { MoreHorizontal, Gift, UserCheck, X } from 'lucide-react'

interface Referral {
  id: string
  status: string
  nomeIndicado: string | null
  telefoneIndicado: string | null
  recompensaTipo: string | null
  recompensaValor: number | null
  createdAt: string
  indicador: { id: string; nome: string }
  indicado: { id: string; nome: string } | null
}

interface Props {
  initialReferrals: Referral[]
}

type ActionType = 'convert' | 'reward' | 'cancel'

export function ReferralsTable({ initialReferrals }: Props) {
  const router = useRouter()
  const [referrals, setReferrals] = useState<Referral[]>(initialReferrals)
  const [dialog, setDialog] = useState<{ id: string; action: ActionType } | null>(null)

  const refresh = async () => {
    const res = await fetch('/api/patient-referrals')
    const data = await res.json()
    setReferrals(data.referrals ?? [])
    router.refresh()
  }

  if (referrals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2 border border-dashed border-border rounded-xl text-center">
        <p className="text-sm text-muted-foreground">Nenhuma indicação registrada ainda.</p>
      </div>
    )
  }

  return (
    <>
      <div className="border border-border/60 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Indicador</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Indicado</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Status</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Recompensa</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Data</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider w-12">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {referrals.map(r => (
              <TableRow key={r.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium text-sm">{r.indicador.nome}</TableCell>
                <TableCell className="text-sm">
                  {r.indicado?.nome ?? r.nomeIndicado ?? <span className="text-muted-foreground">—</span>}
                  {!r.indicado && r.telefoneIndicado && (
                    <span className="text-xs text-muted-foreground block">{r.telefoneIndicado}</span>
                  )}
                </TableCell>
                <TableCell>
                  <ReferralStatusBadge status={r.status} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {r.recompensaTipo ? (
                    <span>
                      {r.recompensaTipo === 'pontos_fidelidade' ? 'Pontos' : r.recompensaTipo === 'desconto_proximo' ? 'Desconto' : 'Outro'}
                      {r.recompensaValor != null ? ` · ${r.recompensaValor.toLocaleString('pt-BR')}` : ''}
                    </span>
                  ) : '—'}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(r.createdAt).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell data-no-row-click>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {r.status === 'PENDENTE' && (
                        <DropdownMenuItem onClick={() => setDialog({ id: r.id, action: 'convert' })}>
                          <UserCheck className="w-4 h-4 mr-2" />
                          Marcar como convertido
                        </DropdownMenuItem>
                      )}
                      {r.status === 'CONVERTIDO' && (
                        <DropdownMenuItem onClick={() => setDialog({ id: r.id, action: 'reward' })}>
                          <Gift className="w-4 h-4 mr-2" />
                          Marcar como recompensado
                        </DropdownMenuItem>
                      )}
                      {(r.status === 'PENDENTE' || r.status === 'CONVERTIDO') && (
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDialog({ id: r.id, action: 'cancel' })}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancelar
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {dialog && (
        <ReferralActionDialog
          referralId={dialog.id}
          action={dialog.action}
          open={!!dialog}
          onOpenChange={v => { if (!v) setDialog(null) }}
          onSuccess={() => { setDialog(null); refresh() }}
        />
      )}
    </>
  )
}
