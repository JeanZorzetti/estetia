'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, Copy } from 'lucide-react'
import { useState } from 'react'

interface Props {
  xml: string | null
  title: string
  filename: string
}

export function XmlViewer({ xml, title, filename }: Props) {
  const [copied, setCopied] = useState(false)

  if (!xml) {
    return (
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground italic">Ainda não gerado.</p>
        </CardContent>
      </Card>
    )
  }

  const download = () => {
    const blob = new Blob([xml], { type: 'application/xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const copy = async () => {
    await navigator.clipboard.writeText(xml)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">{title}</CardTitle>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={copy}>
            <Copy className="w-3.5 h-3.5 mr-1.5" />
            {copied ? 'Copiado!' : 'Copiar'}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={download}>
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Baixar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <pre className="text-xs bg-muted/40 rounded-lg p-3 overflow-auto max-h-96 font-mono leading-relaxed border border-border/30">
          {xml}
        </pre>
      </CardContent>
    </Card>
  )
}
