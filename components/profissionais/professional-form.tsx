'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProfessionalCreateSchema, type ProfessionalCreateInput, DEFAULT_HORARIO } from '@/lib/profissionais/schema'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Loader2, X } from 'lucide-react'
import { PhotoUpload } from './photo-upload'
import { HorarioEditor } from './horario-editor'
import { ProcedureMultiSelect } from './procedure-multi-select'

interface User { id: string; name: string | null; email: string }
interface Procedure { id: string; nome: string; categoria: string | null }

interface Props {
  initialData?: ProfessionalCreateInput & { id?: string }
  initialPhotoSignedUrl?: string | null
  users: User[]
  procedures: Procedure[]
}

const UF_LIST = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']

export function ProfessionalForm({ initialData, initialPhotoSignedUrl, users, procedures }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [especialidadeInput, setEspecialidadeInput] = useState('')
  const isEdit = !!initialData?.id

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<ProfessionalCreateInput>({
    resolver: zodResolver(ProfessionalCreateSchema) as any,
    defaultValues: {
      nome: initialData?.nome ?? '',
      conselho: initialData?.conselho ?? null,
      numeroConselho: initialData?.numeroConselho ?? '',
      ufConselho: initialData?.ufConselho ?? '',
      conselhoStatus: initialData?.conselhoStatus ?? '',
      especialidades: initialData?.especialidades ?? [],
      bio: initialData?.bio ?? '',
      fotoUrl: initialData?.fotoUrl ?? '',
      cargaHoraria: initialData?.cargaHoraria ?? DEFAULT_HORARIO,
      procedimentosHabilitadosIds: initialData?.procedimentosHabilitadosIds ?? [],
      userId: initialData?.userId ?? '',
      ativo: initialData?.ativo ?? true,
    },
  })

  const especialidades = watch('especialidades')
  const cargaHoraria = watch('cargaHoraria')
  const procedimentosIds = watch('procedimentosHabilitadosIds')
  const ativo = watch('ativo')
  const conselho = watch('conselho')

  const addEspecialidade = () => {
    const trim = especialidadeInput.trim()
    if (!trim || especialidades.includes(trim)) return
    setValue('especialidades', [...especialidades, trim])
    setEspecialidadeInput('')
  }

  const removeEspecialidade = (e: string) => {
    setValue('especialidades', especialidades.filter(x => x !== e))
  }

  const onSubmit = async (data: ProfessionalCreateInput) => {
    setSaving(true)
    try {
      const url = isEdit ? `/api/professionals/${initialData!.id}` : '/api/professionals'
      const method = isEdit ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        router.push('/dashboard/settings/profissionais')
        router.refresh()
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Identificação</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <PhotoUpload
            initialSignedUrl={initialPhotoSignedUrl}
            onChange={(key) => setValue('fotoUrl', key ?? '')}
          />

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Nome completo *</Label>
            <Input placeholder="Ex: Dra. Maria Silva" {...register('nome')} />
            {errors.nome && <p className="text-destructive text-xs">{errors.nome.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Bio</Label>
            <Textarea
              placeholder="Pequena biografia profissional, formação, foco de atuação..."
              className="resize-none h-24"
              {...register('bio')}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Conselho profissional</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Conselho</Label>
              <Controller
                name="conselho"
                control={control}
                render={({ field }) => (
                  <Select value={field.value ?? ''} onValueChange={(v) => field.onChange(v || null)}>
                    <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CRM">CRM</SelectItem>
                      <SelectItem value="CRO">CRO</SelectItem>
                      <SelectItem value="CRBM">CRBM</SelectItem>
                      <SelectItem value="CRF">CRF</SelectItem>
                      <SelectItem value="COREN">COREN</SelectItem>
                      <SelectItem value="CFBM">CFBM</SelectItem>
                      <SelectItem value="CREFITO">CREFITO</SelectItem>
                      <SelectItem value="CRP">CRP</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Número</Label>
              <Input placeholder="Ex: 12345" disabled={!conselho} {...register('numeroConselho')} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">UF</Label>
              <Controller
                name="ufConselho"
                control={control}
                render={({ field }) => (
                  <Select value={field.value ?? ''} onValueChange={field.onChange} disabled={!conselho}>
                    <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                    <SelectContent>
                      {UF_LIST.map(uf => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Status do conselho</Label>
            <Controller
              name="conselhoStatus"
              control={control}
              render={({ field }) => (
                <Select value={field.value ?? ''} onValueChange={(v) => field.onChange(v)}>
                  <SelectTrigger className="w-56"><SelectValue placeholder="—" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                    <SelectItem value="pendente">Pendente de validação</SelectItem>
                    <SelectItem value="nao_aplicavel">Não aplicável</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Especialidades</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex gap-2">
            <Input
              placeholder="Ex: Harmonização Facial · Enter para adicionar"
              value={especialidadeInput}
              onChange={e => setEspecialidadeInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addEspecialidade() } }}
            />
            <Button type="button" variant="outline" size="sm" onClick={addEspecialidade}>Adicionar</Button>
          </div>
          {especialidades.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {especialidades.map(e => (
                <Badge key={e} variant="secondary" className="gap-1 pr-1">
                  {e}
                  <button type="button" onClick={() => removeEspecialidade(e)} className="hover:bg-muted-foreground/20 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Carga horária</CardTitle>
        </CardHeader>
        <CardContent>
          <HorarioEditor
            value={cargaHoraria ?? null}
            onChange={(v) => setValue('cargaHoraria', v)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Procedimentos</CardTitle>
        </CardHeader>
        <CardContent>
          <ProcedureMultiSelect
            procedures={procedures}
            value={procedimentosIds}
            onChange={(ids) => setValue('procedimentosHabilitadosIds', ids)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Vínculo & status</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Usuário vinculado (opcional)</Label>
            <p className="text-xs text-muted-foreground">Vincule a uma conta de usuário se o profissional acessa o sistema.</p>
            <Controller
              name="userId"
              control={control}
              render={({ field }) => (
                <Select value={field.value || 'none'} onValueChange={(v) => field.onChange(v === 'none' ? '' : v)}>
                  <SelectTrigger><SelectValue placeholder="Nenhum" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum (sem login)</SelectItem>
                    {users.map(u => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name ?? u.email} <span className="text-muted-foreground text-xs ml-1">{u.email}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <Label className="text-sm font-medium">Profissional ativo</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Profissionais inativos não aparecem em seleções de procedimentos e agenda.</p>
            </div>
            <Switch checked={ativo} onCheckedChange={v => setValue('ativo', v)} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isEdit ? 'Salvar alterações' : 'Criar profissional'}
        </Button>
      </div>
    </form>
  )
}
