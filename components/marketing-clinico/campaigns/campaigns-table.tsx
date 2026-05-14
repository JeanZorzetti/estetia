'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Send, Trash2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Campaign {
  id: string
  nome: string
  canal: 'WHATSAPP' | 'EMAIL'
  status: string
  totalDestinatarios: number
  totalEnviados: number
  agendadoPara: string | null
  enviadoEm: string | null
  createdAt: string
}

interface Props {
  initialCampaigns: Campaign[]
}

const STATUS_LABELS: Record<string, string> = {
  RASCUNHO: 'Rascunho', AGENDADA: 'Agendada', ENVIANDO: 'Enviando', ENVIADA: 'Enviada', CANCELADA: 'Cancelada',
}
const STATUS_COLORS: Record<string, string> = {
  RASCUNHO: 'bg-muted text-muted-foreground',
  AGENDADA: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  ENVIANDO: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  ENVIADA: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  CANCELADA: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}
const CANAL_LABELS: Record<string, string> = { WHATSAPP: 'WhatsApp', EMAIL: 'E-mail' }

export function CampaignsTable({ initialCampaigns }: Props) {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns)
  const [sendingId, setSendingId] = useState<string | null>(null)

  const sendNow = async (id: string) => {
    setSendingId(id)
    try {
      const res = await fetch(`/api/marketing-campaigns/${id}/send`, { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...data.campaign } : c))
        router.refresh()
      }
    } finally {
      setSendingId(null)
    }
  }

  const deleteCampaign = async (id: string) => {
    await fetch(`/api/marketing-campaigns/${id}`, { method: 'DELETE' })
    setCampaigns(prev => prev.filter(c => c.id !== id))
    router.refresh()
  }

  if (campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 border border-dashed border-border rounded-xl text-center">
        <p className="text-sm text-muted-foreground">Nenhuma campanha criada ainda.</p>
        <Link href="/dashboard/marketing-clinico/campanhas/nova">
          <Button size="sm" variant="outline">Criar primeira campanha</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="border border-border/60 rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Nome</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Canal</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Status</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Destinatários</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Enviados</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Data</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider w-12">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map(c => (
            <TableRow
              key={c.id}
              className="hover:bg-muted/30 transition-colors cursor-pointer"
              onClick={e => {
                const target = e.target as HTMLElement
                if (target.closest('[data-no-row-click]')) return
                router.push(`/dashboard/marketing-clinico/campanhas/${c.id}`)
              }}
            >
              <TableCell className="font-medium text-sm">{c.nome}</TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">{CANAL_LABELS[c.canal]}</Badge>
              </TableCell>
              <TableCell>
                <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', STATUS_COLORS[c.status] ?? STATUS_COLORS.RASCUNHO)}>
                  {STATUS_LABELS[c.status] ?? c.status}
                </span>
              </TableCell>
              <TableCell className="text-sm tabular-nums">{c.totalDestinatarios > 0 ? c.totalDestinatarios.toLocaleString('pt-BR') : '—'}</TableCell>
              <TableCell className="text-sm tabular-nums">{c.totalEnviados > 0 ? c.totalEnviados.toLocaleString('pt-BR') : '—'}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {c.enviadoEm
                  ? new Date(c.enviadoEm).toLocaleDateString('pt-BR')
                  : c.agendadoPara
                  ? `Agend. ${new Date(c.agendadoPara).toLocaleDateString('pt-BR')}`
                  : new Date(c.createdAt).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell data-no-row-click>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                      {sendingId === c.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreHorizontal className="w-4 h-4" />}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {(c.status === 'RASCUNHO' || c.status === 'AGENDADA') && (
                      <DropdownMenuItem onClick={() => sendNow(c.id)}>
                        <Send className="w-4 h-4 mr-2" />
                        Enviar agora
                      </DropdownMenuItem>
                    )}
                    {c.status !== 'ENVIADA' && c.status !== 'ENVIANDO' && (
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => deleteCampaign(c.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
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
  )
}
