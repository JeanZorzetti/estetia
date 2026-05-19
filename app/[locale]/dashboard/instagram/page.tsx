import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { InstagramDashboard } from '@/components/instagram/instagram-dashboard'
import { getTranslations } from 'next-intl/server'
import { requireModule } from '@/lib/guards/require-module'
import { ModuleLocked } from '@/components/upgrade/module-locked'

export const metadata = { title: 'Instagram Bot - Estetia CRM' }
export const dynamic = 'force-dynamic'

export default async function InstagramPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'dashboard' })
  const session = await getSession()
  if (!session?.user) return <div>{t('errors.unauthorized')}</div>

  const gate = await requireModule('instagram')
  if (!gate.allowed) return <ModuleLocked slug={gate.slug} />

  const organizationId = session.user.organizationId
  const raw = await prisma.instagramPost.findMany({
    where: { organizationId },
    orderBy: { scheduledFor: 'desc' },
    take: 100,
    include: {
      _count: { select: { comments: true } },
    },
  })

  const posts = raw.map(p => ({
    ...p,
    scheduledFor: p.scheduledFor.toISOString(),
    postedAt: p.postedAt?.toISOString() ?? null,
    approvedAt: p.approvedAt?.toISOString() ?? null,
    recurrenceEndDate: p.recurrenceEndDate?.toISOString() ?? null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }))

  return <InstagramDashboard initialPosts={posts} />
}
