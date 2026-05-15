export interface PrestadorData {
  cnpj: string
  nome: string
  registroAns?: string
  cnes?: string
  codigoPrestadorNaOperadora?: string
}

export interface OperadoraData {
  codigoAns: string
  cnpj?: string
  nome: string
}

export interface GuiaData {
  id: string
  numeroGuia?: string | null
  tipo: 'CONSULTA' | 'SADT' | 'INTERNACAO' | 'SP_SADT' | 'HONORARIOS'
  codigoTuss?: string | null
  valorProcedimento?: number | null
  valorTotal?: number | null
  dataExecucao?: Date | null
  paciente: {
    nome: string
    cpf?: string | null
    dataNascimento?: Date | null
    sexo?: string | null
  }
}
