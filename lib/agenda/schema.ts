import { z } from 'zod'

export const SessionStatusEnum = z.enum([
  'AGENDADA', 'CONFIRMADA', 'REALIZADA', 'NO_SHOW', 'REMARCADA', 'CANCELADA',
])

export const SessionCreateSchema = z.object({
  pacienteId: z.string().uuid(),
  treatmentId: z.string().uuid().optional().nullable(),
  procedureId: z.string().uuid().optional().nullable(),
  profissionalId: z.string().uuid().optional().nullable(),
  salaId: z.string().uuid().optional().nullable(),
  dataAgendada: z.string().datetime(),
  duracaoMinutos: z.coerce.number().int().min(5).max(600).default(60),
  observacoes: z.string().max(2000).optional().or(z.literal('')),
})

export const SessionUpdateSchema = z.object({
  dataAgendada: z.string().datetime().optional(),
  duracaoMinutos: z.coerce.number().int().min(5).max(600).optional(),
  status: SessionStatusEnum.optional(),
  profissionalId: z.string().uuid().optional().nullable(),
  salaId: z.string().uuid().optional().nullable(),
  procedureId: z.string().uuid().optional().nullable(),
  observacoes: z.string().max(2000).optional().or(z.literal('')),
})

export const MoveSessionSchema = z.object({
  novaData: z.string().datetime(),
  novaSalaId: z.string().uuid().optional().nullable(),
  novoProfissionalId: z.string().uuid().optional().nullable(),
  novaDuracao: z.coerce.number().int().min(5).max(600).optional(),
})

export const StatusChangeSchema = z.object({
  status: SessionStatusEnum,
  observacao: z.string().max(500).optional(),
})

export const AgendaFeedSchema = z.object({
  from: z.string().datetime(),
  to: z.string().datetime(),
  profissionalIds: z.array(z.string().uuid()).optional(),
  salaIds: z.array(z.string().uuid()).optional(),
  statuses: z.array(SessionStatusEnum).optional(),
})

export const ConflictCheckSchema = z.object({
  dataAgendada: z.string().datetime(),
  duracaoMinutos: z.coerce.number().int().min(5).max(600),
  profissionalId: z.string().uuid().optional().nullable(),
  salaId: z.string().uuid().optional().nullable(),
  ignoreSessionId: z.string().uuid().optional(),
})

export type SessionCreateInput = z.infer<typeof SessionCreateSchema>
export type SessionUpdateInput = z.infer<typeof SessionUpdateSchema>
export type MoveSessionInput = z.infer<typeof MoveSessionSchema>
export type AgendaFeedInput = z.infer<typeof AgendaFeedSchema>
export type ConflictCheckInput = z.infer<typeof ConflictCheckSchema>
