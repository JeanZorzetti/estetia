import { z } from 'zod'

export const CreateRecallRuleSchema = z.object({
  nome: z.string().min(2).max(80),
  procedimentoId: z.string().optional().or(z.literal('')),
  intervaloDias: z.number().int().min(1).max(365),
  canal: z.enum(['WHATSAPP', 'EMAIL']).default('WHATSAPP'),
  template: z.string().min(10).max(2000),
  ativo: z.boolean().default(true),
})

export const UpdateRecallRuleSchema = CreateRecallRuleSchema.partial()

export type CreateRecallRuleInput = z.infer<typeof CreateRecallRuleSchema>
export type UpdateRecallRuleInput = z.infer<typeof UpdateRecallRuleSchema>
