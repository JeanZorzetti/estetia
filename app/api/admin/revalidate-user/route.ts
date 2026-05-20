import { NextRequest, NextResponse } from 'next/server'
import { revalidateDashboardUser } from '@/lib/dashboard-user'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const me = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { isRoiLabsStaff: true },
  })
  if (!me?.isRoiLabsStaff) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json().catch(() => ({}))
  const email = body.email ?? session.user.email

  await revalidateDashboardUser(email)
  return NextResponse.json({ ok: true, revalidated: email })
}
