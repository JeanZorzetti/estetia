export interface JourneyStep {
  id: string
  label: string
  description: string
  x: number
  y: number
}

export const JOURNEY_STEPS: JourneyStep[] = [
  {
    id: 'captacao',
    label: 'Captação',
    description: 'Lead chega via indicação, redes sociais ou busca orgânica.',
    x: 60,
    y: 80,
  },
  {
    id: 'consulta',
    label: 'Primeira consulta',
    description: 'Anamnese digital, fotos e plano de tratamento registrados.',
    x: 200,
    y: 220,
  },
  {
    id: 'tratamento',
    label: 'Tratamento',
    description: 'Evolução clínica monitorada sessão a sessão com alertas.',
    x: 380,
    y: 140,
  },
  {
    id: 'retorno',
    label: 'Retorno',
    description: 'IA sugere o melhor momento para recontato e próxima sessão.',
    x: 560,
    y: 260,
  },
  {
    id: 'fidelidade',
    label: 'Fidelidade',
    description: 'Paciente se torna embaixador. Ciclo de indicações se expande.',
    x: 740,
    y: 100,
  },
]

// Gera um path SVG suave passando pelos pontos
export function buildPath(steps: JourneyStep[]): string {
  if (steps.length < 2) return ''
  let d = `M ${steps[0].x} ${steps[0].y}`
  for (let i = 1; i < steps.length; i++) {
    const prev = steps[i - 1]
    const curr = steps[i]
    const cx = (prev.x + curr.x) / 2
    const cy1 = prev.y
    const cy2 = curr.y
    d += ` C ${cx},${cy1} ${cx},${cy2} ${curr.x},${curr.y}`
  }
  return d
}
