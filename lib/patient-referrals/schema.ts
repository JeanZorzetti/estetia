import { z } from 'zod'

export const PatientReferralCreateSchema = z.object({
  indicadorId: z.string().uuid(),
  indicadoId: z.string().uuid().optional().or(z.literal('')),
  nomeIndicado: z.string().max(120).optional().or(z.literal('')),
  telefoneIndicado: z.string().max(30).optional().or(z.literal('')),
  recompensaTipo: z.enum(['pontos_fidelidade', 'desconto_proximo', 'outro']).optional().or(z.literal('')),
  recompensaValor: z.coerce.number().min(0).optional().nullable(),
  observacoes: z.string().max(2000).optional().or(z.literal('')),
})

export const PatientReferralUpdateSchema = z.object({
  status: z.enum(['PENDENTE', 'CONVERTIDO', 'RECOMPENSADO', 'CANCELADO']).optional(),
  indicadoId: z.string().uuid().optional().or(z.literal('')),
  recompensaTipo: z.enum(['pontos_fidelidade', 'desconto_proximo', 'outro']).optional().or(z.literal('')),
  recompensaValor: z.coerce.number().min(0).optional().nullable(),
  recompensaConcedidaEm: z.string().datetime().optional().nullable(),
  observacoes: z.string().max(2000).optional().or(z.literal('')),
})

export type PatientReferralCreateInput = z.infer<typeof PatientReferralCreateSchema>
export type PatientReferralUpdateInput = z.infer<typeof PatientReferralUpdateSchema>
