import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'Org not found' }, { status: 404 })

  const sp = new URL(req.url).searchParams
  const q = sp.get('q') ?? ''
  const statusFilter = sp.get('status') ?? ''

  const professionals = await prisma.professional.findMany({
    where: {
      organizationId: user.organizationId,
      ativo: true,
      ...(q ? { nome: { contains: q, mode: 'insensitive' } } : {}),
      ...(statusFilter ? { conselhoStatus: statusFilter } : {}),
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          orgRole: true,
          categoria: true,
          jobTitle: true,
          pipelineRestricted: true,
          allowedPipelineIds: true,
        },
      },
    },
    orderBy: { nome: 'asc' },
  })

  return NextResponse.json(professionals)
}
