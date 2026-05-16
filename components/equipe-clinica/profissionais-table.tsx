'use client'

import { useState } from 'react'
import { MedicalCouncil, OrgRole } from '@prisma/client'
import { CouncilBadge } from '@/components/profissionais/council-badge'
import { RoleSelect } from '@/app/[locale]/dashboard/settings/team/role-select'
import { CfmValidateButton } from './cfm-validate-button'
import { HorarioQuickEditorDialog } from './horario-quick-editor-dialog'
import { ProcedimentosQuickEditorDialog } from './procedimentos-quick-editor-dialog'
import type { CargaHorariaInput } from '@/lib/profissionais/schema'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Clock, Stethoscope, ExternalLink, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROLE_LABELS, assignableRoles } from '@/lib/role-permissions'
import { toast } from 'sonner'

interface ProfessionalRow {
  id: string
  nome: string
  fotoUrl: string | null
  conselho: MedicalCouncil | null
  numeroConselho: string | null
  ufConselho: string | null
  conselhoStatus: string | null
  especialidades: string[]
  cargaHoraria: CargaHorariaInput | null
  procedimentosHabilitadosIds: string[]
  user: {
    id: string
    email: string
    orgRole: OrgRole
    jobTitle: string | null
  } | null
}

interface Props {
  professionals: ProfessionalRow[]
  actorRole: OrgRole
}

function statusRowClass(status: string | null) {
  if (status === 'ativo') return 'bg-emerald-50/40 dark:bg-emerald-950/10'
  if (status === 'pendente' || status === 'pendente_manual')
    return 'bg-amber-50/40 dark:bg-amber-950/10'
  if (['inativo', 'suspenso', 'cancelado'].includes(status ?? ''))
    return 'bg-red-50/40 dark:bg-red-950/10'
  return ''
}

function horarioSummary(horario: CargaHorariaInput | null): string {
  if (!horario) return 'Não definido'
  const days = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'] as const
  const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
  const active = days.filter(d => (horario as Record<string, { ativo?: boolean }>)[d]?.ativo)
  if (active.length === 0) return 'Não definido'
  if (active.length >= 5 && active.includes('seg') && active.includes('sex'))
    return 'Seg-Sex'
  return active.map(d => labels[days.indexOf(d)]).join(', ')
}

export function ProfissionaisTable({ professionals, actorRole }: Props) {
  const [q, setQ] = useState('')
  const [rows, setRows] = useState<ProfessionalRow[]>(professionals)
  const [horarioDialog, setHorarioDialog] = useState<{ id: string; nome: string; horario: CargaHorariaInput | null } | null>(null)
  const [procedDialog, setProcedDialog] = useState<{ id: string; nome: string; ids: string[] } | null>(null)

  const filtered = rows.filter(p =>
    !q || p.nome.toLowerCase().includes(q.toLowerCase())
  )

  const canAssign = assignableRoles(actorRole)
  const roleLabels: Record<string, string> = {
    ...ROLE_LABELS,
    VENDEDOR: 'Profissional',
    MEMBER: 'Profissional',
  }

  function updateHorario(profId: string, horario: CargaHorariaInput) {
    setRows(prev => prev.map(p => p.id === profId ? { ...p, cargaHoraria: horario } : p))
  }

  function updateProcedimentos(profId: string, ids: string[]) {
    setRows(prev => prev.map(p => p.id === profId ? { ...p, procedimentosHabilitadosIds: ids } : p))
  }

  function updateConselhoStatus(profId: string, status: string) {
    setRows(prev => prev.map(p => p.id === profId ? { ...p, conselhoStatus: status } : p))
  }

  async function handleDeactivate(profId: string) {
    try {
      await fetch(`/api/profissionais/${profId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ativo: false }),
      })
      setRows(prev => prev.filter(p => p.id !== profId))
      toast.success('Profissional desativado')
    } catch {
      toast.error('Erro ao desativar profissional')
    }
  }

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border border-border/50 rounded-xl bg-muted/20">
        <Stethoscope className="h-8 w-8 text-muted-foreground/40 mb-3" />
        <p className="text-sm text-muted-foreground">Nenhum profissional clínico cadastrado</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Use o botão acima para adicionar</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <Input
        placeholder="Buscar por nome..."
        value={q}
        onChange={e => setQ(e.target.value)}
        className="max-w-xs h-8 text-sm"
      />

      <div className="rounded-xl border border-border/50 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 bg-muted/30">
              <th className="py-2.5 px-4 text-left text-xs font-medium text-muted-foreground">Profissional</th>
              <th className="py-2.5 px-4 text-left text-xs font-medium text-muted-foreground hidden md:table-cell">Conselho</th>
              <th className="py-2.5 px-4 text-left text-xs font-medium text-muted-foreground hidden lg:table-cell">Especialidades</th>
              <th className="py-2.5 px-4 text-left text-xs font-medium text-muted-foreground hidden lg:table-cell">Horários</th>
              <th className="py-2.5 px-4 text-left text-xs font-medium text-muted-foreground hidden xl:table-cell">Procedimentos</th>
              <th className="py-2.5 px-4 text-left text-xs font-medium text-muted-foreground">Função</th>
              <th className="py-2.5 px-4 text-right text-xs font-medium text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(prof => (
              <tr
                key={prof.id}
                className={cn(
                  'border-b border-border/30 last:border-0 transition-colors duration-150 hover:bg-muted/20',
                  statusRowClass(prof.conselhoStatus)
                )}
              >
                {/* Profissional */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarImage src={prof.fotoUrl ?? ''} alt={prof.nome} />
                      <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                        {prof.nome.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{prof.nome}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {prof.user?.email ?? 'Sem acesso ao sistema'}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Conselho */}
                <td className="py-3 px-4 hidden md:table-cell">
                  <div className="flex items-center gap-1">
                    <CouncilBadge
                      conselho={prof.conselho}
                      numero={prof.numeroConselho}
                      uf={prof.ufConselho}
                    />
                    {prof.conselho && (
                      <CfmValidateButton
                        professionalId={prof.id}
                        onValidated={status => updateConselhoStatus(prof.id, status)}
                      />
                    )}
                  </div>
                </td>

                {/* Especialidades */}
                <td className="py-3 px-4 hidden lg:table-cell">
                  {prof.especialidades.length === 0 ? (
                    <span className="text-muted-foreground text-xs">—</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {prof.especialidades.slice(0, 2).map(e => (
                        <span key={e} className="text-xs bg-muted px-1.5 py-0.5 rounded-md">{e}</span>
                      ))}
                      {prof.especialidades.length > 2 && (
                        <span className="text-xs text-muted-foreground">+{prof.especialidades.length - 2}</span>
                      )}
                    </div>
                  )}
                </td>

                {/* Horários */}
                <td className="py-3 px-4 hidden lg:table-cell">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1.5 text-xs px-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setHorarioDialog({ id: prof.id, nome: prof.nome, horario: prof.cargaHoraria })}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    {horarioSummary(prof.cargaHoraria)}
                  </Button>
                </td>

                {/* Procedimentos */}
                <td className="py-3 px-4 hidden xl:table-cell">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 text-xs px-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setProcedDialog({ id: prof.id, nome: prof.nome, ids: prof.procedimentosHabilitadosIds })}
                  >
                    <Stethoscope className="h-3.5 w-3.5" />
                    {prof.procedimentosHabilitadosIds.length > 0
                      ? `${prof.procedimentosHabilitadosIds.length} hab.`
                      : 'Nenhum'}
                  </Button>
                </td>

                {/* Função */}
                <td className="py-3 px-4">
                  {prof.user ? (
                    <RoleSelect
                      userId={prof.user.id}
                      currentRole={prof.user.orgRole}
                      assignableRoles={canAssign}
                      roleLabels={roleLabels}
                      disabled={actorRole !== 'OWNER' && actorRole !== 'GERENTE'}
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground italic">Sem usuário</span>
                  )}
                </td>

                {/* Ações */}
                <td className="py-3 px-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <a href={`/dashboard/settings/profissionais/${prof.id}`} className="flex items-center gap-2">
                          <ExternalLink className="h-3.5 w-3.5" />
                          Editar perfil completo
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setHorarioDialog({ id: prof.id, nome: prof.nome, horario: prof.cargaHoraria })}
                      >
                        <Clock className="h-3.5 w-3.5 mr-2" />
                        Editar horários
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setProcedDialog({ id: prof.id, nome: prof.nome, ids: prof.procedimentosHabilitadosIds })}
                      >
                        <Stethoscope className="h-3.5 w-3.5 mr-2" />
                        Editar procedimentos
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDeactivate(prof.id)}
                      >
                        <ShieldAlert className="h-3.5 w-3.5 mr-2" />
                        Desativar profissional
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {horarioDialog && (
        <HorarioQuickEditorDialog
          professionalId={horarioDialog.id}
          professionalName={horarioDialog.nome}
          initialHorario={horarioDialog.horario}
          open={!!horarioDialog}
          onOpenChange={open => !open && setHorarioDialog(null)}
          onSaved={h => updateHorario(horarioDialog.id, h)}
        />
      )}

      {procedDialog && (
        <ProcedimentosQuickEditorDialog
          professionalId={procedDialog.id}
          professionalName={procedDialog.nome}
          initialIds={procedDialog.ids}
          open={!!procedDialog}
          onOpenChange={open => !open && setProcedDialog(null)}
          onSaved={ids => updateProcedimentos(procedDialog.id, ids)}
        />
      )}
    </div>
  )
}
