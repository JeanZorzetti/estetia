'use client'

import { useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'

interface Props {
  id: string
  onClick: () => void
  height: number
  isHourBoundary?: boolean
}

export function TimeSlot({ id, onClick, height, isHourBoundary }: Props) {
  const { isOver, setNodeRef } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      style={{ height: `${height}px` }}
      className={cn(
        'border-b border-border/30 transition-colors cursor-pointer',
        isHourBoundary && 'border-b-border/50',
        isOver && 'bg-primary/10 ring-2 ring-primary ring-inset',
        'hover:bg-muted/20',
      )}
    />
  )
}
