'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Building2, Plus, FileText, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Operadora {
  id: string
  nome: string
  codigoAns: string | null
  cnpj: string | null
  tipo: string
  contatoNome: string | null
  contatoEmail: string | null
  contatoTelefone: string | null
  prazoRepasseDias: number | null
  ativo: boolean
  _count: { convenios: number; guias: number }
}

interface Guia {
  id: string
  tipo: string
  status: string
  numeroGuia: string | null
  valorTotal: number | null
  dataExecucao: string | null
  nfseNumero: string | null
  nfseStatus: string | null
  operadora: { nome: string; codigoAns: string | null }
  paciente: { nome: string }
}

const STATUS_COLORS: Record<string, string> = {
  RASCUNHO: 'bg-gray-100 text-gray-600',
  ENVIADA: 'bg-blue-100 text-blue-700',
  AUTORIZADA: 'bg-green-100 text-green-700',
  NEGADA: 'bg-red-100 text-red-700',
  GLOSADA: 'bg-orange-100 text-orange-700',
  PAGA: 'bg-emerald-100 text-emerald-700',
  CANCELADA: 'bg-gray-50 text-gray-400',
}

const STATUS_ICONS: Record<string, typeof CheckCircle> = {
  AUTORIZADA: CheckCircle,
  PAGA: CheckCircle,
  NEGADA: XCircle,
  GLOSADA: AlertCircle,
  ENVIADA: Clock,
  RASCUNHO: Clock,
  CANCELADA: XCircle,
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function OperadorasPage() {
  const [operadoras, setOperadoras] = useState<Operadora[]>([])
  const [guias, setGuias] = useState<Guia[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    nome: '',
    codigoAns: '',
    cnpj: '',
    tipo: 'CONVENIO',
    contatoNome: '',
    contatoEmail: '',
    contatoTelefone: '',
    prazoRepasseDias: '',
  })

  useEffect(() => {
    Promise.all([
      fetch('/api/clinica/operadoras').then(r => r.json()),
      fetch('/api/clinica/guias-tiss').then(r => r.json()),
    ]).then(([opData, guiaData]) => {
      setOperadoras(opData.operadoras ?? [])
      setGuias(guiaData.guias ?? [])
    }).finally(() => setLoading(false))
  }, [])

  const handleSaveOperadora = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/clinica/operadoras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          prazoRepasseDias: form.prazoRepasseDias ? parseInt(form.prazoRepasseDias, 10) : undefined,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setOperadoras((prev: Operadora[]) => [...prev, { ...data.operadora, _count: { convenios: 0, guias: 0 } }])
        setShowAddDialog(false)
        setForm({ nome: '', codigoAns: '', cnpj: '', tipo: 'CONVENIO', contatoNome: '', contatoEmail: '', contatoTelefone: '', prazoRepasseDias: '' })
      }
    } finally {
      setSaving(false)
    }
  }

  const handleGuiaAction = async (guiaId: string, action: string) => {
    const res = await fetch(`/api/clinica/guias-tiss/${guiaId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    if (res.ok) {
      const data = await res.json()
      setGuias((prev: Guia[]) => prev.map((g: Guia) => g.id === guiaId ? { ...g, status: data.status ?? g.status } : g))
    }
  }

  // Summary stats
  const totalGuias = guias.length
  const guiasPendentes = guias.filter((g: Guia) => ['RASCUNHO', 'ENVIADA'].includes(g.status)).length
  const valorPendente = guias
    .filter((g: Guia) => ['ENVIADA', 'AUTORIZADA'].includes(g.status))
    .reduce((s: number, g: Guia) => s + (g.valorTotal ?? 0), 0)

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-rose-500" />
            Operadoras & Convênios
          </h1>
          <p className="text-sm text-muted-foreground">Gestão de planos, guias TISS e faturamento</p>
        </div>
        <Button className="bg-rose-500 hover:bg-rose-600" onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Operadora
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Operadoras ativas</p>
            <p className="text-2xl font-bold">{operadoras.filter((o: Operadora) => o.ativo).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Total de guias</p>
            <p className="text-2xl font-bold">{totalGuias}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Guias pendentes</p>
            <p className="text-2xl font-bold text-orange-600">{guiasPendentes}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">A receber</p>
            <p className="text-2xl font-bold text-green-600">
              {valorPendente.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="operadoras">
        <TabsList>
          <TabsTrigger value="operadoras">
            <Building2 className="mr-1.5 h-3.5 w-3.5" />
            Operadoras ({operadoras.length})
          </TabsTrigger>
          <TabsTrigger value="guias">
            <FileText className="mr-1.5 h-3.5 w-3.5" />
            Guias TISS ({guias.length})
          </TabsTrigger>
        </TabsList>

        {/* Operadoras tab */}
        <TabsContent value="operadoras">
          {loading ? (
            <p className="text-center text-sm text-muted-foreground py-8">Carregando...</p>
          ) : operadoras.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Building2 className="mx-auto h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm">Nenhuma operadora cadastrada.</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => setShowAddDialog(true)}>
                Adicionar primeira operadora
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {operadoras.map((op: Operadora) => (
                <Card key={op.id} className={cn(!op.ativo && 'opacity-60')}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-sm font-semibold">{op.nome}</CardTitle>
                      <Badge className={cn(
                        'text-xs',
                        op.tipo === 'CONVENIO' ? 'bg-blue-100 text-blue-700' :
                        op.tipo === 'PARTICULAR' ? 'bg-rose-100 text-rose-700' :
                        'bg-gray-100 text-gray-600'
                      )}>
                        {op.tipo}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-1.5 text-sm">
                    {op.codigoAns && (
                      <p className="text-xs text-muted-foreground">ANS: {op.codigoAns}</p>
                    )}
                    {op.cnpj && (
                      <p className="text-xs text-muted-foreground">CNPJ: {op.cnpj}</p>
                    )}
                    {op.prazoRepasseDias && (
                      <p className="text-xs text-muted-foreground">Repasse: {op.prazoRepasseDias}d</p>
                    )}
                    <div className="flex gap-3 pt-1 text-xs text-muted-foreground">
                      <span>{op._count.convenios} itens TUSS</span>
                      <span>{op._count.guias} guias</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Guias tab */}
        <TabsContent value="guias">
          <div className="divide-y rounded-lg border">
            {guias.length === 0 && (
              <p className="text-center py-8 text-sm text-muted-foreground">
                Nenhuma guia gerada ainda.
              </p>
            )}
            {guias.map((g: Guia) => {
              const StatusIcon = STATUS_ICONS[g.status] ?? Clock
              return (
                <div key={g.id} className="flex items-center justify-between gap-4 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{g.paciente.nome}</span>
                      <Badge className={cn('text-xs', STATUS_COLORS[g.status] ?? 'bg-gray-100 text-gray-600')}>
                        <StatusIcon className="mr-1 h-2.5 w-2.5" />
                        {g.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {g.operadora.nome}
                      {g.numeroGuia && ` · Guia ${g.numeroGuia}`}
                      {g.valorTotal && ` · ${Number(g.valorTotal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
                    </p>
                    {g.nfseNumero && (
                      <p className="text-xs text-green-600">NFS-e #{g.nfseNumero}</p>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {g.status === 'RASCUNHO' && (
                      <Button size="sm" variant="outline" className="h-7 text-xs"
                        onClick={() => handleGuiaAction(g.id, 'enviar')}>
                        Enviar
                      </Button>
                    )}
                    {g.status === 'ENVIADA' && (
                      <>
                        <Button size="sm" variant="outline" className="h-7 text-xs text-green-700"
                          onClick={() => handleGuiaAction(g.id, 'pagar')}>
                          Pago
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 text-xs text-orange-600"
                          onClick={() => {
                            const motivo = prompt('Motivo da glosa:')
                            if (motivo) handleGuiaAction(g.id, 'glosar')
                          }}>
                          Glosar
                        </Button>
                      </>
                    )}
                    {['PAGA', 'AUTORIZADA'].includes(g.status) && !g.nfseNumero && (
                      <Button size="sm" variant="outline" className="h-7 text-xs"
                        onClick={() => handleGuiaAction(g.id, 'emitir_nfse')}>
                        Emitir NFS-e
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Operadora Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Operadora</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Nome *</Label>
              <Input value={form.nome} onChange={(e: { target: { value: string } }) => setForm((p: typeof form) => ({ ...p, nome: e.target.value }))} placeholder="Bradesco Saúde" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Código ANS</Label>
                <Input value={form.codigoAns} onChange={(e: { target: { value: string } }) => setForm((p: typeof form) => ({ ...p, codigoAns: e.target.value }))} placeholder="006246" maxLength={6} />
              </div>
              <div className="space-y-1">
                <Label>Tipo</Label>
                <Select value={form.tipo} onValueChange={(v: string) => setForm((p: typeof form) => ({ ...p, tipo: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CONVENIO">Convênio</SelectItem>
                    <SelectItem value="PARTICULAR">Particular</SelectItem>
                    <SelectItem value="CORTESIA">Cortesia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <Label>CNPJ</Label>
              <Input value={form.cnpj} onChange={(e: { target: { value: string } }) => setForm((p: typeof form) => ({ ...p, cnpj: e.target.value }))} placeholder="00.000.000/0001-00" />
            </div>
            <div className="space-y-1">
              <Label>Prazo de repasse (dias)</Label>
              <Input type="number" value={form.prazoRepasseDias} onChange={(e: { target: { value: string } }) => setForm((p: typeof form) => ({ ...p, prazoRepasseDias: e.target.value }))} placeholder="30" />
            </div>
            <div className="space-y-1">
              <Label>E-mail de contato</Label>
              <Input type="email" value={form.contatoEmail} onChange={(e: { target: { value: string } }) => setForm((p: typeof form) => ({ ...p, contatoEmail: e.target.value }))} placeholder="faturamento@operadora.com" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowAddDialog(false)}>Cancelar</Button>
            <Button
              className="bg-rose-500 hover:bg-rose-600"
              disabled={!form.nome || saving}
              onClick={handleSaveOperadora}
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
