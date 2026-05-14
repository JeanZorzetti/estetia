import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { markGuiaEnviada, markGuiaGlosada } from '@/lib/integrations/tiss/guia-service'
import { emitNfse } from '@/lib/integrations/nfse/provider-adapter'
import { z } from 'zod'

const UpdateStatusSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('enviar') }),
  z.object({ action: z.literal('glosar'), motivoGlosa: z.string().min(1) }),
  z.object({ action: z.literal('pagar') }),
  z.object({ action: z.literal('cancelar') }),
  z.object({ action: z.literal('emitir_nfse'), tomadorEmail: z.string().email().optional() }),
])

// GET — download XML
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'No org' }, { status: 403 })

  const guia = await prisma.guiaTiss.findFirst({
    where: { id, organizationId: user.organizationId },
    include: {
      operadora: { select: { nome: true } },
      paciente: { select: { nome: true } },
    },
  })

  if (!guia) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({
    guia: {
      ...guia,
      valorProcedimento: guia.valorProcedimento ? Number(guia.valorProcedimento) : null,
      valorTotal: guia.valorTotal ? Number(guia.valorTotal) : null,
    },
  })
}

// PATCH — transition status or emit NFS-e
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'No org' }, { status: 403 })

  const guia = await prisma.guiaTiss.findFirst({
    where: { id, organizationId: user.organizationId },
    include: {
      paciente: { select: { nome: true, email: true } },
      operadora: { select: { codigoAns: true } },
    },
  })
  if (!guia) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const parsed = UpdateStatusSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid action', details: parsed.error.flatten() }, { status: 400 })
  }

  const { action } = parsed.data

  if (action === 'enviar') {
    await markGuiaEnviada(id)
    return NextResponse.json({ ok: true, status: 'ENVIADA' })
  }

  if (action === 'glosar') {
    await markGuiaGlosada(id, (parsed.data as { motivoGlosa: string }).motivoGlosa)
    return NextResponse.json({ ok: true, status: 'GLOSADA' })
  }

  if (action === 'pagar') {
    await prisma.guiaTiss.update({ where: { id }, data: { status: 'PAGA' } })
    return NextResponse.json({ ok: true, status: 'PAGA' })
  }

  if (action === 'cancelar') {
    await prisma.guiaTiss.update({ where: { id }, data: { status: 'CANCELADA' } })
    return NextResponse.json({ ok: true, status: 'CANCELADA' })
  }

  if (action === 'emitir_nfse') {
    const prestadorCnpj = process.env.NFSE_PRESTADOR_CNPJ ?? ''
    const prestadorIM = process.env.NFSE_PRESTADOR_IM ?? ''
    const codigoMunicipio = process.env.NFSE_MUNICIPIO_IBGE ?? '3550308' // SP padrão

    if (!prestadorCnpj || !prestadorIM) {
      return NextResponse.json(
        { error: 'NFSE_PRESTADOR_CNPJ or NFSE_PRESTADOR_IM not configured' },
        { status: 503 }
      )
    }

    const result = await emitNfse({
      guiaTissId: id,
      tomadorNome: guia.paciente.nome,
      tomadorEmail: (parsed.data as { tomadorEmail?: string }).tomadorEmail ?? guia.paciente.email ?? undefined,
      prestadorCnpj,
      prestadorInscricaoMunicipal: prestadorIM,
      codigoMunicipio,
      discriminacao: `Procedimento estético — Guia ${guia.numeroGuia}`,
      valorServicos: guia.valorTotal ? Number(guia.valorTotal) : 0,
      codigoServico: process.env.NFSE_CODIGO_SERVICO ?? '14.01',
      aliquotaIss: parseFloat(process.env.NFSE_ALIQUOTA_ISS ?? '0.05'),
    })

    return NextResponse.json({ ok: result.ok, nfse: result })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
