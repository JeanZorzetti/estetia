import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { buildGuiaXml } from '@/lib/tiss/xml-generator'

async function getOrgId() {
  const session = await getSession()
  if (!session?.user?.email) return null
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  return user?.organizationId ?? null
}

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const orgId = await getOrgId()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params

  const guia = await prisma.guiaTiss.findFirst({
    where: { id, organizationId: orgId },
    include: {
      operadora: true,
      paciente: { select: { nome: true, cpf: true, dataNascimento: true, sexo: true } },
    },
  })
  if (!guia) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { name: true },
  })

  const prestador = {
    cnpj: '00000000000000',
    nome: org?.name ?? 'Clínica',
    cnes: '0000000',
    codigoPrestadorNaOperadora: '00000000',
  }

  const operadora = {
    codigoAns: guia.operadora.codigoAns ?? '000000',
    cnpj: guia.operadora.cnpj ?? undefined,
    nome: guia.operadora.nome,
  }

  const xml = buildGuiaXml(
    {
      id: guia.id,
      numeroGuia: guia.numeroGuia,
      tipo: guia.tipo as 'CONSULTA' | 'SADT' | 'INTERNACAO' | 'SP_SADT' | 'HONORARIOS',
      codigoTuss: guia.codigoTuss,
      valorProcedimento: guia.valorProcedimento != null ? Number(guia.valorProcedimento) : null,
      valorTotal: guia.valorTotal != null ? Number(guia.valorTotal) : null,
      dataExecucao: guia.dataExecucao,
      paciente: guia.paciente,
    },
    operadora,
    prestador,
  )

  const updated = await prisma.guiaTiss.update({
    where: { id },
    data: {
      xmlEnviado: xml,
      status: 'ENVIADA',
      numeroGuia: guia.numeroGuia ?? guia.id.slice(0, 20),
    },
  })

  return NextResponse.json({
    guia: {
      ...updated,
      valorProcedimento: updated.valorProcedimento != null ? Number(updated.valorProcedimento) : null,
      valorTotal: updated.valorTotal != null ? Number(updated.valorTotal) : null,
    },
    xml,
  })
}
