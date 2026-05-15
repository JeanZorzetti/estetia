'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Upload, X, Loader2, ImageIcon } from 'lucide-react'

interface Props {
  initialSignedUrl?: string | null
  onChange: (key: string | null, signedUrl: string | null) => void
}

const OUTPUT_SIZE = 400 // 400×400px JPEG

export function PhotoUpload({ initialSignedUrl, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [preview, setPreview] = useState<string | null>(initialSignedUrl ?? null)
  const [cropOpen, setCropOpen] = useState(false)
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Crop state
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [imgNaturalSize, setImgNaturalSize] = useState({ w: 0, h: 0 })
  const dragRef = useRef<{ dragging: boolean; startX: number; startY: number; origX: number; origY: number } | null>(null)

  useEffect(() => { setPreview(initialSignedUrl ?? null) }, [initialSignedUrl])

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Formato inválido. Use JPEG, PNG ou WEBP.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Arquivo muito grande (máx 5MB).')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setImgSrc(reader.result as string)
      setZoom(1)
      setOffset({ x: 0, y: 0 })
      setCropOpen(true)
    }
    reader.readAsDataURL(file)
  }

  const onImgLoad = () => {
    const img = imgRef.current
    if (!img) return
    setImgNaturalSize({ w: img.naturalWidth, h: img.naturalHeight })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    dragRef.current = { dragging: true, startX: e.clientX, startY: e.clientY, origX: offset.x, origY: offset.y }
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current?.dragging) return
    setOffset({
      x: dragRef.current.origX + (e.clientX - dragRef.current.startX),
      y: dragRef.current.origY + (e.clientY - dragRef.current.startY),
    })
  }
  const handleMouseUp = () => {
    if (dragRef.current) dragRef.current.dragging = false
  }

  const confirmCrop = async () => {
    const img = imgRef.current
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!img || !container || !canvas) return

    setUploading(true)
    setError(null)

    try {
      const containerSize = container.offsetWidth // square
      const displayedW = img.offsetWidth * zoom
      const displayedH = img.offsetHeight * zoom

      // Source rect: which portion of the natural image is inside the container after pan/zoom
      const scale = imgNaturalSize.w / img.offsetWidth // natural / displayed-base
      const srcX = (-offset.x / zoom) * scale
      const srcY = (-offset.y / zoom) * scale
      const srcSize = (containerSize / zoom) * scale

      canvas.width = OUTPUT_SIZE
      canvas.height = OUTPUT_SIZE
      const ctx = canvas.getContext('2d')!
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE)
      ctx.drawImage(
        img,
        Math.max(0, srcX),
        Math.max(0, srcY),
        Math.min(imgNaturalSize.w, srcSize),
        Math.min(imgNaturalSize.h, srcSize),
        0,
        0,
        OUTPUT_SIZE,
        OUTPUT_SIZE,
      )

      const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/jpeg', 0.85))
      if (!blob) throw new Error('Falha ao gerar imagem')

      const formData = new FormData()
      formData.append('file', blob, 'photo.jpg')
      const res = await fetch('/api/professionals/upload-photo', { method: 'POST', body: formData })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Falha no upload')
      }
      const data = await res.json()
      onChange(data.key, data.signedUrl)
      setPreview(data.signedUrl)
      setCropOpen(false)
      setImgSrc(null)
      void displayedW; void displayedH
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro')
    } finally {
      setUploading(false)
    }
  }

  const remove = () => {
    setPreview(null)
    onChange(null, null)
  }

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-medium">Foto</Label>
      <div className="flex items-start gap-4">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-muted border-2 border-border flex items-center justify-center flex-shrink-0">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Foto" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-8 h-8 text-muted-foreground/40" />
          )}
        </div>
        <div className="flex flex-col gap-2 pt-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={onFileSelect}
          />
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              {preview ? 'Trocar foto' : 'Enviar foto'}
            </Button>
            {preview && (
              <Button type="button" variant="ghost" size="sm" onClick={remove} className="text-destructive">
                <X className="w-3.5 h-3.5 mr-1.5" />
                Remover
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">JPEG, PNG ou WEBP · máx 5MB · crop 1:1 automático</p>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      </div>

      <Dialog open={cropOpen} onOpenChange={(v) => { if (!v) { setCropOpen(false); setImgSrc(null) } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajustar foto</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-2">
            <div
              ref={containerRef}
              className="relative w-full aspect-square overflow-hidden bg-muted rounded-full border-2 border-border cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {imgSrc && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  ref={imgRef}
                  src={imgSrc}
                  alt="Crop preview"
                  draggable={false}
                  onLoad={onImgLoad}
                  className="absolute select-none pointer-events-none"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${zoom})`,
                    maxWidth: 'none',
                    width: '100%',
                    height: 'auto',
                  }}
                />
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Zoom: {zoom.toFixed(2)}x</Label>
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={zoom}
                onChange={e => setZoom(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <p className="text-xs text-muted-foreground">Arraste a imagem dentro do círculo para reposicionar.</p>
            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => { setCropOpen(false); setImgSrc(null) }}>Cancelar</Button>
              <Button onClick={confirmCrop} disabled={uploading}>
                {uploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Salvar foto
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
