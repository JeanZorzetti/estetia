import { z } from 'zod'

export const LoyaltyConfigSchema = z.object({
  pontosPorReal: z.coerce.number().min(0).max(100).default(1),
  regrasResgate: z.record(z.string(), z.unknown()).default({}),
  ativo: z.boolean().default(true),
})

export const LoyaltyTransactionCreateSchema = z.object({
  patientId: z.string().uuid(),
  pontos: z.coerce.number().int().min(1).max(100000),
  tipo: z.enum(['GANHO', 'RESGATE', 'EXPIRACAO']),
  descricao: z.string().max(500).optional().or(z.literal('')),
})

export type LoyaltyConfigInput = z.infer<typeof LoyaltyConfigSchema>
export type LoyaltyTransactionCreateInput = z.infer<typeof LoyaltyTransactionCreateSchema>
