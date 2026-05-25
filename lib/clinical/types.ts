// Shared types for the patient clinical section (prontuario, anamnese, tratamentos, fotos, consentimentos)

export interface PatientSummary {
  id: string
  nome: string
  email: string | null
  telefone: string | null
  dataNascimento: string | null
  sexo: string | null
  alergias: string[]
  medicacoesUso: string[]
  contraindicacoes: string[]
  tags: string[]
  origem: string | null
  dadosSensiveis: boolean
  createdAt: string
}

export interface PatientCounts {
  treatments: number
  anamneses: number
  medicalRecords: number
  consentLogs: number
}

export interface MedicalRecord {
  id: string
  dataAtendimento: string
  queixaPrincipal: string | null
  hipoteseDiagnostica: string | null
  planoTratamento: string | null
  historiaClinica: string | null
  avaliacaoFisica: string | null
  profissional: { nome: string } | null
  createdAt: string
}

export interface AnamnesisEntry {
  id: string
  treatmentId: string | null
  preenchidoPor: string
  assinadoEm: string | null
  createdAt: string
  profissional: { nome: string } | null
}

export interface TreatmentSession {
  id: string
  dataAgendada: string
  status: string
  noShowScore: number | null
}

export interface TreatmentEntry {
  id: string
  tipoTratamento: string
  descricaoCustomizada: string | null
  status: string
  sessoesRealizadas: number
  sessoesPrevistas: number
  createdAt: string
  sessions: TreatmentSession[]
}

export interface ConsentLogEntry {
  id: string
  tipo: string
  aceitoEm: string
  revokedAt: string | null
}
