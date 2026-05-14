export const MARGIN_PRESETS = [
  { label: 'Conservadora (20%)', value: 20 },
  { label: 'Padrão (35%)', value: 35 },
  { label: 'Premium (50%)', value: 50 },
  { label: 'Luxo (70%)', value: 70 },
]

export const PROCEDURE_TEMPLATES = [
  {
    label: 'Limpeza de Pele',
    insumos: 45,
    tempoMin: 60,
    custoHoraProfissional: 80,
    custoFixoRateado: 30,
  },
  {
    label: 'Peeling Químico',
    insumos: 80,
    tempoMin: 45,
    custoHoraProfissional: 100,
    custoFixoRateado: 40,
  },
  {
    label: 'Microagulhamento',
    insumos: 120,
    tempoMin: 60,
    custoHoraProfissional: 120,
    custoFixoRateado: 50,
  },
  {
    label: 'Drenagem Linfática',
    insumos: 20,
    tempoMin: 60,
    custoHoraProfissional: 70,
    custoFixoRateado: 25,
  },
  {
    label: 'Aplicação Botox',
    insumos: 280,
    tempoMin: 30,
    custoHoraProfissional: 150,
    custoFixoRateado: 60,
  },
]

export function calcPrecificacao(
  insumos: number,
  tempoMin: number,
  custoHoraProfissional: number,
  custoFixoRateado: number,
  margemPct: number
) {
  const custoTempo = (tempoMin / 60) * custoHoraProfissional
  const custoTotal = insumos + custoTempo + custoFixoRateado
  const precoMinimo = custoTotal / (1 - 0.2) // sempre garante 20% mínimo
  const precoSugerido = custoTotal / (1 - margemPct / 100)
  const premiumMultiplier = 1 + (margemPct / 100) * 1.5
  const precoPremium = precoSugerido * premiumMultiplier

  return {
    custoTotal: Math.round(custoTotal * 100) / 100,
    custoTempo: Math.round(custoTempo * 100) / 100,
    precoMinimo: Math.round(precoMinimo * 100) / 100,
    precoSugerido: Math.round(precoSugerido * 100) / 100,
    precoPremium: Math.round(precoPremium * 100) / 100,
    margemMinima: 20,
    margemSugerida: margemPct,
    margemPremium: Math.round(margemPct * 1.5),
  }
}
