import { z } from 'zod'

export const CreateMedicalRecordSchema = z.object({
  pacienteId: z.string().uuid(),
  profissionalId: z.string().uuid().optional().or(z.literal('')),
  dataAtendimento: z.string().min(1),
  queixaPrincipal: z.string().max(2000).optional().or(z.literal('')),
  historiaClinica: z.string().max(5000).optional().or(z.literal('')),
  avaliacaoFisica: z.string().max(5000).optional().or(z.literal('')),
  hipoteseDiagnostica: z.string().max(2000).optional().or(z.literal('')),
  planoTratamento: z.string().max(5000).optional().or(z.literal('')),
})

export type CreateMedicalRecordInput = z.infer<typeof CreateMedicalRecordSchema>
