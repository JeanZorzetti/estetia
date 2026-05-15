import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function getOrgId() {
  const session = await getSession()
  if (!session?.user?.email) return null
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  return user?.organizationId ?? null
}

export async function GET() {
  const orgId = await getOrgId()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const now = new Date()
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1)

  const guias = await prisma.guiaTiss.findMany({
    where: {
      organizationId: orgId,
      createdAt: { gte: twelveMonthsAgo },
    },
    select: {
      createdAt: true,
      valorTotal: true,
      status: true,
    },
  })

  // Build buckets for last 12 months
  const buckets: Record<string, { recebido: number; aReceber: number; glosado: number }> = {}
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    buckets[key] = { recebido: 0, aReceber: 0, glosado: 0 }
  }

  for (const g of guias) {
    const key = `${g.createdAt.getFullYear()}-${String(g.createdAt.getMonth() + 1).padStart(2, '0')}`
    if (!buckets[key]) continue
    const valor = g.valorTotal != null ? Number(g.valorTotal) : 0
    if (g.status === 'PAGA') buckets[key].recebido += valor
    else if (g.status === 'GLOSADA' || g.status === 'NEGADA') buckets[key].glosado += valor
    else if (g.status === 'ENVIADA' || g.status === 'AUTORIZADA') buckets[key].aReceber += valor
  }

  const data = Object.entries(buckets).map(([key, v]) => {
    const [year, month] = key.split('-')
    const label = new Date(Number(year), Number(month) - 1, 1).toLocaleDateString('pt-BR', { month: 'short' })
    return { mes: label, ...v }
  })

  return NextResponse.json({ data })
}
