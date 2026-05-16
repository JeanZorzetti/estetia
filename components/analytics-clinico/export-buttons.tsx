'use client'

import { Button } from '@/components/ui/button'
import { Download, Printer } from 'lucide-react'

interface ExportButtonsProps {
  csvHref?: string
  csvFilename?: string
}

export function ExportButtons({ csvHref, csvFilename }: ExportButtonsProps) {
  function handlePrint() {
    window.print()
  }

  return (
    <div className="flex items-center gap-2 no-print">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrint}
        className="h-8 gap-1.5 text-xs"
      >
        <Printer className="w-3.5 h-3.5" />
        PDF
      </Button>
      {csvHref && (
        <Button variant="outline" size="sm" asChild className="h-8 gap-1.5 text-xs">
          <a href={csvHref} download={csvFilename ?? 'export.csv'}>
            <Download className="w-3.5 h-3.5" />
            CSV
          </a>
        </Button>
      )}
    </div>
  )
}
