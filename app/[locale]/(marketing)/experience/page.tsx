import { setRequestLocale } from 'next-intl/server'
import { ExperienceClient } from './experience-client'

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return <ExperienceClient />
}
