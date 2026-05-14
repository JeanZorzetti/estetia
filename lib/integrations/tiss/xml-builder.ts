/**
 * TISS 4.x XML builder — generates ANS-compliant XML structures.
 *
 * Reference: Padrão TISS 4.01.00 — Agência Nacional de Saúde (ANS)
 * XSD: https://www.ans.gov.br/images/stories/prestadores/TISS-4.01.00.zip
 *
 * Scope: guia de consulta + guia SADT (Sprint 4 MVP)
 * Not implemented: internação, solicitação de autorização prévia
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TissContratado {
  codigoPrestadorNaOperadora: string
  nomeContratado: string
  cnes?: string           // Cadastro Nacional de Estabelecimentos de Saúde
}

export interface TissOperadora {
  registroANS: string     // 6 dígitos
}

export interface TissBeneficiario {
  numeroCarteira: string
  nomePaciente: string
  dataNascimento: string  // DD/MM/YYYY
  numeroCns?: string      // Cartão Nacional de Saúde
}

export interface TissProfissional {
  nome: string
  conselho: string        // CRM, CRO, etc.
  numero: string
  uf: string
  cbos?: string           // CBO do profissional
}

export interface TissGuiaConsultaParams {
  numeroGuia: string
  dataAtendimento: string // DD/MM/YYYY
  operadora: TissOperadora
  contratado: TissContratado
  beneficiario: TissBeneficiario
  profissional: TissProfissional
  codigoProcedimento: string   // TUSS (ex: 10101012)
  descricaoProcedimento: string
  quantidadeExecutada: number
  valorProcedimento: number
  observacao?: string
}

export interface TissGuiaSadtParams {
  numeroGuia: string
  numeroGuiaPrincipal?: string
  dataExecucao: string         // DD/MM/YYYY
  operadora: TissOperadora
  contratado: TissContratado
  beneficiario: TissBeneficiario
  profissional: TissProfissional
  procedimentos: Array<{
    codigoTabela: string       // "22" = TUSS
    codigoProcedimento: string
    descricao: string
    quantidade: number
    valorUnitario: number
  }>
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function esc(str: string | undefined): string {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function formatDecimal(v: number): string {
  return v.toFixed(2)
}

function nowDDMMYYYY(): string {
  const d = new Date()
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}/${mm}/${d.getFullYear()}`
}

// ─── Guia de Consulta ─────────────────────────────────────────────────────────

export function buildGuiaConsulta(p: TissGuiaConsultaParams): string {
  const total = formatDecimal(p.valorProcedimento * p.quantidadeExecutada)

  return `<?xml version="1.0" encoding="UTF-8"?>
<ans:mensagemTISS xmlns:ans="http://www.ans.gov.br/padroes/tiss/schemas" versao="4.01.00">
  <ans:cabecalho>
    <ans:identificacaoTransacao>
      <ans:tipoTransacao>ENVIO_LOTE_GUIAS</ans:tipoTransacao>
      <ans:sequencialTransacao>1</ans:sequencialTransacao>
      <ans:dataRegistroTransacao>${nowDDMMYYYY()}</ans:dataRegistroTransacao>
    </ans:identificacaoTransacao>
    <ans:origem>
      <ans:contratadoSolicitante>
        <ans:codigoPrestadorNaOperadora>${esc(p.contratado.codigoPrestadorNaOperadora)}</ans:codigoPrestadorNaOperadora>
      </ans:contratadoSolicitante>
    </ans:origem>
    <ans:destino>
      <ans:registroANS>${esc(p.operadora.registroANS)}</ans:registroANS>
    </ans:destino>
  </ans:cabecalho>
  <ans:prestadorParaOperadora>
    <ans:loteGuias>
      <ans:numeroLote>1</ans:numeroLote>
      <ans:guiasTISS>
        <ans:guiaConsulta>
          <ans:cabecalhoGuia>
            <ans:registroANS>${esc(p.operadora.registroANS)}</ans:registroANS>
            <ans:numeroGuiaPrestador>${esc(p.numeroGuia)}</ans:numeroGuiaPrestador>
          </ans:cabecalhoGuia>
          <ans:dadosBeneficiario>
            <ans:numeroCarteira>${esc(p.beneficiario.numeroCarteira)}</ans:numeroCarteira>
            <ans:nomeBeneficiario>${esc(p.beneficiario.nomePaciente)}</ans:nomeBeneficiario>
            <ans:dataNascimento>${esc(p.beneficiario.dataNascimento)}</ans:dataNascimento>
          </ans:dadosBeneficiario>
          <ans:dadosConsulta>
            <ans:dataAtendimento>${esc(p.dataAtendimento)}</ans:dataAtendimento>
            <ans:localAtendimento>01</ans:localAtendimento>
            <ans:indicacaoAcidente>9</ans:indicacaoAcidente>
            <ans:tipoConsulta>1</ans:tipoConsulta>
            <ans:procedimentosRealizados>
              <ans:procedimento>
                <ans:codigoTabela>22</ans:codigoTabela>
                <ans:codigoProcedimento>${esc(p.codigoProcedimento)}</ans:codigoProcedimento>
                <ans:descricaoProcedimento>${esc(p.descricaoProcedimento)}</ans:descricaoProcedimento>
                <ans:quantidadeExecutada>${p.quantidadeExecutada}</ans:quantidadeExecutada>
                <ans:valorUnitario>${formatDecimal(p.valorProcedimento)}</ans:valorUnitario>
              </ans:procedimento>
            </ans:procedimentosRealizados>
          </ans:dadosConsulta>
          <ans:dadosProfissional>
            <ans:nomeProfissional>${esc(p.profissional.nome)}</ans:nomeProfissional>
            <ans:conselhoProfissional>${esc(p.profissional.conselho)}</ans:conselhoProfissional>
            <ans:numeroCRM>${esc(p.profissional.numero)}</ans:numeroCRM>
            <ans:UF>${esc(p.profissional.uf)}</ans:UF>
            ${p.profissional.cbos ? `<ans:CBOS>${esc(p.profissional.cbos)}</ans:CBOS>` : ''}
          </ans:dadosProfissional>
          <ans:valorTotal>
            <ans:valorTotalGeral>${total}</ans:valorTotalGeral>
          </ans:valorTotal>
          ${p.observacao ? `<ans:observacao>${esc(p.observacao)}</ans:observacao>` : ''}
        </ans:guiaConsulta>
      </ans:guiasTISS>
    </ans:loteGuias>
  </ans:prestadorParaOperadora>
</ans:mensagemTISS>`.trim()
}

// ─── Guia SP/SADT ─────────────────────────────────────────────────────────────

export function buildGuiaSadt(p: TissGuiaSadtParams): string {
  const valorTotal = p.procedimentos.reduce(
    (acc, proc) => acc + proc.valorUnitario * proc.quantidade, 0
  )

  const procedimentosXml = p.procedimentos.map(proc => `
              <ans:procedimentoRealizado>
                <ans:sequencialItem>1</ans:sequencialItem>
                <ans:codigoTabela>${esc(proc.codigoTabela)}</ans:codigoTabela>
                <ans:codigoProcedimento>${esc(proc.codigoProcedimento)}</ans:codigoProcedimento>
                <ans:descricao>${esc(proc.descricao)}</ans:descricao>
                <ans:quantidadeExecutada>${proc.quantidade}</ans:quantidadeExecutada>
                <ans:valorUnitario>${formatDecimal(proc.valorUnitario)}</ans:valorUnitario>
                <ans:valorTotal>${formatDecimal(proc.valorUnitario * proc.quantidade)}</ans:valorTotal>
              </ans:procedimentoRealizado>`).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<ans:mensagemTISS xmlns:ans="http://www.ans.gov.br/padroes/tiss/schemas" versao="4.01.00">
  <ans:cabecalho>
    <ans:identificacaoTransacao>
      <ans:tipoTransacao>ENVIO_LOTE_GUIAS</ans:tipoTransacao>
      <ans:sequencialTransacao>1</ans:sequencialTransacao>
      <ans:dataRegistroTransacao>${nowDDMMYYYY()}</ans:dataRegistroTransacao>
    </ans:identificacaoTransacao>
    <ans:origem>
      <ans:contratadoSolicitante>
        <ans:codigoPrestadorNaOperadora>${esc(p.contratado.codigoPrestadorNaOperadora)}</ans:codigoPrestadorNaOperadora>
      </ans:contratadoSolicitante>
    </ans:origem>
    <ans:destino>
      <ans:registroANS>${esc(p.operadora.registroANS)}</ans:registroANS>
    </ans:destino>
  </ans:cabecalho>
  <ans:prestadorParaOperadora>
    <ans:loteGuias>
      <ans:numeroLote>1</ans:numeroLote>
      <ans:guiasTISS>
        <ans:guiaSPSADT>
          <ans:cabecalhoGuia>
            <ans:registroANS>${esc(p.operadora.registroANS)}</ans:registroANS>
            <ans:numeroGuiaPrestador>${esc(p.numeroGuia)}</ans:numeroGuiaPrestador>
            ${p.numeroGuiaPrincipal ? `<ans:numeroGuiaPrincipal>${esc(p.numeroGuiaPrincipal)}</ans:numeroGuiaPrincipal>` : ''}
          </ans:cabecalhoGuia>
          <ans:dadosBeneficiario>
            <ans:numeroCarteira>${esc(p.beneficiario.numeroCarteira)}</ans:numeroCarteira>
            <ans:nomeBeneficiario>${esc(p.beneficiario.nomePaciente)}</ans:nomeBeneficiario>
            <ans:dataNascimento>${esc(p.beneficiario.dataNascimento)}</ans:dataNascimento>
          </ans:dadosBeneficiario>
          <ans:dadosSolicitacao>
            <ans:dataExecucaoInicial>${esc(p.dataExecucao)}</ans:dataExecucaoInicial>
            <ans:dataExecucaoFinal>${esc(p.dataExecucao)}</ans:dataExecucaoFinal>
          </ans:dadosSolicitacao>
          <ans:dadosExecutante>
            <ans:codigoPrestadorNaOperadora>${esc(p.contratado.codigoPrestadorNaOperadora)}</ans:codigoPrestadorNaOperadora>
            <ans:nomeContratado>${esc(p.contratado.nomeContratado)}</ans:nomeContratado>
            ${p.contratado.cnes ? `<ans:codigoCNES>${esc(p.contratado.cnes)}</ans:codigoCNES>` : ''}
          </ans:dadosExecutante>
          <ans:procedimentosExecutados>${procedimentosXml}
          </ans:procedimentosExecutados>
          <ans:dadosProfissional>
            <ans:nomeProfissional>${esc(p.profissional.nome)}</ans:nomeProfissional>
            <ans:conselhoProfissional>${esc(p.profissional.conselho)}</ans:conselhoProfissional>
            <ans:numeroCRM>${esc(p.profissional.numero)}</ans:numeroCRM>
            <ans:UF>${esc(p.profissional.uf)}</ans:UF>
          </ans:dadosProfissional>
          <ans:valorTotal>
            <ans:valorTotalGeral>${formatDecimal(valorTotal)}</ans:valorTotalGeral>
          </ans:valorTotal>
        </ans:guiaSPSADT>
      </ans:guiasTISS>
    </ans:loteGuias>
  </ans:prestadorParaOperadora>
</ans:mensagemTISS>`.trim()
}
