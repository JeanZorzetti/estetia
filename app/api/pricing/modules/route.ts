import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // cache 1min

// Public endpoint — no auth needed. Used by /precos landing page.
export async function GET() {
  const modules = await prisma.pricingModule.findMany({
    where: { ativo: true },
    orderBy: [{ category: 'asc' }, { ordem: 'asc' }],
  })
  return NextResponse.json({ modules })
}
