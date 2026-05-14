'use client'

import { useState } from 'react'
import { ArrowRight, ChevronRight, RotateCcw } from 'lucide-react'
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
  marketing: 'Marketing & Comunicação',
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
  const progress = (currentQ / QUIZ_QUESTIONS.length) * 100

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
      <div className="max-w-xl mx-auto text-center space-y-6">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#489FB5]/10 text-3xl">⚡</div>
        <div>
          <h3 className="font-serif text-2xl font-bold text-[#0A1F3D] mb-2">Quiz de 10 perguntas</h3>
          <p className="text-[#64748B] leading-relaxed">
            Responda honestamente para receber um diagnóstico preciso do nível digital da sua clínica,
            com recomendações personalizadas de melhorias.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm text-left">
          {Object.entries(DIMENSION_LABELS).map(([k, v]) => (
            <div key={k} className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5">
              <div className="h-2 w-2 rounded-full bg-[#489FB5]" />
              <span className="text-[#0A1F3D] font-medium text-xs">{v}</span>
            </div>
          ))}
        </div>
        <button
          onClick={() => setPhase('quiz')}
          className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 font-bold text-sm text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#489FB5' }}
        >
          Iniciar avaliação
          <ArrowRight className="h-4 w-4" />
        </button>
        <p className="text-[10px] text-[#94A3B8]">Sem cadastro · Sem e-mail · Resultado imediato</p>
      </div>
    )
  }

  if (phase === 'quiz') {
    const answered = Object.keys(answers).length
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span>{DIMENSION_LABELS[question.dimension]}</span>
            <span>{answered + 1} de {QUIZ_QUESTIONS.length}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-[#E2E8F0]">
            <div
              className="h-full rounded-full bg-[#489FB5] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="rounded-2xl border border-[#489FB5]/15 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-[#94A3B8] mb-3 uppercase tracking-wider">
            Pergunta {answered + 1}
          </p>
          <h3 className="font-serif text-xl font-bold text-[#0A1F3D] mb-6 leading-snug">
            {question.text}
          </h3>
          <div className="space-y-3">
            {question.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(opt.value)}
                className="w-full text-left rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3.5 text-sm text-[#0A1F3D] font-medium hover:border-[#489FB5]/40 hover:bg-[#489FB5]/5 hover:text-[#489FB5] transition-all group flex items-center justify-between"
              >
                <span>{opt.label}</span>
                <ChevronRight className="h-4 w-4 text-[#94A3B8] group-hover:text-[#489FB5] shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Back option */}
        {currentQ > 0 && (
          <button
            onClick={() => { setCurrentQ(currentQ - 1); const next = { ...answers }; delete next[question.id]; setAnswers(next) }}
            className="text-xs text-[#94A3B8] hover:text-[#64748B] transition-colors"
          >
            ← Voltar à pergunta anterior
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
        className="rounded-2xl border p-6 text-center"
        style={{ borderColor: `${level.color}30`, backgroundColor: level.bgColor }}
      >
        <div className="text-4xl mb-2">{level.icon}</div>
        <div className="text-5xl font-bold tabular-nums mb-1" style={{ color: level.color }}>{score}</div>
        <div className="text-xs text-[#94A3B8] mb-3">de 100 pontos</div>
        <div
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold"
          style={{ backgroundColor: `${level.color}15`, color: level.color }}
        >
          {level.icon} Clínica {level.label}
        </div>
        <p className="mt-3 text-sm text-[#64748B] leading-relaxed max-w-sm mx-auto">{level.description}</p>

        {/* Score bar */}
        <div className="mt-5 h-3 w-full rounded-full bg-[#E2E8F0] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${score}%`, backgroundColor: level.color }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-[#94A3B8] mt-1">
          <span>Tradicional</span><span>Em Transição</span><span>Digital</span><span>Avançada</span>
        </div>
      </div>

      {/* Levels legend */}
      <div className="grid grid-cols-4 gap-2">
        {MATURITY_LEVELS.map((l) => (
          <div
            key={l.label}
            className="rounded-xl border p-2.5 text-center"
            style={{
              borderColor: `${l.color}30`,
              backgroundColor: score >= l.range[0] && score <= l.range[1] ? `${l.color}15` : undefined,
            }}
          >
            <div className="text-lg">{l.icon}</div>
            <div className="text-[10px] font-bold" style={{ color: l.color }}>{l.label}</div>
            <div className="text-[9px] text-[#94A3B8]">{l.range[0]}–{l.range[1]}</div>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <h3 className="font-serif text-lg font-bold text-[#0A1F3D] mb-3">Suas recomendações prioritárias</h3>
          <div className="space-y-3">
            {recommendations.map((rec) => (
              <Link
                key={rec.featureSlug}
                href={`/features/${rec.featureSlug}` as any}
                className="flex items-start gap-4 rounded-xl border border-[#E2E8F0] bg-white p-4 hover:border-[#489FB5]/30 hover:shadow-sm transition-all group"
              >
                <div className="h-9 w-9 rounded-xl shrink-0 bg-[#489FB5]/10 flex items-center justify-center text-sm">
                  ⚡
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-[#0A1F3D] group-hover:text-[#489FB5] transition-colors">{rec.title}</div>
                  <div className="text-xs text-[#64748B] mt-0.5">{rec.description}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-[#94A3B8] group-hover:text-[#489FB5] shrink-0 mt-0.5 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/register"
          className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3.5 font-bold text-sm text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#489FB5' }}
        >
          Ver Estetia em ação — 14 dias grátis
          <ArrowRight className="h-4 w-4" />
        </Link>
        <button
          onClick={restart}
          className="flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] px-5 py-3.5 text-sm font-medium text-[#64748B] hover:border-[#0A1F3D]/20 hover:text-[#0A1F3D] transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Refazer quiz
        </button>
      </div>
    </div>
  )
}
