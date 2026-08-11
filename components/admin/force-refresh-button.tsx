'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { forceRefreshFunnel } from '@/app/[locale]/(admin)/admin/funnel/actions'
import { useRouter } from 'next/navigation'
import logger from '@/lib/logger'

export function ForceRefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await forceRefreshFunnel()
      router.refresh()
    } catch (error) {
      logger.error({ error }, 'Error refreshing funnel:')
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
      {isRefreshing ? 'Atualizando...' : 'Atualizar Cache'}
    </Button>
  )
}
