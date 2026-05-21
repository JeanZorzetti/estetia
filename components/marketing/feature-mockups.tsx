"use client"

import React from "react"
import { motion, Variants } from "framer-motion"
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Check, 
  Sparkles, 
  MessageSquare, 
  Camera, 
  Plus, 
  ChevronRight,
  TrendingUp,
  Users,
  DollarSign,
  Heart
} from "lucide-react"

// ============================================================================
// 1. AGENDA INTELIGENTE MOCKUP
// ============================================================================
export function AgendaInteligenteMockup() {
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } }
  }

  const appointments = [
    {
      time: "09:00",
      duration: "60 min",
      patient: "Juliana Silva",
      treatment: "Toxina Botulínica",
      doctor: "Dra. Ana Paula",
      status: "Confirmado",
      statusColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      dotColor: "bg-emerald-500",
      accentBg: "border-l-4 border-l-[#489FB5]"
    },
    {
      time: "11:30",
      duration: "45 min",
      patient: "Patrícia Costa",
      treatment: "Preenchimento Labial",
      doctor: "Dra. Ana Paula",
      status: "Em Atendimento",
      statusColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      dotColor: "bg-amber-500",
      accentBg: "border-l-4 border-l-[#C5A059]"
    },
    {
      time: "14:00",
      duration: "90 min",
      patient: "Rafaela Mendes",
      treatment: "Bioestimulador de Colágeno",
      doctor: "Dra. Mariana",
      status: "Aguardando",
      statusColor: "bg-[#489FB5]/10 text-[#489FB5] border-[#489FB5]/20",
      dotColor: "bg-[#489FB5]",
      accentBg: "border-l-4 border-l-[#0A1F3D]"
    }
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-[460px] rounded-3xl border border-[#0A1F3D]/8 bg-white/90 p-6 shadow-2xl shadow-[#0A1F3D]/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/90"
    >
      {/* Top Header Bar */}
      <div className="mb-6 flex items-center justify-between border-b pb-4 dark:border-slate-800">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C5A059]">Visualização do Dia</span>
          <h4 className="font-serif text-lg font-bold text-[#0A1F3D] dark:text-white">Hoje, 21 de Maio</h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
            <CalendarIcon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </span>
          <button className="flex h-8 items-center gap-1 rounded-xl bg-[#0A1F3D] px-3 text-xs font-semibold text-white transition-all hover:bg-[#162D54]">
            <Plus className="h-3 w-3" /> Novo
          </button>
        </div>
      </div>

      {/* Interactive Quick Stats */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        {[
          { label: "Ocupação", value: "88%", color: "text-[#489FB5]" },
          { label: "Agendados", value: "14", color: "text-[#0A1F3D] dark:text-white" },
          { label: "Confirmados", value: "11/14", color: "text-emerald-600" }
        ].map((stat, i) => (
          <div key={i} className="rounded-2xl border border-[#0A1F3D]/5 bg-[#EEF0F8]/40 p-3 text-center dark:border-white/5 dark:bg-slate-800/40">
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 block mb-0.5">{stat.label}</span>
            <span className={`text-sm font-bold ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Appointment Slots */}
      <div className="space-y-4">
        {appointments.map((app, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ scale: 1.02, x: 4 }}
            className={`group relative flex gap-4 rounded-2xl border border-[#0A1F3D]/5 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-white/5 dark:bg-slate-900 ${app.accentBg}`}
          >
            {/* Time slot column */}
            <div className="flex flex-col items-center justify-center border-r pr-4 text-center dark:border-slate-800">
              <span className="text-sm font-bold text-[#0A1F3D] dark:text-white">{app.time}</span>
              <span className="flex items-center gap-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                <Clock className="h-2.5 w-2.5" />
                {app.duration}
              </span>
            </div>

            {/* Main content column */}
            <div className="flex-1">
              <div className="mb-1.5 flex items-center justify-between">
                <h5 className="font-sans text-sm font-bold text-[#0A1F3D] group-hover:text-[#489FB5] transition-colors dark:text-white">
                  {app.patient}
                </h5>
                <span className={`rounded-full border px-2 py-0.5 text-[9px] font-semibold tracking-wider ${app.statusColor}`}>
                  <span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${app.dotColor}`} />
                  {app.status}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{app.treatment}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">{app.doctor}</p>
            </div>
            
            {/* Elegant hover arrow indicator */}
            <ChevronRight className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ============================================================================
// 2. ESTETIA IA MOCKUP
// ============================================================================
export function EstetiaIAMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-[460px] rounded-3xl border border-[#0A1F3D]/8 bg-white/95 p-6 shadow-2xl shadow-[#0A1F3D]/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95"
    >
      {/* IA Header */}
      <div className="mb-5 flex items-center gap-3 border-b pb-4 dark:border-slate-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0A1F3D] to-[#489FB5] text-white shadow-lg shadow-[#489FB5]/20">
          <Sparkles className="h-5 w-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h4 className="font-serif text-base font-bold text-[#0A1F3D] dark:text-white">Estetia IA</h4>
            <span className="rounded-full bg-gradient-to-r from-[#C5A059] to-[#8B6E32] px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">PRO</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
            Assistente Ativo Conectado
          </span>
        </div>
      </div>

      {/* AI Suggestion Bubble */}
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-br from-[#0A1F3D]/5 to-[#489FB5]/5 border border-[#489FB5]/10 p-4 dark:from-slate-800/30 dark:to-slate-950/20">
          <div className="mb-2 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#C5A059]" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">Predição de No-Show</span>
          </div>
          <p className="text-xs leading-relaxed text-[#0A1F3D] dark:text-slate-200">
            A paciente <strong className="font-bold">Mariana Souza</strong> possui <span className="font-bold text-red-500">82% de chance de falta (No-Show)</span> para a consulta de amanhã às 14:00 (Preenchimento).
          </p>
          <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
            <span>Motivos:</span>
            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 dark:bg-slate-800">Previsão de Chuva</span>
            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 dark:bg-slate-800">Histórico de Quintas</span>
          </div>
        </div>

        {/* Action Button */}
        <motion.button 
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.01 }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0A1F3D] py-3 text-xs font-bold text-white shadow-lg shadow-[#0A1F3D]/10 hover:bg-[#162D54] transition-colors"
        >
          <MessageSquare className="h-4 w-4 text-[#489FB5]" />
          Prevenir via Confirmação Inteligente
        </motion.button>

        {/* AI Suggested Message Preview */}
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
          <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Mensagem Sugerida (WhatsApp)</span>
          <p className="font-mono text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
            "Olá Mariana! 😊 Tudo pronto para seu Preenchimento amanhã às 14h? Para sua comodidade, gostaria de antecipar o preenchimento da ficha digital ou solicitar manobrista gratuito? Confirme clicando no link abaixo..."
          </p>
          <div className="mt-2.5 flex justify-end gap-1.5">
            <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-lg dark:bg-emerald-950/20">
              <Check className="h-3 w-3" /> Personalizado com IA
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// 3. EVOLUCAO FOTOS MOCKUP (COMPARATIVO ANTES/DEPOIS)
// ============================================================================
export function EvolucaoFotosMockup() {
  const [sliderPos, setSliderPos] = React.useState(50)
  
  // Create an automatic subtle oscilation effect on the slider
  React.useEffect(() => {
    let direction = 1
    const interval = setInterval(() => {
      setSliderPos((prev) => {
        if (prev >= 65) direction = -1
        if (prev <= 35) direction = 1
        return prev + 0.3 * direction
      })
    }, 40)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-[460px] rounded-3xl border border-[#0A1F3D]/8 bg-white/95 p-6 shadow-2xl shadow-[#0A1F3D]/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95"
    >
      {/* Title */}
      <div className="mb-4 flex items-center justify-between border-b pb-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#489FB5]/10 text-[#489FB5]">
            <Camera className="h-4 w-4" />
          </span>
          <h4 className="font-serif text-base font-bold text-[#0A1F3D] dark:text-white">Evolução por Fotos</h4>
        </div>
        <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-wider">Alinhamento 3D</span>
      </div>

      {/* Before / After Slider container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-950 border dark:border-slate-800 shadow-inner">
        {/* Under layer (Before) */}
        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
          {/* Facial Silhouette Mockup vector */}
          <svg className="h-[80%] w-auto text-slate-800 opacity-60" fill="none" viewBox="0 0 100 100" stroke="currentColor" strokeWidth="1">
            <path d="M50 15 C 30 15, 20 25, 20 45 C 20 60, 28 65, 30 75 C 32 85, 42 90, 50 90 C 58 90, 68 85, 70 75 C 72 65, 80 60, 80 45 C 80 25, 70 15, 50 15 Z" />
            <path d="M35 40 Q 40 43, 45 40" strokeWidth="1.5" />
            <path d="M65 40 Q 60 43, 55 40" strokeWidth="1.5" />
            {/* Thin wrinkled lines */}
            <path d="M45 58 Q 50 63, 55 58" className="stroke-red-500/60" strokeWidth="1.5" />
            <path d="M25 45 Q 30 46, 35 45" className="stroke-slate-700" />
            <path d="M75 45 Q 70 46, 65 45" className="stroke-slate-700" />
          </svg>
          <div className="absolute bottom-3 left-4 rounded-md bg-black/60 px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
            Antes
          </div>
        </div>

        {/* Top layer (After) clipped with slider */}
        <div 
          className="absolute inset-y-0 left-0 right-0 bg-[#0A1F3D]/95 transition-all duration-75 overflow-hidden flex items-center justify-center"
          style={{ width: `${sliderPos}%` }}
        >
          {/* Facial Silhouette Mockup vector (Clean, Rejuvenated) */}
          <div className="absolute inset-0 w-[412px] h-[309px] flex items-center justify-center">
            <svg className="h-[80%] w-auto text-[#489FB5] opacity-80" fill="none" viewBox="0 0 100 100" stroke="currentColor" strokeWidth="1.5">
              <path d="M50 15 C 30 15, 20 25, 20 45 C 20 60, 28 65, 30 75 C 32 85, 42 90, 50 90 C 58 90, 68 85, 70 75 C 72 65, 80 60, 80 45 C 80 25, 70 15, 50 15 Z" />
              <path d="M35 40 Q 40 38, 45 40" strokeWidth="2" />
              <path d="M65 40 Q 60 38, 55 40" strokeWidth="2" />
              {/* Full labial volume */}
              <path d="M42 60 Q 50 64, 58 60 Q 50 56, 42 60" className="stroke-amber-500" strokeWidth="2" fill="rgba(197, 160, 89, 0.2)" />
              <path d="M25 45 Q 30 44, 35 45" />
              <path d="M75 45 Q 70 44, 65 45" />
            </svg>
          </div>
          <div className="absolute bottom-3 left-4 rounded-md bg-[#C5A059] px-2 py-0.5 text-[9px] font-bold text-[#0A1F3D] uppercase tracking-wider whitespace-nowrap">
            Depois (D21)
          </div>
        </div>

        {/* Interactive slider bar */}
        <div 
          className="absolute inset-y-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(255,255,255,0.8)] z-20 flex items-center justify-center"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="h-8 w-8 rounded-full border-2 border-white bg-[#0A1F3D] flex items-center justify-center shadow-lg text-[9px] text-white font-bold select-none scale-90">
            ⇔
          </div>
        </div>
      </div>

      {/* Annotation and Analysis card */}
      <div className="mt-4 grid grid-cols-2 gap-3 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
        <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-900 border dark:border-slate-800">
          <span className="font-bold text-[#0A1F3D] dark:text-white block mb-0.5">Assimetria Corrigida</span>
          <span>Redução de desvio labial em 94% através do preenchimento estruturado.</span>
        </div>
        <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-900 border dark:border-slate-800">
          <span className="font-bold text-[#C5A059] block mb-0.5">Estímulo de Colágeno</span>
          <span>Área zigomática com aumento de densidade dérmica projetada.</span>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// 4. FALLBACK MOCKUP (DASHBOARD ANALYTICS GERAL)
// ============================================================================
export function FallbackMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-[460px] rounded-3xl border border-[#0A1F3D]/8 bg-white/95 p-6 shadow-2xl shadow-[#0A1F3D]/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95"
    >
      {/* Title */}
      <div className="mb-5 flex items-center justify-between border-b pb-4 dark:border-slate-800">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C5A059]">Dashboard da Clínica</span>
          <h4 className="font-serif text-base font-bold text-[#0A1F3D] dark:text-white">Desempenho Geral</h4>
        </div>
        <span className="flex h-8 items-center gap-1 rounded-xl bg-emerald-50 px-2.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-950/20">
          <TrendingUp className="h-3 w-3" /> +14.2% este mês
        </span>
      </div>

      {/* KPI Stats list */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-2xl border border-slate-100 bg-[#EEF0F8]/30 p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-1.5 text-slate-500 mb-1">
            <DollarSign className="h-4 w-4 text-[#C5A059]" />
            <span className="text-[10px] font-medium uppercase tracking-wider">Faturamento</span>
          </div>
          <p className="font-serif text-xl font-bold text-[#0A1F3D] dark:text-white">R$ 48.910</p>
          <span className="text-[9px] text-emerald-600 font-semibold block mt-0.5">Meta 92% atingida</span>
        </div>
        
        <div className="rounded-2xl border border-slate-100 bg-[#EEF0F8]/30 p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-1.5 text-slate-500 mb-1">
            <Users className="h-4 w-4 text-[#489FB5]" />
            <span className="text-[10px] font-medium uppercase tracking-wider">Novos Clientes</span>
          </div>
          <p className="font-serif text-xl font-bold text-[#0A1F3D] dark:text-white">+48 Pacientes</p>
          <span className="text-[9px] text-emerald-600 font-semibold block mt-0.5">Crescimento de 18%</span>
        </div>
      </div>

      {/* Visual Chart Simulating */}
      <div className="rounded-2xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Taxa de Conversão de Avaliações</span>
          <span className="text-[10px] font-bold text-[#489FB5]">Média: 74%</span>
        </div>
        
        {/* Pure CSS/Tailwind visual bar chart */}
        <div className="flex items-end justify-between gap-2.5 h-20 pt-4">
          {[
            { height: "h-[30%]", label: "Jan" },
            { height: "h-[45%]", label: "Fev" },
            { height: "h-[65%]", label: "Mar" },
            { height: "h-[85%]", label: "Abr", highlighted: true },
            { height: "h-[74%]", label: "Mai" }
          ].map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full relative rounded-t-md bg-slate-100 dark:bg-slate-800 h-full flex items-end">
                <div 
                  className={`w-full rounded-t-md transition-all duration-500 ${
                    bar.highlighted 
                      ? "bg-gradient-to-t from-[#C5A059] to-[#ebd2a0]" 
                      : "bg-gradient-to-t from-[#0A1F3D] to-[#489FB5] opacity-80"
                  } ${bar.height}`}
                />
              </div>
              <span className="text-[9px] text-slate-400 font-medium">{bar.label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// MAIN COMPONENT EXPORTER
// ============================================================================
interface FeatureMockupsSelectorProps {
  slug: string
}

export default function FeatureMockupSelector({ slug }: FeatureMockupsSelectorProps) {
  switch (slug) {
    case "agenda-inteligente":
      return <AgendaInteligenteMockup />
    case "estetia-ia":
      return <EstetiaIAMockup />
    case "evolucao-fotos":
      return <EvolucaoFotosMockup />
    default:
      return <FallbackMockup />
  }
}
