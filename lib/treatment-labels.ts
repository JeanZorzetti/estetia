import type { TreatmentType } from "@prisma/client"

export const TREATMENT_LABELS: Partial<Record<TreatmentType, string>> = {
  BOTOX: "Botox",
  PREENCHIMENTO: "Preenchimento",
  LASER: "Laser",
  PEELING: "Peeling",
  HARMONIZACAO_FACIAL: "Harmonização Facial",
  LIMPEZA_PELE: "Limpeza de Pele",
  MICROAGULHAMENTO: "Microagulhamento",
  CRIOLIPOLISE: "Criolipólise",
  RADIOFREQUENCIA: "Radiofrequência",
  LUZ_PULSADA: "Luz Pulsada",
  DEPILACAO_LASER: "Depilação Laser",
  SKINBOOSTER: "Skinbooster",
  FIOS_PDO: "Fios PDO",
  BICHECTOMIA: "Bichectomia",
  RINOPLASTIA_NONCIRURGICA: "Rinoplastia Não Cirúrgica",
  OUTROS: "Procedimento",
}
