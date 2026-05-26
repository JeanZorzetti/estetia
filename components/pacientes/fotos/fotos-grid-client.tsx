'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Upload, X, ZoomIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { EmptyState } from '@/components/pacientes/shared/empty-state'
import Image from 'next/image'
import { toast } from 'sonner'

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp']
const MAX_BYTES = 10 * 1024 * 1024

interface PatientPhoto {
  id: string
  url: string
  tipo: 'BEFORE' | 'AFTER' | 'EVOLUTION'
  areaCorpo: string | null
  anguloPadronizado: string | null
  createdAt: string
  consentimentoConcedido: boolean
}

interface Props {
  fotos: PatientPhoto[]
  patientId: string
  canUpload: boolean
}

const TIPO_LABELS: Record<string, { label: string; bg: string; text: string }> = {
  BEFORE: { label: 'Antes', bg: 'bg-navy/10 border-navy/20', text: 'text-navy dark:text-navy-200' },
  AFTER: { label: 'Depois', bg: 'bg-teal-500/10 border-teal-500/20', text: 'text-teal-600 dark:text-teal-400' },
  EVOLUTION: { label: 'Evolução', bg: 'bg-gold-500/10 border-gold-500/20', text: 'text-gold-600 dark:text-gold-400' },
}

const TIPO_FILTERS = ['TODOS', 'BEFORE', 'AFTER', 'EVOLUTION'] as const

export function FotosGridClient({ fotos, patientId, canUpload }: Props) {
  const router = useRouter()
  const [filter, setFilter] = useState<'TODOS' | 'BEFORE' | 'AFTER' | 'EVOLUTION'>('TODOS')
  const [lightbox, setLightbox] = useState<PatientPhoto | null>(null)
  const [uploading, setUploading] = useState(false)

  const filtered = filter === 'TODOS' ? fotos : fotos.filter(f => f.tipo === filter)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!ALLOWED_MIME.includes(file.type)) {
      toast.error('Formato não suportado. Use JPG, PNG ou WEBP.')
      e.target.value = ''
      return
    }
    if (file.size > MAX_BYTES) {
      toast.error('Arquivo maior que 10MB.')
      e.target.value = ''
      return
    }

    setUploading(true)
    try {
      // 1. Solicitar presigned URL
      const presignRes = await fetch('/api/clinica/fotos/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId, contentType: file.type }),
      })
      if (!presignRes.ok) throw new Error('Falha ao iniciar upload')
      const { uploadUrl, publicUrl } = await presignRes.json()

      // 2. PUT direto no MinIO com a URL assinada
      const putRes = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      })
      if (!putRes.ok) throw new Error('Falha ao enviar para o storage')

      // 3. Persistir registro no DB
      const saveRes = await fetch('/api/clinica/fotos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          url: publicUrl,
          tipo: 'EVOLUTION',
          consentimentoConcedido: true,
        }),
      })
      if (!saveRes.ok) throw new Error('Upload feito, mas falhou ao salvar registro')

      toast.success('Foto enviada com sucesso')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro no upload')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Filter + upload bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-1 bg-muted/20 p-1 rounded-xl border border-border/40">
          {TIPO_FILTERS.map(tipo => (
            <button
              key={tipo}
              onClick={() => setFilter(tipo)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200',
                filter === tipo
                  ? 'bg-navy text-white shadow-sm'
                  : 'text-muted-foreground hover:text-navy'
              )}
            >
              {tipo === 'TODOS' ? 'Todas' : TIPO_LABELS[tipo].label}
              <span className="ml-1.5 text-[10px] opacity-70">
                ({tipo === 'TODOS' ? fotos.length : fotos.filter(f => f.tipo === tipo).length})
              </span>
            </button>
          ))}
        </div>
        {canUpload && (
          <label className={cn('cursor-pointer', uploading && 'opacity-50 pointer-events-none')}>
            <Button asChild size="sm" className="rounded-xl bg-navy hover:bg-navy/90 text-white text-xs font-bold h-9 px-4 gap-1.5 cursor-pointer">
              <span>
                <Upload className="w-3.5 h-3.5" />
                {uploading ? 'Enviando...' : 'Upload foto'}
              </span>
            </Button>
            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Camera}
          title="Nenhuma foto encontrada"
          description="Registre fotos clínicas antes e após procedimentos"
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map(foto => {
            const t = TIPO_LABELS[foto.tipo]
            return (
              <div
                key={foto.id}
                className="relative group rounded-2xl overflow-hidden border border-border/40 bg-muted/20 aspect-square cursor-pointer hover:border-teal-500/30 transition-all duration-200 shadow-sm hover:shadow-md"
                onClick={() => setLightbox(foto)}
              >
                <Image
                  src={foto.url}
                  alt={`${foto.tipo} - ${foto.areaCorpo ?? ''}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                  <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
                <div className={cn('absolute top-2 left-2 px-2 py-0.5 rounded-md border text-[10px] font-bold leading-tight', t.bg, t.text)}>
                  {t.label}
                </div>
                {!foto.consentimentoConcedido && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-500/80 flex items-center justify-center" title="Sem consentimento">
                    <span className="text-white text-[8px] font-black">!</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh] w-full" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>
            <Image
              src={lightbox.url}
              alt="Foto clínica"
              width={900}
              height={700}
              className="rounded-2xl object-contain max-h-[80vh] w-auto mx-auto"
            />
            <div className="mt-3 text-center text-xs text-white/70">
              {TIPO_LABELS[lightbox.tipo].label}
              {lightbox.areaCorpo && ` · ${lightbox.areaCorpo}`}
              {lightbox.anguloPadronizado && ` · ${lightbox.anguloPadronizado}`}
              {' · '}{new Date(lightbox.createdAt).toLocaleDateString('pt-BR')}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
