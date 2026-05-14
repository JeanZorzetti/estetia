import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/booking/[clinicaSlug]/procedures
// Public — no auth required
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ clinicaSlug: string }> }
) {
  const { clinicaSlug } = await params

  const org = await prisma.organization.findUnique({
    where: { slug: clinicaSlug },
    select: { id: true, name: true },
  })

  if (!org) {
    return NextResponse.json({ error: 'Clínica não encontrada' }, { status: 404 })
  }

  const procedures = await prisma.procedure.findMany({
    where: { organizationId: org.id },
    select: {
      id: true,
      nome: true,
      categoria: true,
      duracaoMinutos: true,
      valorPadrao: true,
    },
    orderBy: { nome: 'asc' },
  })

  return NextResponse.json({
    orgName: org.name,
    procedures: procedures.map((p: { id: string; nome: string; categoria: string | null; duracaoMinutos: number; valorPadrao: unknown }) => ({
      ...p,
      valorPadrao: p.valorPadrao != null ? Number(p.valorPadrao) : null,
    })),
  })
}
