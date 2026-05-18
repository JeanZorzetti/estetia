'use client'

import { createContext, useContext, useMemo } from 'react'
import { hasModuleAccess } from '@/lib/module-map'

export type ActiveModulesContextValue = {
  activeModules: string[]
  trialActive: boolean
}

const ActiveModulesContext = createContext<ActiveModulesContextValue>({
  activeModules: [],
  trialActive: false,
})

export function ActiveModulesProvider({
  value,
  children,
}: {
  value: ActiveModulesContextValue
  children: React.ReactNode
}) {
  const memo = useMemo(() => value, [value.activeModules.join(','), value.trialActive])
  return <ActiveModulesContext.Provider value={memo}>{children}</ActiveModulesContext.Provider>
}

export function useActiveModules() {
  return useContext(ActiveModulesContext)
}

export function useModuleAccess(slug: string | null): boolean {
  const { activeModules, trialActive } = useActiveModules()
  return hasModuleAccess(slug, activeModules, trialActive)
}
