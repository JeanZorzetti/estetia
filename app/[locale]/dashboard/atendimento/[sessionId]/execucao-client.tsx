"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  MapPin,
  User,
  Stethoscope,
  CheckCircle2,
  PlayCircle,
  XCircle,
  AlertTriangle,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { TREATMENT_LABELS } from "@/lib/treatment-labels"
import type { TreatmentType } from "@prisma/client"

type SessionStatus =
  | "AGENDADA"
  | "CONFIRMADA"
  | "REALIZADA"
  | "NO_SHOW"
  | "REMARCADA"
  | "CANCELADA"

interface SessionData {
  id: string
  status: SessionStatus
  dataAgendada: string
  duracaoMinutos: number | null
  observacoes: string | null
  noShowScore: number | null
  treatment: {
    id: string
    tipoTratamento: TreatmentType
    descricaoCustomizada: string | null
    valorTotal: string | null
    paciente: {
      id: string
      nome: string
      telefone: string | null
      email: string | null
      fotoPerfil: string | null
    }
    procedure: {
      id: string
      nome: string
      categoria: string | null
    } | null
  }
  profissional: { id: string; nome: string } | null
  sala: { id: string; nome: string; cor: string | null } | null
}

interface ExecucaoClientProps {
  session: SessionData
  prevId: string | null
  nextId: string | null
  canEdit: boolean
}

const STATUS_CONFIG: Record<
  SessionStatus,
  { label: string; badgeClass: string; dotClass: string }
> = {
  AGENDADA: {
    label: "Agendada",
    badgeClass: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    dotClass: "bg-blue-500",
  },
  CONFIRMADA: {
    label: "Confirmada",
    badgeClass: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    dotClass: "bg-emerald-500",
  },
  REALIZADA: {
    label: "Realizada",
    badgeClass: "bg-slate-500/10 text-slate-600 border-slate-500/20",
    dotClass: "bg-slate-500",
  },
  NO_SHOW: {
    label: "No-show",
    badgeClass: "bg-rose-500/10 text-rose-700 border-rose-500/20",
    dotClass: "bg-rose-500",
  },
  REMARCADA: {
    label: "Remarcada",
    badgeClass: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    dotClass: "bg-amber-500",
  },
  CANCELADA: {
    label: "Cancelada",
    badgeClass: "bg-zinc-500/10 text-zinc-500 border-zinc-500/10",
    dotClass: "bg-zinc-400",
  },
}

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
}

export function ExecucaoClient({
  session,
  prevId,
  nextId,
  canEdit,
}: ExecucaoClientProps) {
  const router = useRouter()
  const [currentStatus, setCurrentStatus] = useState<SessionStatus>(session.status)
  const [observacao, setObservacao] = useState("")
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const paciente = session.treatment.paciente
  const statusCfg = STATUS_CONFIG[currentStatus] ?? STATUS_CONFIG.AGENDADA
  const procedureLabel =
    session.treatment.procedure?.nome ??
    TREATMENT_LABELS[session.treatment.tipoTratamento] ??
    "Procedimento"

  const isDone = ["REALIZADA", "CANCELADA", "NO_SHOW"].includes(currentStatus)

  async function changeStatus(newStatus: SessionStatus) {
    if (!canEdit || loading) return
    setLoading(newStatus)
    setError(null)
    try {
      const res = await fetch(`/api/treatment-sessions/${session.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, observacao: observacao || undefined }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error ?? "Erro ao atualizar status")
      }
      setCurrentStatus(newStatus)
      setObservacao("")
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro desconhecido")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-8 min-h-screen bg-slate-50/20 text-[#0A1F3D] relative overflow-hidden rounded-3xl border border-[#0A1F3D]/5">
      {/* Background halos */}
      <div
        className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full pointer-events-none z-0 opacity-20 blur-[100px]"
        style={{ background: "radial-gradient(circle, rgba(72,159,181,0.15) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full pointer-events-none z-0 opacity-15 blur-[90px]"
        style={{ background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)" }}
      />

      {/* Header — navegação + título */}
      <div className="relative z-10 flex items-center justify-between gap-4 pb-5 border-b border-[#0A1F3D]/5">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200/60 bg-white/70 backdrop-blur-md shadow-sm hover:bg-white hover:border-[#489FB5]/30 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#489FB5] focus-visible:ring-offset-2"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
          </Link>
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 mb-0.5">
              Execução de Atendimento
            </p>
            <h1 className="font-serif text-2xl font-extrabold text-[#0A1F3D] leading-tight">
              {paciente.nome}
            </h1>
          </div>
        </div>

        {/* Navegação anterior/próximo */}
        <div className="flex items-center gap-2">
          {prevId ? (
            <Link
              href={`/dashboard/atendimento/${prevId}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200/60 bg-white/70 backdrop-blur-md shadow-sm hover:bg-white hover:border-[#489FB5]/30 text-[11px] font-bold text-slate-600 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#489FB5] focus-visible:ring-offset-2"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Anterior
            </Link>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200/30 bg-white/40 text-[11px] font-bold text-slate-300 cursor-not-allowed">
              <ChevronLeft className="w-3.5 h-3.5" />
              Anterior
            </span>
          )}
          {nextId ? (
            <Link
              href={`/dashboard/atendimento/${nextId}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200/60 bg-white/70 backdrop-blur-md shadow-sm hover:bg-white hover:border-[#489FB5]/30 text-[11px] font-bold text-slate-600 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#489FB5] focus-visible:ring-offset-2"
            >
              Próximo
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200/30 bg-white/40 text-[11px] font-bold text-slate-300 cursor-not-allowed">
              Próximo
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna principal — resumo + ações */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Card de resumo da sessão */}
          <div className="rounded-2xl border border-white bg-white/70 backdrop-blur-xl p-6 shadow-lg shadow-slate-100/50 relative">
            <div className="absolute inset-1 rounded-[14px] border border-white/40 pointer-events-none" />

            {/* Status badge */}
            <div className="flex items-center justify-between mb-5">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider ${statusCfg.badgeClass}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dotClass}`} />
                {statusCfg.label}
              </span>
              {session.noShowScore !== null && session.noShowScore >= 60 && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/8 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-rose-700">
                  <AlertTriangle className="w-3 h-3" />
                  Risco no-show {session.noShowScore}%
                </span>
              )}
            </div>

            {/* Avatar + nome + procedimento */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-14 h-14 rounded-full border-2 border-slate-100 bg-white shadow-md flex items-center justify-center text-[#0A1F3D] text-base font-extrabold tracking-wider shrink-0 overflow-hidden">
                {paciente.fotoPerfil ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={paciente.fotoPerfil}
                    alt={paciente.nome}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getInitials(paciente.nome)
                )}
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-[#0A1F3D] leading-tight">
                  {paciente.nome}
                </h2>
                <p className="text-sm font-semibold text-[#C5A059] mt-0.5">{procedureLabel}</p>
                {session.treatment.descricaoCustomizada && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    {session.treatment.descricaoCustomizada}
                  </p>
                )}
              </div>
            </div>

            {/* Detalhes da sessão */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5 rounded-xl bg-slate-50/80 border border-slate-200/50 px-3.5 py-2.5">
                <Clock className="w-4 h-4 text-[#489FB5] shrink-0" />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Horário</p>
                  <p className="text-sm font-bold text-slate-700">{formatTime(session.dataAgendada)}</p>
                  <p className="text-[10px] text-slate-400 capitalize">{formatDate(session.dataAgendada)}</p>
                </div>
              </div>

              {session.profissional && (
                <div className="flex items-center gap-2.5 rounded-xl bg-slate-50/80 border border-slate-200/50 px-3.5 py-2.5">
                  <User className="w-4 h-4 text-[#489FB5] shrink-0" />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Profissional</p>
                    <p className="text-sm font-bold text-slate-700">{session.profissional.nome}</p>
                  </div>
                </div>
              )}

              {session.sala && (
                <div className="flex items-center gap-2.5 rounded-xl bg-slate-50/80 border border-slate-200/50 px-3.5 py-2.5">
                  <MapPin className="w-4 h-4 text-[#489FB5] shrink-0" />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Sala</p>
                    <p className="text-sm font-bold text-slate-700">{session.sala.nome}</p>
                  </div>
                </div>
              )}

              {session.duracaoMinutos && (
                <div className="flex items-center gap-2.5 rounded-xl bg-slate-50/80 border border-slate-200/50 px-3.5 py-2.5">
                  <Stethoscope className="w-4 h-4 text-[#489FB5] shrink-0" />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Duração</p>
                    <p className="text-sm font-bold text-slate-700">{session.duracaoMinutos} min</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ações de status */}
          {canEdit && !isDone && (
            <div className="rounded-2xl border border-white bg-white/70 backdrop-blur-xl p-5 shadow-lg shadow-slate-100/50 relative">
              <div className="absolute inset-1 rounded-[14px] border border-white/40 pointer-events-none" />
              <h3 className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 mb-4">
                Atualizar Status
              </h3>

              {/* Observação */}
              <textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                maxLength={500}
                placeholder="Observação opcional (anexada ao registro)..."
                className="w-full rounded-xl border border-slate-200/60 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#489FB5] focus-visible:ring-offset-1 transition-all duration-200 mb-4"
                rows={3}
              />

              {error && (
                <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 mb-3">
                  {error}
                </p>
              )}

              <div className="grid grid-cols-2 gap-2.5">
                {currentStatus !== "CONFIRMADA" && (
                  <button
                    onClick={() => changeStatus("CONFIRMADA")}
                    disabled={Boolean(loading)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-4 py-2.5 text-[11px] font-black uppercase tracking-wider text-emerald-700 hover:bg-emerald-500/15 hover:border-emerald-500/35 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {loading === "CONFIRMADA" ? "Salvando..." : "Confirmar"}
                  </button>
                )}
                <button
                  onClick={() => changeStatus("REALIZADA")}
                  disabled={Boolean(loading)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#489FB5]/20 bg-[#489FB5]/8 px-4 py-2.5 text-[11px] font-black uppercase tracking-wider text-[#489FB5] hover:bg-[#489FB5]/15 hover:border-[#489FB5]/35 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#489FB5] focus-visible:ring-offset-1"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  {loading === "REALIZADA" ? "Salvando..." : "Concluir"}
                </button>
                <button
                  onClick={() => changeStatus("NO_SHOW")}
                  disabled={Boolean(loading)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/8 px-4 py-2.5 text-[11px] font-black uppercase tracking-wider text-rose-700 hover:bg-rose-500/15 hover:border-rose-500/35 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-1"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {loading === "NO_SHOW" ? "Salvando..." : "No-show"}
                </button>
                <button
                  onClick={() => changeStatus("CANCELADA")}
                  disabled={Boolean(loading)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-zinc-400/20 bg-zinc-500/5 px-4 py-2.5 text-[11px] font-black uppercase tracking-wider text-zinc-500 hover:bg-zinc-500/10 hover:border-zinc-400/35 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  {loading === "CANCELADA" ? "Salvando..." : "Cancelar"}
                </button>
              </div>
            </div>
          )}

          {/* Estado finalizado */}
          {isDone && (
            <div className="rounded-2xl border border-slate-200/50 bg-slate-50/60 backdrop-blur-xl p-5 text-center">
              <p className="text-sm font-semibold text-slate-500">
                Atendimento marcado como <span className="font-black text-slate-700">{statusCfg.label}</span>.
              </p>
            </div>
          )}
        </div>

        {/* Coluna lateral */}
        <div className="flex flex-col gap-4">
          {/* Link prontuário */}
          <Link
            href={`/dashboard/pacientes/${paciente.id}/prontuario`}
            className="flex items-center gap-3 rounded-2xl border border-white bg-white/70 backdrop-blur-xl p-5 shadow-lg shadow-slate-100/50 relative group hover:border-[#C5A059]/30 hover:shadow-[#C5A059]/5 hover:-translate-y-0.5 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#C5A059] focus-visible:ring-offset-2"
          >
            <div className="absolute inset-1 rounded-[14px] border border-white/40 pointer-events-none" />
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/20 shrink-0 group-hover:scale-105 transition-transform duration-300">
              <FileText className="w-4.5 h-4.5 text-[#C5A059]" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Paciente</p>
              <p className="text-sm font-bold text-[#0A1F3D] leading-snug">Ver Prontuário</p>
              <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{paciente.nome}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#C5A059] ml-auto shrink-0 group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>

          {/* Observações existentes */}
          {session.observacoes && (
            <div className="rounded-2xl border border-white bg-white/70 backdrop-blur-xl p-5 shadow-lg shadow-slate-100/50 relative">
              <div className="absolute inset-1 rounded-[14px] border border-white/40 pointer-events-none" />
              <h3 className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 mb-3">
                Observações registradas
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {session.observacoes}
              </p>
            </div>
          )}

          {/* Valor do tratamento */}
          {session.treatment.valorTotal && Number(session.treatment.valorTotal) > 0 && (
            <div className="rounded-2xl border border-white bg-white/70 backdrop-blur-xl p-5 shadow-lg shadow-slate-100/50 relative">
              <div className="absolute inset-1 rounded-[14px] border border-white/40 pointer-events-none" />
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Valor do Tratamento
              </p>
              <p className="text-xl font-black text-[#C5A059] font-serif">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                  maximumFractionDigits: 2,
                }).format(Number(session.treatment.valorTotal))}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
