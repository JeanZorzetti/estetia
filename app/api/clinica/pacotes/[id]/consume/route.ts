import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { requireModule } from '@/lib/guards/require-module'

/**
 * POST /api/clinica/pacotes/[id]/consume
 * Incrementa sessoesUtilizadas e atualiza status se necessário.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const gate = await requireModule('pacotes')
  if (!gate.allowed) return NextResponse.json({ error: 'Módulo não ativo' }, { status: 403 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'No org' }, { status: 403 })

  const { id } = await params
  const pacote = await prisma.sessionPackage.findFirst({
    where: { id, organizationId: user.organizationId },
  })
  if (!pacote) return NextResponse.json({ error: 'Pacote não encontrado' }, { status: 404 })

  if (pacote.status !== 'ATIVO') {
    return NextResponse.json({ error: 'Pacote não está ativo' }, { status: 400 })
  }

  if (pacote.sessoesUtilizadas >= pacote.sessoesTotais) {
    return NextResponse.json({ error: 'Todas as sessões já foram utilizadas' }, { status: 400 })
  }

  if (pacote.expiraEm && pacote.expiraEm < new Date()) {
    await prisma.sessionPackage.update({ where: { id }, data: { status: 'EXPIRADO' } })
    return NextResponse.json({ error: 'Pacote expirado' }, { status: 400 })
  }

  const novasUtilizadas = pacote.sessoesUtilizadas + 1
  const concluido = novasUtilizadas >= pacote.sessoesTotais

  const updated = await prisma.sessionPackage.update({
    where: { id },
    data: {
      sessoesUtilizadas: novasUtilizadas,
      status: concluido ? 'CONCLUIDO' : 'ATIVO',
    },
  })

  return NextResponse.json({
    ...updated,
    sessoesRestantes: updated.sessoesTotais - updated.sessoesUtilizadas,
  })
}
