import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // cache 1min

// Public endpoint — no auth needed. Used by /precos landing page.
// Supports `?slug=` to fetch a single module (powers the in-app upgrade modal).
export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get('slug')

  if (slug) {
    const module_ = await prisma.pricingModule.findUnique({ where: { slug } })
    if (!module_ || !module_.ativo) {
      return NextResponse.json({ module: null }, { status: 404 })
    }
    return NextResponse.json({ module: module_ })
  }

  const modules = await prisma.pricingModule.findMany({
    where: { ativo: true },
    orderBy: [{ category: 'asc' }, { ordem: 'asc' }],
  })
  return NextResponse.json({ modules })
}
