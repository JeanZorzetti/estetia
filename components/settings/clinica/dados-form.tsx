'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Search, Building, Landmark, Compass, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { maskCnpj, validateCnpj, unmaskCnpj } from '@/lib/validacao-cnpj'
import { updateClinicaDados, type EnderecoData } from '@/app/[locale]/dashboard/settings/clinica/actions'

const ESTADOS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
  'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
]

interface Props {
  initial: {
    cnpj: string
    razaoSocial: string
    inscricaoEstadual: string
    inscricaoMunicipal: string
    endereco: EnderecoData
  }
}

export function DadosForm({ initial }: Props) {
  const [cnpj, setCnpj] = useState(maskCnpj(initial.cnpj))
  const [cnpjError, setCnpjError] = useState<string | null>(null)
  const [razaoSocial, setRazaoSocial] = useState(initial.razaoSocial)
  const [ie, setIe] = useState(initial.inscricaoEstadual)
  const [im, setIm] = useState(initial.inscricaoMunicipal)
  const [endereco, setEndereco] = useState<EnderecoData>(initial.endereco)
  const [cepLoading, setCepLoading] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleCnpjChange(value: string) {
    setCnpj(maskCnpj(value))
    setCnpjError(null)
  }

  function handleCnpjBlur() {
    if (!cnpj) return
    if (!validateCnpj(unmaskCnpj(cnpj))) {
      setCnpjError('CNPJ inválido')
    }
  }

  async function lookupCep() {
    const cep = (endereco.cep ?? '').replace(/\D/g, '')
    if (cep.length !== 8) {
      toast.error('CEP inválido — informe 8 dígitos')
      return
    }
    setCepLoading(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await res.json()
      if (data.erro) {
        toast.error('CEP não encontrado')
        return
      }
      setEndereco((prev) => ({
        ...prev,
        rua: data.logradouro ?? prev.rua,
        bairro: data.bairro ?? prev.bairro,
        cidade: data.localidade ?? prev.cidade,
        uf: data.uf ?? prev.uf,
      }))
      toast.success('Endereço preenchido')
    } catch {
      toast.error('Erro ao buscar CEP')
    } finally {
      setCepLoading(false)
    }
  }

  function handleSubmit() {
    if (cnpj && !validateCnpj(unmaskCnpj(cnpj))) {
      setCnpjError('CNPJ inválido')
      return
    }

    startTransition(async () => {
      try {
        await updateClinicaDados({
          cnpj,
          razaoSocial,
          inscricaoEstadual: ie,
          inscricaoMunicipal: im,
          endereco,
        })
        toast.success('Dados salvos')
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Erro ao salvar')
      }
    })
  }

  function patchEndereco<K extends keyof EnderecoData>(key: K, value: EnderecoData[K]) {
    setEndereco((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-8">
      {/* SEÇÃO 1: Identificação Jurídica */}
      <Card className="relative bg-white/40 dark:bg-slate-900/40 border-white/50 dark:border-slate-800/40 shadow-lg backdrop-blur-xl rounded-2xl overflow-hidden group transition-all duration-300 hover:shadow-xl">
        {/* Moldura interna cristalina */}
        <div className="absolute inset-[1px] rounded-[15px] border border-white/40 dark:border-white/[0.02] pointer-events-none" />

        {/* Glow sutil sob hover no card */}
        <div className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-teal-500/5 -z-10 pointer-events-none" />

        <CardHeader className="flex flex-row items-center gap-4.5 pb-4 border-b border-slate-200/40 dark:border-slate-800/40">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600 text-white shadow-md">
            <Building className="h-5 w-5 drop-shadow-sm" />
          </div>
          <div>
            <CardTitle className="font-serif text-base font-bold text-slate-800 dark:text-slate-200">
              Identificação Jurídica
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Dados oficiais e fiscais exibidos em recibos, NF-Se, guias TISS e contratos
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 group/field">
              <Label htmlFor="cnpj" className="text-xs font-bold text-slate-600 dark:text-slate-400 group-focus-within/field:text-teal-500 transition-colors">CNPJ</Label>
              <Input
                id="cnpj"
                placeholder="00.000.000/0000-00"
                value={cnpj}
                onChange={(e) => handleCnpjChange(e.target.value)}
                onBlur={handleCnpjBlur}
                aria-invalid={!!cnpjError}
                className={cnpjError ? 'border-destructive focus-visible:ring-destructive rounded-xl' : 'rounded-xl bg-white/60 dark:bg-slate-900/60 border-white/40 dark:border-slate-800/40 focus-visible:ring-1 focus-visible:ring-teal-500/50 focus-visible:border-teal-500/50 transition-all shadow-sm'}
              />
              {cnpjError && <p className="text-xs font-semibold text-destructive mt-1">{cnpjError}</p>}
            </div>
            <div className="space-y-1.5 group/field">
              <Label htmlFor="rs" className="text-xs font-bold text-slate-600 dark:text-slate-400 group-focus-within/field:text-teal-500 transition-colors">Razão Social</Label>
              <Input 
                id="rs" 
                value={razaoSocial} 
                onChange={(e) => setRazaoSocial(e.target.value)} 
                placeholder="Clínica X Estética Ltda." 
                className="rounded-xl bg-white/60 dark:bg-slate-900/60 border-white/40 dark:border-slate-800/40 focus-visible:ring-1 focus-visible:ring-teal-500/50 focus-visible:border-teal-500/50 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 group/field">
              <Label htmlFor="ie" className="text-xs font-bold text-slate-600 dark:text-slate-400 group-focus-within/field:text-teal-500 transition-colors">Inscrição Estadual</Label>
              <Input 
                id="ie" 
                value={ie} 
                onChange={(e) => setIe(e.target.value)} 
                placeholder="000.000.000.000" 
                className="rounded-xl bg-white/60 dark:bg-slate-900/60 border-white/40 dark:border-slate-800/40 focus-visible:ring-1 focus-visible:ring-teal-500/50 focus-visible:border-teal-500/50 transition-all shadow-sm"
              />
            </div>
            <div className="space-y-1.5 group/field">
              <Label htmlFor="im" className="text-xs font-bold text-slate-600 dark:text-slate-400 group-focus-within/field:text-teal-500 transition-colors">Inscrição Municipal</Label>
              <Input 
                id="im" 
                value={im} 
                onChange={(e) => setIm(e.target.value)} 
                placeholder="0000000" 
                className="rounded-xl bg-white/60 dark:bg-slate-900/60 border-white/40 dark:border-slate-800/40 focus-visible:ring-1 focus-visible:ring-teal-500/50 focus-visible:border-teal-500/50 transition-all shadow-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEÇÃO 2: Endereço da Clínica */}
      <Card className="relative bg-white/40 dark:bg-slate-900/40 border-white/50 dark:border-slate-800/40 shadow-lg backdrop-blur-xl rounded-2xl overflow-hidden group transition-all duration-300 hover:shadow-xl">
        {/* Moldura interna cristalina */}
        <div className="absolute inset-[1px] rounded-[15px] border border-white/40 dark:border-white/[0.02] pointer-events-none" />

        {/* Glow sutil sob hover no card */}
        <div className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-teal-500/5 -z-10 pointer-events-none" />

        <CardHeader className="flex flex-row items-center gap-4.5 pb-4 border-b border-slate-200/40 dark:border-slate-800/40">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600 text-white shadow-md">
            <Compass className="h-5 w-5 drop-shadow-sm" />
          </div>
          <div>
            <CardTitle className="font-serif text-base font-bold text-slate-800 dark:text-slate-200">
              Endereço Operacional
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Endereço oficial de atendimento — digite o CEP para preenchimento ágil
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5 group/field">
              <Label htmlFor="cep" className="text-xs font-bold text-slate-600 dark:text-slate-400 group-focus-within/field:text-teal-500 transition-colors">CEP</Label>
              <div className="flex gap-2">
                <Input
                  id="cep"
                  value={endereco.cep ?? ''}
                  onChange={(e) => patchEndereco('cep', e.target.value)}
                  placeholder="00000-000"
                  className="rounded-xl bg-white/60 dark:bg-slate-900/60 border-white/40 dark:border-slate-800/40 focus-visible:ring-1 focus-visible:ring-teal-500/50 focus-visible:border-teal-500/50 transition-all shadow-sm"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  onClick={lookupCep} 
                  disabled={cepLoading} 
                  aria-label="Buscar CEP"
                  className="h-10 w-10 shrink-0 rounded-xl bg-white/50 dark:bg-slate-900/50 border-white/40 dark:border-slate-800/40 hover:bg-teal-500/10 hover:border-teal-500/35 hover:text-teal-500 dark:hover:text-teal-400 transition-all duration-300 shadow-sm"
                >
                  {cepLoading ? <Loader2 className="h-4 w-4 animate-spin text-teal-500" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-1.5 sm:col-span-2 group/field">
              <Label htmlFor="rua" className="text-xs font-bold text-slate-600 dark:text-slate-400 group-focus-within/field:text-teal-500 transition-colors">Rua / Avenida</Label>
              <Input 
                id="rua" 
                value={endereco.rua ?? ''} 
                onChange={(e) => patchEndereco('rua', e.target.value)} 
                className="rounded-xl bg-white/60 dark:bg-slate-900/60 border-white/40 dark:border-slate-800/40 focus-visible:ring-1 focus-visible:ring-teal-500/50 focus-visible:border-teal-500/50 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5 group/field">
              <Label htmlFor="num" className="text-xs font-bold text-slate-600 dark:text-slate-400 group-focus-within/field:text-teal-500 transition-colors">Número</Label>
              <Input 
                id="num" 
                value={endereco.numero ?? ''} 
                onChange={(e) => patchEndereco('numero', e.target.value)} 
                className="rounded-xl bg-white/60 dark:bg-slate-900/60 border-white/40 dark:border-slate-800/40 focus-visible:ring-1 focus-visible:ring-teal-500/50 focus-visible:border-teal-500/50 transition-all shadow-sm"
              />
            </div>
            <div className="space-y-1.5 group/field">
              <Label htmlFor="compl" className="text-xs font-bold text-slate-600 dark:text-slate-400 group-focus-within/field:text-teal-500 transition-colors">Complemento</Label>
              <Input 
                id="compl" 
                value={endereco.complemento ?? ''} 
                onChange={(e) => patchEndereco('complemento', e.target.value)} 
                placeholder="Sala 202" 
                className="rounded-xl bg-white/60 dark:bg-slate-900/60 border-white/40 dark:border-slate-800/40 focus-visible:ring-1 focus-visible:ring-teal-500/50 focus-visible:border-teal-500/50 transition-all shadow-sm"
              />
            </div>
            <div className="space-y-1.5 group/field">
              <Label htmlFor="bairro" className="text-xs font-bold text-slate-600 dark:text-slate-400 group-focus-within/field:text-teal-500 transition-colors">Bairro</Label>
              <Input 
                id="bairro" 
                value={endereco.bairro ?? ''} 
                onChange={(e) => patchEndereco('bairro', e.target.value)} 
                className="rounded-xl bg-white/60 dark:bg-slate-900/60 border-white/40 dark:border-slate-800/40 focus-visible:ring-1 focus-visible:ring-teal-500/50 focus-visible:border-teal-500/50 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5 sm:col-span-2 group/field">
              <Label htmlFor="cidade" className="text-xs font-bold text-slate-600 dark:text-slate-400 group-focus-within/field:text-teal-500 transition-colors">Cidade</Label>
              <Input 
                id="cidade" 
                value={endereco.cidade ?? ''} 
                onChange={(e) => patchEndereco('cidade', e.target.value)} 
                className="rounded-xl bg-white/60 dark:bg-slate-900/60 border-white/40 dark:border-slate-800/40 focus-visible:ring-1 focus-visible:ring-teal-500/50 focus-visible:border-teal-500/50 transition-all shadow-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-600 dark:text-slate-400">UF</Label>
              <Select value={endereco.uf ?? ''} onValueChange={(v) => patchEndereco('uf', v)}>
                <SelectTrigger className="rounded-xl bg-white/60 dark:bg-slate-900/60 border-white/40 dark:border-slate-800/40 focus:ring-1 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all shadow-sm text-xs h-10">
                  <SelectValue placeholder="UF" />
                </SelectTrigger>
                <SelectContent className="rounded-xl bg-white/95 dark:bg-slate-950/95 border-white/20 dark:border-slate-800/40">
                  {ESTADOS.map((uf) => (
                    <SelectItem key={uf} value={uf} className="text-xs rounded-lg">{uf}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ação: Salvar */}
      <div className="pt-2">
        <Button 
          onClick={handleSubmit} 
          disabled={isPending}
          className="relative px-6 py-5.5 text-xs font-bold tracking-wider uppercase rounded-xl bg-gradient-to-r from-[#9A7D42] to-[#C5A059] hover:from-[#866B35] hover:to-[#B48F47] text-white border border-[#C5A059]/30 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 select-none overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
              Processando...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4.5 w-4.5 text-white/90 shrink-0" />
              Salvar Configurações
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
