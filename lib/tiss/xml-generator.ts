import { create } from 'xmlbuilder2'
import { createHash } from 'crypto'
import type { GuiaData, OperadoraData, PrestadorData } from './types'

const TISS_VERSION = '4.01.00'
const ANS_NAMESPACE = 'http://www.ans.gov.br/padroes/tiss/schemas'

function formatDate(d: Date | null | undefined): string {
  if (!d) return ''
  const date = new Date(d)
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function formatHora(d: Date | null | undefined): string {
  if (!d) return '00:00'
  const date = new Date(d)
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

function formatDecimal(v: number | null | undefined): string {
  return (v ?? 0).toFixed(2)
}

function sexoTiss(sexo: string | null | undefined): string {
  if (sexo === 'M') return '1'
  if (sexo === 'F') return '3'
  return '0'
}

function buildCabecalho(numeroLote: string, prestador: PrestadorData, operadora: OperadoraData) {
  const now = new Date()
  return {
    'ans:identificacaoTransacao': {
      'ans:tipoTransacao': 'ENVIO_LOTE_GUIAS',
      'ans:sequencialTransacao': numeroLote,
      'ans:dataRegistroTransacao': formatDate(now),
      'ans:horaRegistroTransacao': formatHora(now),
    },
    'ans:origem': {
      'ans:identificacaoPrestador': {
        'ans:codigoPrestadorNaOperadora': prestador.codigoPrestadorNaOperadora ?? '00000000',
      },
    },
    'ans:destino': {
      'ans:registroANS': operadora.codigoAns,
    },
    'ans:Padrao': TISS_VERSION,
  }
}

function buildGuiaConsulta(guia: GuiaData, prestador: PrestadorData, operadora: OperadoraData) {
  return {
    'ans:cabecalhoConsulta': {
      'ans:registroANS': operadora.codigoAns,
      'ans:numeroGuiaPrestador': guia.numeroGuia ?? guia.id.slice(0, 20),
    },
    'ans:dadosBeneficiario': {
      'ans:nomeBeneficiario': guia.paciente.nome,
      'ans:numeroCNS': '',
    },
    'ans:contratadoExecutante': {
      'ans:codigoPrestadorNaOperadora': prestador.codigoPrestadorNaOperadora ?? '00000000',
      'ans:nomeContratado': prestador.nome,
      'ans:CNES': prestador.cnes ?? '0000000',
    },
    'ans:hipoteseDiagnostico': {
      'ans:tipoDoenca': 'A',
      'ans:tempoDoenca': '0',
    },
    'ans:dadosAtendimento': {
      'ans:dataAtendimento': formatDate(guia.dataExecucao ?? new Date()),
      'ans:tipoConsulta': '1',
      'ans:codigoTabela': '22',
      'ans:codigoProcedimento': guia.codigoTuss ?? '10101012',
      'ans:valorProcedimento': formatDecimal(guia.valorProcedimento ?? guia.valorTotal),
    },
  }
}

function buildGuiaSadt(guia: GuiaData, prestador: PrestadorData, operadora: OperadoraData) {
  return {
    'ans:cabecalhoGuia': {
      'ans:registroANS': operadora.codigoAns,
      'ans:numeroGuiaPrestador': guia.numeroGuia ?? guia.id.slice(0, 20),
    },
    'ans:dadosAutorizacao': {
      'ans:dataAutorizacao': formatDate(guia.dataExecucao ?? new Date()),
    },
    'ans:dadosBeneficiario': {
      'ans:nomeBeneficiario': guia.paciente.nome,
      'ans:sexo': sexoTiss(guia.paciente.sexo),
      'ans:dataNascimento': formatDate(guia.paciente.dataNascimento),
    },
    'ans:dadosSolicitante': {
      'ans:contratadoSolicitante': {
        'ans:codigoPrestadorNaOperadora': prestador.codigoPrestadorNaOperadora ?? '00000000',
        'ans:nomeContratado': prestador.nome,
      },
    },
    'ans:dadosExecutante': {
      'ans:contratadoExecutante': {
        'ans:codigoPrestadorNaOperadora': prestador.codigoPrestadorNaOperadora ?? '00000000',
        'ans:nomeContratado': prestador.nome,
        'ans:CNES': prestador.cnes ?? '0000000',
      },
    },
    'ans:procedimentosExecutados': {
      'ans:procedimentoExecutado': {
        'ans:dataExecucao': formatDate(guia.dataExecucao ?? new Date()),
        'ans:procedimento': {
          'ans:codigoTabela': '22',
          'ans:codigoProcedimento': guia.codigoTuss ?? '00000000',
        },
        'ans:quantidadeExecutada': '1',
        'ans:valorUnitario': formatDecimal(guia.valorProcedimento ?? guia.valorTotal),
        'ans:valorTotal': formatDecimal(guia.valorTotal ?? guia.valorProcedimento),
      },
    },
    'ans:valorTotal': {
      'ans:valorProcedimentos': formatDecimal(guia.valorTotal ?? guia.valorProcedimento),
      'ans:valorTotalGeral': formatDecimal(guia.valorTotal ?? guia.valorProcedimento),
    },
  }
}

function buildGuiaNode(guia: GuiaData, prestador: PrestadorData, operadora: OperadoraData) {
  if (guia.tipo === 'CONSULTA') {
    return { 'ans:guiaConsulta': buildGuiaConsulta(guia, prestador, operadora) }
  }
  return { 'ans:guiaSP-SADT': buildGuiaSadt(guia, prestador, operadora) }
}

function md5(input: string): string {
  return createHash('md5').update(input, 'utf8').digest('hex')
}

export function buildLoteGuias(
  guias: GuiaData[],
  operadora: OperadoraData,
  prestador: PrestadorData,
  numeroLote: string,
): string {
  const guiasNodes = guias.map(g => buildGuiaNode(g, prestador, operadora))

  const doc: Record<string, unknown> = {
    'ans:mensagemTISS': {
      '@xmlns:ans': ANS_NAMESPACE,
      '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'ans:cabecalho': buildCabecalho(numeroLote, prestador, operadora),
      'ans:prestadorParaOperadora': {
        'ans:loteGuias': {
          'ans:numeroLote': numeroLote,
          'ans:guiasTISS': guiasNodes.length === 1 ? guiasNodes[0] : guiasNodes,
        },
      },
      'ans:epilogo': {
        'ans:hash': '00000000000000000000000000000000',
      },
    },
  }

  const xmlWithPlaceholder = create({ version: '1.0', encoding: 'UTF-8' }, doc).end({ prettyPrint: true })

  // Calculate MD5 of XML without the hash content
  const withoutHash = xmlWithPlaceholder.replace(
    /<ans:hash>[^<]*<\/ans:hash>/,
    '',
  )
  const hash = md5(withoutHash)

  return xmlWithPlaceholder.replace(
    /<ans:hash>[^<]*<\/ans:hash>/,
    `<ans:hash>${hash}</ans:hash>`,
  )
}

export function buildGuiaXml(
  guia: GuiaData,
  operadora: OperadoraData,
  prestador: PrestadorData,
): string {
  const numeroLote = `${Date.now()}`
  return buildLoteGuias([guia], operadora, prestador, numeroLote)
}
