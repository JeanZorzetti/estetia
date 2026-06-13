import { setRequestLocale } from 'next-intl/server'
import { ExperienceV2Client } from './experience-v2-client'

export default async function ExperienceV2Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return <ExperienceV2Client />
}
