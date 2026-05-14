import { z } from 'zod'

export const SegmentSchema = z.object({
  tags: z.array(z.string()).default([]),
  origem: z.string().optional().or(z.literal('')),
  aniversariantesMes: z.boolean().default(false),
  inativosDias: z.coerce.number().int().min(0).optional().nullable(),
})

export const CreateCampaignSchema = z.object({
  nome: z.string().min(2).max(120),
  canal: z.enum(['WHATSAPP', 'EMAIL']),
  segmento: SegmentSchema.default({}),
  mensagem: z.string().min(1).max(5000),
  agendadoPara: z.string().datetime().optional().nullable(),
})

export const UpdateCampaignSchema = CreateCampaignSchema.partial().extend({
  status: z.enum(['RASCUNHO', 'AGENDADA', 'CANCELADA']).optional(),
})

export type SegmentInput = z.infer<typeof SegmentSchema>
export type CreateCampaignInput = z.infer<typeof CreateCampaignSchema>
export type UpdateCampaignInput = z.infer<typeof UpdateCampaignSchema>
