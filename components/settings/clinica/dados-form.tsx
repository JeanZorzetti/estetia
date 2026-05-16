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
import { Loader2, Search } from 'lucide-react'
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Identificação jurídica</CardTitle>
          <CardDescription>Aparece em recibos, NF-Se, TISS e contratos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                placeholder="00.000.000/0000-00"
                value={cnpj}
                onChange={(e) => handleCnpjChange(e.target.value)}
                onBlur={handleCnpjBlur}
                aria-invalid={!!cnpjError}
                className={cnpjError ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
              {cnpjError && <p className="text-xs text-destructive">{cnpjError}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rs">Razão social</Label>
              <Input id="rs" value={razaoSocial} onChange={(e) => setRazaoSocial(e.target.value)} placeholder="Clínica X Ltda." />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="ie">Inscrição estadual</Label>
              <Input id="ie" value={ie} onChange={(e) => setIe(e.target.value)} placeholder="000.000.000.000" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="im">Inscrição municipal</Label>
              <Input id="im" value={im} onChange={(e) => setIm(e.target.value)} placeholder="0000000" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Endereço da clínica</CardTitle>
          <CardDescription>Use o CEP para preencher automaticamente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="cep">CEP</Label>
              <div className="flex gap-2">
                <Input
                  id="cep"
                  value={endereco.cep ?? ''}
                  onChange={(e) => patchEndereco('cep', e.target.value)}
                  placeholder="00000-000"
                />
                <Button type="button" variant="outline" size="icon" onClick={lookupCep} disabled={cepLoading} aria-label="Buscar CEP">
                  {cepLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="rua">Rua / Avenida</Label>
              <Input id="rua" value={endereco.rua ?? ''} onChange={(e) => patchEndereco('rua', e.target.value)} />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="num">Número</Label>
              <Input id="num" value={endereco.numero ?? ''} onChange={(e) => patchEndereco('numero', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="compl">Complemento</Label>
              <Input id="compl" value={endereco.complemento ?? ''} onChange={(e) => patchEndereco('complemento', e.target.value)} placeholder="Sala 101" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bairro">Bairro</Label>
              <Input id="bairro" value={endereco.bairro ?? ''} onChange={(e) => patchEndereco('bairro', e.target.value)} />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input id="cidade" value={endereco.cidade ?? ''} onChange={(e) => patchEndereco('cidade', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>UF</Label>
              <Select value={endereco.uf ?? ''} onValueChange={(v) => patchEndereco('uf', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="UF" />
                </SelectTrigger>
                <SelectContent>
                  {ESTADOS.map((uf) => (
                    <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <Button onClick={handleSubmit} disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Salvar dados
        </Button>
      </div>
    </div>
  )
}
