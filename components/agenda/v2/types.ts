export interface AgendaSession {
  id: string
  dataAgendada: string  // ISO
  duracaoMinutos: number | null
  status: string
  noShowScore: number | null
  observacoes: string | null
  googleSyncStatus: string | null
  profissional: { id: string; nome: string } | null
  sala: { id: string; nome: string; cor: string | null } | null
  treatment: {
    id: string
    paciente: { id: string; nome: string; telefone: string | null }
    procedure: { id: string; nome: string; categoria: string | null } | null
  }
}

export interface AgendaProfissional { id: string; nome: string }
export interface AgendaSala { id: string; nome: string; cor: string | null; tipo: string }
export interface AgendaProcedure { id: string; nome: string; categoria: string | null; duracaoMinutos: number }
export interface AgendaWaitlist {
  id: string
  pacienteId: string
  pacienteNome: string
  procedimento: string | null
  profissionalId: string | null
  status: string
  createdAt: string
}

export type AgendaView = 'week' | 'day' | 'month'

export interface AgendaFilters {
  profissionalIds: Set<string>
  salaIds: Set<string>
  statuses: Set<string>
}
