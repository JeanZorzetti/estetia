'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  FileHeart,
  MoreHorizontal,
  Pencil,
  Copy,
  EyeOff,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AnamnesisTemplate } from '@/components/anamnese/form-builder'

export interface AnamnesisTemplateRow {
  id: string
  nome: string
  procedimento: string | null
  descricao: string | null
  versao: number
  ativo: boolean
  templateHash: string
  template: AnamnesisTemplate
  updatedAt: string
  createdAt: string
}

interface Props {
  initialTemplates: AnamnesisTemplateRow[]
}

const PROCEDIMENTO_LABELS: Record<string, string> = {
  BOTOX: 'Botox',
  PREENCHIMENTO: 'Preenchimento',
  LASER: 'Laser',
  PEELING: 'Peeling',
  HARMONIZACAO_FACIAL: 'Harmonização Facial',
  LIMPEZA_PELE: 'Limpeza de Pele',
  MICROAGULHAMENTO: 'Microagulhamento',
  CRIOLIPOLISE: 'Criolipolise',
  RADIOFREQUENCIA: 'Radiofrequência',
  LUZ_PULSADA: 'Luz Pulsada',
  DEPILACAO_LASER: 'Depilação Laser',
  SKINBOOSTER: 'Skinbooster',
  FIOS_PDO: 'Fios PDO',
  OUTROS: 'Outros',
}

export function TemplatesListClient({ initialTemplates }: Props) {
  const router = useRouter()
  const [templates, setTemplates] = useState(initialTemplates)
  const [isPending, startTransition] = useTransition()
  const [deleteTarget, setDeleteTarget] = useState<AnamnesisTemplateRow | null>(null)

  async function handleToggleActive(template: AnamnesisTemplateRow) {
    const newAtivo = !template.ativo
    try {
      const res = await fetch(`/api/clinica/anamnese/templates/${template.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ativo: newAtivo }),
      })
      if (!res.ok) throw new Error()
      setTemplates((prev) =>
        prev.map((t) => (t.id === template.id ? { ...t, ativo: newAtivo } : t))
      )
      toast.success(newAtivo ? 'Template reativado' : 'Template desativado')
    } catch {
      toast.error('Erro ao atualizar template')
    }
  }

  async function handleDuplicate(template: AnamnesisTemplateRow) {
    try {
      const res = await fetch('/api/clinica/anamnese/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: `${template.nome} (cópia)`,
          procedimento: template.procedimento,
          descricao: template.descricao,
          template: template.template,
        }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      toast.success('Template duplicado')
      startTransition(() => router.refresh())
    } catch {
      toast.error('Erro ao duplicar template')
    }
  }

  async function handleDelete(template: AnamnesisTemplateRow) {
    try {
      const res = await fetch(`/api/clinica/anamnese/templates/${template.id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (res.status === 409) {
        toast.error(`${data.error} (${data.count} anamnese${data.count !== 1 ? 's' : ''})`)
        return
      }
      if (!res.ok) throw new Error()
      setTemplates((prev) => prev.filter((t) => t.id !== template.id))
      toast.success('Template excluído')
    } catch {
      toast.error('Erro ao excluir template')
    } finally {
      setDeleteTarget(null)
    }
  }

  const countCampos = (t: AnamnesisTemplateRow) =>
    t.template?.sections?.reduce((acc, s) => acc + (s.campos?.length ?? 0), 0) ?? 0

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className={cn(
              'group relative flex flex-col rounded-2xl border bg-white/60 backdrop-blur-sm p-5 gap-3 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5',
              template.ativo
                ? 'border-slate-200/70 hover:border-[#489FB5]/30'
                : 'border-slate-200/40 opacity-60 hover:opacity-75'
            )}
          >
            {/* Left accent */}
            <div
              className={cn(
                'absolute left-0 top-4 bottom-4 w-1 rounded-r-full',
                template.ativo ? 'bg-gradient-to-b from-[#489FB5] to-[#2d7a8e]' : 'bg-slate-300'
              )}
            />

            {/* Header */}
            <div className="flex items-start justify-between gap-2 pl-2">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                    template.ativo ? 'bg-[#489FB5]/10 border border-[#489FB5]/20' : 'bg-slate-100'
                  )}
                >
                  <FileHeart
                    className={cn('w-4 h-4', template.ativo ? 'text-[#2d7a8e]' : 'text-slate-400')}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate leading-tight">
                    {template.nome}
                  </p>
                  {template.procedimento && (
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                      {PROCEDIMENTO_LABELS[template.procedimento] ?? template.procedimento}
                    </span>
                  )}
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/dashboard/settings/anamnese/${template.id}`}
                      className="flex items-center gap-2"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Editar
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDuplicate(template)}>
                    <Copy className="w-3.5 h-3.5 mr-2" />
                    Duplicar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleToggleActive(template)}>
                    {template.ativo ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5 mr-2" />
                        Desativar
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5 mr-2" />
                        Reativar
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={() => setDeleteTarget(template)}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Description */}
            {template.descricao && (
              <p className="text-xs text-slate-500 leading-relaxed pl-2 line-clamp-2">
                {template.descricao}
              </p>
            )}

            {/* Stats */}
            <div className="flex items-center gap-3 pl-2 flex-wrap">
              <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                <Layers className="w-3 h-3" />
                {template.template?.sections?.length ?? 0} seção(ões)
              </span>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                <Clock className="w-3 h-3" />
                v{template.versao}
              </span>
              {template.ativo ? (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-teal-600">
                  <CheckCircle2 className="w-3 h-3" />
                  Ativo
                </span>
              ) : (
                <Badge variant="secondary" className="text-[10px] h-4 px-1.5 font-semibold">
                  Inativo
                </Badge>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 pl-2">
              <span className="text-[10px] text-slate-400">
                Atualizado {new Date(template.updatedAt).toLocaleDateString('pt-BR')}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs font-semibold text-[#2d7a8e] hover:text-[#2d7a8e] hover:bg-[#489FB5]/10"
                asChild
              >
                <Link href={`/dashboard/settings/anamnese/${template.id}`}>
                  <Pencil className="w-3 h-3 mr-1.5" />
                  Editar
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-sm font-bold">Excluir template?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              O template <strong>&ldquo;{deleteTarget?.nome}&rdquo;</strong> será excluído permanentemente. Se já
              foi usado em alguma anamnese, a exclusão será bloqueada automaticamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="text-xs rounded-xl bg-red-600 hover:bg-red-700"
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
