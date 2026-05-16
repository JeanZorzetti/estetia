'use client'

import { useRef, useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, Upload, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import { updateClinicaIdentidade } from '@/app/[locale]/dashboard/settings/clinica/actions'

const DEFAULT_COLORS = ['#0EA5E9', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899']

interface Props {
  initial: {
    logoUrl: string | null
    brandColor: string | null
    slogan: string | null
    orgName: string
  }
}

export function IdentidadeForm({ initial }: Props) {
  const [logoUrl, setLogoUrl] = useState<string | null>(initial.logoUrl)
  const [brandColor, setBrandColor] = useState(initial.brandColor ?? '#0EA5E9')
  const [slogan, setSlogan] = useState(initial.slogan ?? '')
  const [isPending, startTransition] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Arquivo muito grande (máx 2MB)')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setLogoUrl(reader.result as string)
    reader.readAsDataURL(file)
  }

  function handleSubmit() {
    startTransition(async () => {
      try {
        await updateClinicaIdentidade({ logoUrl, brandColor, slogan })
        toast.success('Identidade visual salva')
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Erro ao salvar')
      }
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Logo</CardTitle>
          <CardDescription>PNG, SVG ou JPG — máximo 2MB</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-muted/30 overflow-hidden">
              {logoUrl ? (
                <Image src={logoUrl} alt="Logo" width={80} height={80} className="object-contain" />
              ) : (
                <span className="text-2xl font-bold text-muted-foreground">
                  {initial.orgName.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/svg+xml" onChange={handleFile} className="hidden" />
              <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} type="button">
                <Upload className="h-3.5 w-3.5 mr-1.5" />
                Enviar logo
              </Button>
              {logoUrl && (
                <Button variant="ghost" size="sm" onClick={() => setLogoUrl(null)} type="button" className="text-destructive">
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  Remover
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cor da marca</CardTitle>
          <CardDescription>Usada em destaques visuais, e-mails e recibos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="color"
                value={brandColor}
                onChange={(e) => setBrandColor(e.target.value)}
                className="h-12 w-12 cursor-pointer rounded-lg border border-border/60 bg-transparent"
                aria-label="Cor primária da marca"
              />
            </div>
            <Input
              value={brandColor}
              onChange={(e) => setBrandColor(e.target.value)}
              className="max-w-[140px] font-mono uppercase"
              placeholder="#0EA5E9"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {DEFAULT_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setBrandColor(c)}
                aria-label={`Selecionar ${c}`}
                className="h-7 w-7 rounded-md border border-border/40 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Slogan</CardTitle>
          <CardDescription>Headline curta — usada em landing pública e e-mails</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={slogan}
            onChange={(e) => setSlogan(e.target.value)}
            placeholder="Ex: Beleza com tecnologia e cuidado."
            rows={2}
            maxLength={120}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1">{slogan.length}/120</p>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-border/60 p-5" style={{ borderTopWidth: '3px', borderTopColor: brandColor }}>
            <div className="flex items-center gap-3 mb-3">
              {logoUrl ? (
                <Image src={logoUrl} alt="Logo" width={32} height={32} className="rounded object-contain" />
              ) : (
                <div className="h-8 w-8 rounded flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: brandColor }}>
                  {initial.orgName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <span className="font-semibold">{initial.orgName}</span>
            </div>
            {slogan && <p className="text-sm text-muted-foreground italic">{slogan}</p>}
            <button
              type="button"
              disabled
              className="mt-3 rounded-md px-3 py-1.5 text-xs font-medium text-white opacity-100"
              style={{ backgroundColor: brandColor }}
            >
              Botão de exemplo
            </button>
          </div>
        </CardContent>
      </Card>

      <div>
        <Button onClick={handleSubmit} disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Salvar identidade
        </Button>
      </div>
    </div>
  )
}
