import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { parsePeriodFromSearchParams } from '@/lib/analytics-clinico/period'
import { getProfessionalsProductivity } from '@/lib/analytics-clinico/queries'

export async function GET(req: Request) {
  const session = await getSession()
  if (!session?.user?.email) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) {
    return Response.json({ error: 'Org not found' }, { status: 404 })
  }

  const { searchParams } = new URL(req.url)
  const period = parsePeriodFromSearchParams({
    preset: searchParams.get('preset') ?? undefined,
    from: searchParams.get('from') ?? undefined,
    to: searchParams.get('to') ?? undefined,
  })

  const data = await getProfessionalsProductivity(user.organizationId, period)
  return Response.json({ data })
}
