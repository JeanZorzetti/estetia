import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { IndiqueClient } from './indique-client'

export const metadata: Metadata = {
  title: 'Programa de Indicação | Estetia CRM — Indique e Ganhe',
  description: 'Indique amigos e ganhe até 100% de desconto recorrente na sua mensalidade. Cada indicação ativa = 15% off. 7 indicações = mensalidade zerada.',
}

export default async function IndiquePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return <IndiqueClient />
}
