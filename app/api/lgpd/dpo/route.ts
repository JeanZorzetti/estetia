import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DpoUpdateSchema } from '@/lib/lgpd/schema'

async function getUser() {
  const session = await getSession()
  if (!session?.user?.email) return null
  return prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true, orgRole: true },
  })
}

export async function GET() {
  const user = await getUser()
  if (!user?.organizationId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const org = await prisma.organization.findUnique({
    where: { id: user.organizationId },
    select: { dpoName: true, dpoEmail: true, dpoPhone: true, dpoCpf: true },
  })
  return NextResponse.json({ dpo: org })
}

export async function PUT(req: Request) {
  const user = await getUser()
  if (!user?.organizationId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.orgRole === 'MEMBER') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const parsed = DpoUpdateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const data: Record<string, string | null> = {}
  for (const [k, v] of Object.entries(parsed.data)) {
    data[k] = v === '' ? null : (v ?? null)
  }

  const org = await prisma.organization.update({
    where: { id: user.organizationId },
    data,
    select: { dpoName: true, dpoEmail: true, dpoPhone: true, dpoCpf: true },
  })
  return NextResponse.json({ dpo: org })
}
