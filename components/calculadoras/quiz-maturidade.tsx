'use client'

import { useState } from 'react'
import { ArrowRight, ChevronRight, RotateCcw, Sparkles } from 'lucide-react'
import { Link } from '@/i18n/routing'
import {
  QUIZ_QUESTIONS,
  MATURITY_LEVELS,
  calculateScore,
  getMaturityLevel,
  getRecommendations,
} from '@/config/ferramentas/maturidade-quiz'

type Phase = 'intro' | 'quiz' | 'result'

const DIMENSION_LABELS: Record<string, string> = {
  agenda: 'Agenda & Atendimento',
  prontuario: 'Prontuário & Clínico',
  marketing: 'Marketing & CRM',
  gestao: 'Gestão & Compliance',
}

export function QuizMaturidade() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})

  const question = QUIZ_QUESTIONS[currentQ]
  const score = calculateScore(answers)
  const level = getMaturityLevel(score)
  const recommendations = getRecommendations(answers, 4)
  const progress = ((currentQ + 1) / QUIZ_QUESTIONS.length) * 100

  function handleAnswer(value: number) {
    const next = { ...answers, [question.id]: value }
    setAnswers(next)
    if (currentQ < QUIZ_QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      setPhase('result')
    }
  }

  function restart() {
    setPhase('intro')
    setCurrentQ(0)
    setAnswers({})
  }

  if (phase === 'intro') {
    return (
      <div className="max-w-xl mx-auto text-center space-y-8 rounded-3xl border border-white/40 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#489FB5]" />
        
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#489FB5]/10 text-3xl shadow-inner border border-[#489FB5]/20 animate-bounce">
          ⚡
        </div>
        
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#489FB5]">Diagnóstico Rápido</span>
          <h3 className="font-serif text-2xl font-normal text-[#0A1F3D] dark:text-white mb-2 mt-0.5">Quiz de 10 perguntas</h3>
          <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed font-semibold">
            Responda de forma transparente e receba em segundos a avaliação do ecossistema digital da sua clínica, juntamente com recomendações operacionais exclusivas.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm text-left">
          {Object.entries(DIMENSION_LABELS).map(([k, v]) => (
            <div key={k} className="flex items-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-3 shadow-sm hover:border-[#489FB5]/30 hover:bg-[#489FB5]/5 transition-all duration-300">
              <div className="h-2 w-2 rounded-full bg-[#489FB5] shrink-0" />
              <span className="text-[#0A1F3D] dark:text-slate-200 font-bold text-xs leading-none">{v}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3 pt-4">
          <button
            onClick={() => setPhase('quiz')}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 font-bold text-sm text-white shadow-xl shadow-[#489FB5]/20 active:scale-[0.98] transition-all hover:opacity-95"
            style={{ backgroundColor: '#489FB5' }}
          >
            Iniciar avaliação digital
            <ArrowRight className="h-4 w-4" />
          </button>
          <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider">Sem cadastro · Sem e-mail · Resultado imediato</p>
        </div>
      </div>
    )
  }

  if (phase === 'quiz') {
    const answered = Object.keys(answers).length
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Progress */}
        <div className="space-y-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 p-4 border border-white/20 dark:border-slate-800 backdrop-blur-sm shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-widest">
            <span>Dimensão: <strong className="text-[#489FB5] font-black">{DIMENSION_LABELS[question.dimension]}</strong></span>
            <span>{answered + 1} / {QUIZ_QUESTIONS.length}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden relative">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#489FB5] to-[#A8ECE7] shadow-[0_0_8px_rgba(72,159,181,0.5)] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="rounded-3xl border border-white/50 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-16 bg-[#489FB5] rounded-r-full" />
          
          <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-2.5">
            Pergunta {answered + 1} de {QUIZ_QUESTIONS.length}
          </p>
          <h3 className="font-serif text-xl font-normal text-[#0A1F3D] dark:text-white mb-6 leading-snug">
            {question.text}
          </h3>
          
          <div className="space-y-3">
            {question.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(opt.value)}
                className="w-full text-left rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC]/60 dark:bg-slate-900/40 px-5 py-4 text-xs md:text-sm text-[#0A1F3D] dark:text-slate-200 font-bold hover:border-[#489FB5] hover:bg-[#489FB5]/5 hover:text-[#489FB5] active:scale-[0.99] transition-all group flex items-center justify-between shadow-sm"
              >
                <span className="leading-snug">{opt.label}</span>
                <ChevronRight className="h-4 w-4 text-[#94A3B8] group-hover:text-[#489FB5] group-hover:translate-x-0.5 shrink-0 transition-all ml-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Back option */}
        {currentQ > 0 && (
          <button
            onClick={() => { setCurrentQ(currentQ - 1); const next = { ...answers }; delete next[question.id]; setAnswers(next) }}
            className="inline-flex items-center gap-1 text-[10px] font-bold text-[#94A3B8] hover:text-[#489FB5] uppercase tracking-wider transition-colors pt-2 pl-2"
          >
            ← Voltar para a pergunta anterior
          </button>
        )}
      </div>
    )
  }

  // Result
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Score card */}
      <div
        className="rounded-3xl border-2 p-8 text-center relative overflow-hidden shadow-2xl"
        style={{ borderColor: `${level.color}35`, backgroundColor: level.bgColor }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-transparent to-transparent opacity-15 rounded-full pointer-events-none" style={{ backgroundImage: `radial-gradient(circle, ${level.color} 0%, transparent 80%)` }} />
        
        <div className="text-5xl mb-3 transform hover:scale-110 transition-transform duration-300 inline-block">{level.icon}</div>
        <div className="text-6xl font-black tabular-nums tracking-tight leading-none mb-1.5" style={{ color: level.color }}>
          {score}
        </div>
        <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-4">de 100 pontos operacionais</div>
        
        <div
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wider shadow-sm"
          style={{ backgroundColor: `${level.color}18`, color: level.color }}
        >
          <Sparkles className="h-3.5 w-3.5" /> Clínica {level.label}
        </div>
        <p className="mt-4 text-xs md:text-sm text-[#64748B] dark:text-slate-300 font-semibold leading-relaxed max-w-sm mx-auto">{level.description}</p>

        {/* Score bar */}
        <div className="mt-7 h-3.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative shadow-inner">
          <div
            className="h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(72,159,181,0.3)]"
            style={{ width: `${score}%`, backgroundColor: level.color }}
          />
        </div>
        <div className="flex justify-between text-[9px] font-black text-[#94A3B8] uppercase tracking-wider mt-2.5 px-1">
          <span>Tradicional</span><span>Em Transição</span><span>Digitalizada</span><span>Avançada</span>
        </div>
      </div>

      {/* Levels legend */}
      <div className="grid grid-cols-4 gap-2 md:gap-3">
        {MATURITY_LEVELS.map((l) => (
          <div
            key={l.label}
            className="rounded-2xl border p-3 text-center transition-all bg-white/40 dark:bg-slate-900/40 shadow-sm"
            style={{
              borderColor: score >= l.range[0] && score <= l.range[1] ? `${l.color}45` : '#E2E8F0',
              backgroundColor: score >= l.range[0] && score <= l.range[1] ? `${l.color}15` : undefined,
            }}
          >
            <div className="text-xl mb-1">{l.icon}</div>
            <div className="text-[9px] font-black uppercase tracking-widest truncate" style={{ color: l.color }}>{l.label}</div>
            <div className="text-[9px] font-bold text-[#94A3B8] dark:text-slate-400 mt-0.5">{l.range[0]}–{l.range[1]} pts</div>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#489FB5]">Plano de Ação</span>
            <h3 className="font-serif text-lg font-normal text-[#0A1F3D] dark:text-white mt-0.5">Suas recomendações prioritárias</h3>
          </div>
          
          <div className="space-y-3">
            {recommendations.map((rec) => (
              <Link
                key={rec.featureSlug}
                href={`/features/${rec.featureSlug}` as any}
                className="flex items-start gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 p-5 hover:border-[#489FB5]/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <div className="h-10 w-10 rounded-xl shrink-0 bg-[#489FB5]/10 border border-[#489FB5]/15 flex items-center justify-center text-base">
                  ⚡
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#489FB5] mb-1">Módulo Recomendado</div>
                  <div className="text-sm font-bold text-[#0A1F3D] dark:text-white group-hover:text-[#489FB5] transition-colors leading-none">{rec.title}</div>
                  <div className="text-xs text-[#64748B] dark:text-slate-400 font-medium leading-relaxed mt-2">{rec.description}</div>
                </div>
                <ArrowRight className="h-4.5 w-4.5 text-[#94A3B8] group-hover:text-[#489FB5] group-hover:translate-x-1 shrink-0 mt-2 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Link
          href="/register"
          className="flex-grow flex items-center justify-center gap-2 rounded-2xl py-4 font-bold text-sm text-white transition-all shadow-xl shadow-[#489FB5]/20 hover:opacity-95 active:scale-[0.98]"
          style={{ backgroundColor: '#489FB5' }}
        >
          Ver o Estetia em ação — 14 dias grátis
          <ArrowRight className="h-4 w-4" />
        </Link>
        <button
          onClick={restart}
          className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 px-6 py-4 text-xs font-bold text-[#64748B] dark:text-slate-300 hover:border-[#0A1F3D]/20 hover:text-[#0A1F3D] dark:hover:text-white transition-all active:scale-[0.98]"
        >
          <RotateCcw className="h-4 w-4" />
          Refazer quiz
        </button>
      </div>
    </div>
  )
}
