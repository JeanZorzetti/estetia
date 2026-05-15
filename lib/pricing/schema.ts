import { z } from 'zod'

export const CustomPlanSchema = z.object({
  modules: z.array(z.string().max(60)).default([]),
  extraUsers: z.coerce.number().int().min(0).max(100).default(0),
  extraRooms: z.coerce.number().int().min(0).max(100).default(0),
  extraProfs: z.coerce.number().int().min(0).max(100).default(0),
  billingPeriod: z.enum(['MONTHLY', 'ANNUAL']).default('MONTHLY'),
})

export const CalculateRequestSchema = CustomPlanSchema

export type CustomPlanInput = z.infer<typeof CustomPlanSchema>
