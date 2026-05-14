import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/booking/[clinicaSlug]/professionals?procedureId=
// Public — no auth required
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ clinicaSlug: string }> }
) {
  const { clinicaSlug } = await params
  const { searchParams } = new URL(req.url)
  const procedureId = searchParams.get('procedureId')

  const org = await prisma.organization.findUnique({
    where: { slug: clinicaSlug },
    select: { id: true },
  })

  if (!org) {
    return NextResponse.json({ error: 'Clínica não encontrada' }, { status: 404 })
  }

  // If procedureId given, filter to professionals enabled for that procedure
  let procedureFilter: { id: string; profissionaisHabilitadosIds: { has: string } } | undefined

  if (procedureId) {
    const proc = await prisma.procedure.findFirst({
      where: { id: procedureId, organizationId: org.id },
      select: { id: true, profissionaisHabilitadosIds: true },
    })

    // If procedure has specific enabled professionals, filter by them
    if (proc && proc.profissionaisHabilitadosIds.length > 0) {
      const professionals = await prisma.professional.findMany({
        where: {
          organizationId: org.id,
          id: { in: proc.profissionaisHabilitadosIds },
        },
        select: {
          id: true,
          nome: true,
          especialidades: true,
          bio: true,
          fotoUrl: true,
        },
        orderBy: { nome: 'asc' },
      })

      return NextResponse.json({ professionals })
    }
  }

  // Default: all professionals in the org
  const professionals = await prisma.professional.findMany({
    where: { organizationId: org.id },
    select: {
      id: true,
      nome: true,
      especialidades: true,
      bio: true,
      fotoUrl: true,
    },
    orderBy: { nome: 'asc' },
  })

  return NextResponse.json({ professionals })
}
