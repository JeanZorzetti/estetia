/**
 * TISS Guia Service — orchestrates creating + sending TISS guides.
 *
 * For MVP: generates XML and persists it in GuiaTiss.xmlEnviado.
 * Real SOAP submission to operadora requires per-operadora endpoint config
 * (out of Sprint 4 scope — marked with TODO).
 */

import { prisma } from '@/lib/prisma'
import logger from '@/lib/logger'
import {
  buildGuiaConsulta,
  buildGuiaSadt,
  type TissGuiaConsultaParams,
  type TissGuiaSadtParams,
} from './xml-builder'

// Generate a sequential guide number: ORG_PREFIX-YYYYMMDD-SEQ
async function generateGuiaNumber(organizationId: string): Promise<string> {
  const today = new Date()
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '')
  const count = await prisma.guiaTiss.count({
    where: { organizationId },
  })
  const seq = String(count + 1).padStart(5, '0')
  return `${organizationId.slice(0, 6).toUpperCase()}-${dateStr}-${seq}`
}

export interface CreateGuiaConsultaInput {
  organizationId: string
  operadoraId: string
  pacienteId: string
  sessionId?: string
  codigoTuss: string
  descricaoTuss: string
  dataExecucao: Date
  valorProcedimento: number
  // TISS structural data
  registroANS: string
  codigoPrestador: string
  nomeContratado: string
  numeroBeneficiario: string
  nomePaciente: string
  dataNascimentoPaciente: string   // DD/MM/YYYY
  nomeProfissional: string
  conselhoProfissional: string
  numeroCRM: string
  ufCRM: string
}

export async function createGuiaConsulta(input: CreateGuiaConsultaInput) {
  const numeroGuia = await generateGuiaNumber(input.organizationId)

  const params: TissGuiaConsultaParams = {
    numeroGuia,
    dataAtendimento: input.dataExecucao
      .toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
      .replace(/\//g, '/'),
    operadora: { registroANS: input.registroANS },
    contratado: {
      codigoPrestadorNaOperadora: input.codigoPrestador,
      nomeContratado: input.nomeContratado,
    },
    beneficiario: {
      numeroCarteira: input.numeroBeneficiario,
      nomePaciente: input.nomePaciente,
      dataNascimento: input.dataNascimentoPaciente,
    },
    profissional: {
      nome: input.nomeProfissional,
      conselho: input.conselhoProfissional,
      numero: input.numeroCRM,
      uf: input.ufCRM,
    },
    codigoProcedimento: input.codigoTuss,
    descricaoProcedimento: input.descricaoTuss,
    quantidadeExecutada: 1,
    valorProcedimento: input.valorProcedimento,
  }

  const xmlEnviado = buildGuiaConsulta(params)

  const guia = await prisma.guiaTiss.create({
    data: {
      organizationId: input.organizationId,
      operadoraId: input.operadoraId,
      pacienteId: input.pacienteId,
      sessionId: input.sessionId ?? null,
      tipo: 'CONSULTA',
      status: 'RASCUNHO',
      numeroGuia,
      codigoTuss: input.codigoTuss,
      valorProcedimento: input.valorProcedimento,
      valorTotal: input.valorProcedimento,
      dataExecucao: input.dataExecucao,
      xmlEnviado,
    },
  })

  logger.info({ guiaId: guia.id, numeroGuia }, 'Guia TISS consulta gerada')
  return guia
}

export interface CreateGuiaSadtInput {
  organizationId: string
  operadoraId: string
  pacienteId: string
  sessionId?: string
  dataExecucao: Date
  // TISS structural data
  registroANS: string
  codigoPrestador: string
  nomeContratado: string
  cnes?: string
  numeroBeneficiario: string
  nomePaciente: string
  dataNascimentoPaciente: string
  nomeProfissional: string
  conselhoProfissional: string
  numeroCRM: string
  ufCRM: string
  procedimentos: Array<{
    codigoTuss: string
    descricao: string
    quantidade: number
    valorUnitario: number
  }>
}

export async function createGuiaSadt(input: CreateGuiaSadtInput) {
  const numeroGuia = await generateGuiaNumber(input.organizationId)
  const valorTotal = input.procedimentos.reduce((s, p) => s + p.valorUnitario * p.quantidade, 0)
  const codigoTussPrincipal = input.procedimentos[0]?.codigoTuss ?? ''

  const params: TissGuiaSadtParams = {
    numeroGuia,
    dataExecucao: input.dataExecucao
      .toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    operadora: { registroANS: input.registroANS },
    contratado: {
      codigoPrestadorNaOperadora: input.codigoPrestador,
      nomeContratado: input.nomeContratado,
      cnes: input.cnes,
    },
    beneficiario: {
      numeroCarteira: input.numeroBeneficiario,
      nomePaciente: input.nomePaciente,
      dataNascimento: input.dataNascimentoPaciente,
    },
    profissional: {
      nome: input.nomeProfissional,
      conselho: input.conselhoProfissional,
      numero: input.numeroCRM,
      uf: input.ufCRM,
    },
    procedimentos: input.procedimentos.map(p => ({
      codigoTabela: '22',
      codigoProcedimento: p.codigoTuss,
      descricao: p.descricao,
      quantidade: p.quantidade,
      valorUnitario: p.valorUnitario,
    })),
  }

  const xmlEnviado = buildGuiaSadt(params)

  const guia = await prisma.guiaTiss.create({
    data: {
      organizationId: input.organizationId,
      operadoraId: input.operadoraId,
      pacienteId: input.pacienteId,
      sessionId: input.sessionId ?? null,
      tipo: 'SADT',
      status: 'RASCUNHO',
      numeroGuia,
      codigoTuss: codigoTussPrincipal,
      valorTotal,
      dataExecucao: input.dataExecucao,
      xmlEnviado,
    },
  })

  logger.info({ guiaId: guia.id, numeroGuia }, 'Guia TISS SADT gerada')
  return guia
}

/**
 * Mark a guide as sent and save the operadora's response XML.
 * TODO Sprint 5+: implement SOAP submission per operadora endpoint.
 */
export async function markGuiaEnviada(guiaId: string, xmlResposta?: string) {
  return prisma.guiaTiss.update({
    where: { id: guiaId },
    data: {
      status: 'ENVIADA',
      xmlResposta: xmlResposta ?? null,
    },
  })
}

export async function markGuiaGlosada(guiaId: string, motivoGlosa: string) {
  return prisma.guiaTiss.update({
    where: { id: guiaId },
    data: { status: 'GLOSADA', motivoGlosa },
  })
}
