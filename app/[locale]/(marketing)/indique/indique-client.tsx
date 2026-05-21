'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Users, Gift, TrendingDown, ArrowRight, Check, Star, Sparkles, HelpCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'

const steps = [
  {
    number: '01',
    title: 'Copie seu link',
    description: 'Acesse o dashboard e copie seu link exclusivo de indicação em Assinatura & Faturamento.',
  },
  {
    number: '02',
    title: 'Compartilhe',
    description: 'Envie para amigos, equipes de vendas, parceiros — qualquer clínica ou empresa de estética.',
  },
  {
    number: '03',
    title: 'Eles assinam',
    description: 'Quando seu indicado fechar qualquer plano pago, os descontos são ativados automaticamente.',
  },
  {
    number: '04',
    title: 'Vocês ganham',
    description: 'Seu indicado ganha 20% off por 3 meses. Você acumula +15% de desconto recorrente na fatura.',
  },
]

const faqs = [
  {
    q: 'O desconto é realmente recorrente?',
    a: 'Sim. Enquanto seu indicado mantiver a assinatura ativa, você continua recebendo os 15% de desconto todo mês — não é um benefício único.',
  },
  {
    q: 'O que acontece se o indicado cancelar?',
    a: 'Se um indicado cancelar, os 15% correspondentes a ele são removidos do seu desconto acumulado. Os outros permanecem ativos.',
  },
  {
    q: 'Tem limite de indicações?',
    a: 'Não! Você pode indicar quantas pessoas quiser. O desconto acumula até 100% — a partir daí sua mensalidade é zerada e permanece assim enquanto as indicações estiverem ativas.',
  },
  {
    q: 'O desconto dos 20% para o indicado se aplica a qualquer combinação de módulos?',
    a: 'Sim. O desconto de 20% para quem você indica se aplica em qualquer combinação de módulos que ele escolher no Estetia, durante os 3 primeiros meses da assinatura paga.',
  },
  {
    q: 'Quando o desconto é ativado?',
    a: 'Automaticamente assim que o pagamento do indicado for confirmado. Você recebe uma notificação e o desconto aparece na próxima fatura emitida.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
}

function ReferralCalculator() {
  const [mensalidade, setMensalidade] = useState(250)
  const [referrals, setReferrals] = useState(3)

  const { discount, youPay, savings, annualSavings, isFree } = useMemo(() => {
    const disc = Math.min(referrals * 15, 100)
    const pays = Math.max(0, Math.round(mensalidade * (100 - disc)) / 100)
    const save = mensalidade - pays
    return {
      discount: disc,
      youPay: pays,
      savings: save,
      annualSavings: save * 12,
      isFree: disc >= 100,
    }
  }, [mensalidade, referrals])

  const fmt = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })

  return (
    <section className="py-24 px-6 relative overflow-hidden bg-background">
      {/* Halos de Luz sutil de fundo para a Calculadora */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#C5A059]/10 via-[#489FB5]/5 to-transparent blur-[140px] pointer-events-none rounded-full" />
      
      <div className="relative mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-normal tracking-tight mb-4 font-serif text-[#0A1F3D] dark:text-white">
            Calcule sua economia de prestígio
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Informe sua assinatura atual e simule o valor final conforme suas indicações ativas crescem.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl border border-white/10 dark:border-white/5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.3)] p-6 sm:p-10 space-y-10 relative overflow-hidden"
        >
          {/* Brilho Superior */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/50 to-transparent" />

          {/* Mensalidade input */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold tracking-wide text-[#0A1F3D] dark:text-slate-200 uppercase">
                Sua mensalidade atual no Estetia
              </label>
              <div className="flex items-center gap-2 bg-white/60 dark:bg-slate-950/60 border border-white/20 dark:border-white/10 rounded-xl px-4 py-2 shadow-inner">
                <span className="text-xs font-bold text-[#C5A059]">R$</span>
                <input
                  type="number"
                  min={58}
                  max={2000}
                  step={10}
                  value={mensalidade}
                  onChange={(e) => setMensalidade(Math.max(58, Math.min(2000, Number(e.target.value))))}
                  className="w-20 bg-transparent text-right font-bold text-lg text-foreground focus:outline-none tabular-nums"
                />
              </div>
            </div>
            
            <div className="relative pt-4">
              <input
                type="range"
                min={58}
                max={2000}
                step={10}
                value={mensalidade}
                onChange={(e) => setMensalidade(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-slate-200 dark:bg-slate-800 accent-[#C5A059] focus:outline-none"
                style={{
                  background: `linear-gradient(to right, #C5A059 0%, #C5A059 ${((mensalidade - 58) / (2000 - 58)) * 100}%, #e2e8f0 ${((mensalidade - 58) / (2000 - 58)) * 100}%)`
                }}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2 font-medium">
                <span>R$ 58 (Base)</span>
                <span>R$ 2.000 (Clínicas Premium)</span>
              </div>
            </div>
          </div>

          {/* Referrals selector */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold tracking-wide text-[#0A1F3D] dark:text-slate-200 uppercase">
              Quantas indicações ativas você tem?
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => {
                const isActive = referrals === n
                return (
                  <button
                    key={n}
                    onClick={() => setReferrals(n)}
                    className={`h-12 rounded-xl text-sm font-bold transition-all duration-300 relative overflow-hidden ${
                      isActive
                        ? 'bg-gradient-to-b from-[#C5A059] to-[#B38F46] text-[#0A1F3D] shadow-[0_8px_20px_rgba(197,160,89,0.3)] scale-[1.03]'
                        : 'bg-white/40 dark:bg-slate-950/40 text-foreground border border-white/10 hover:bg-[#C5A059]/10'
                    }`}
                  >
                    {n}
                    {n === 7 && (
                      <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
                    )}
                  </button>
                )
              })}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Cada indicação ativa vale 15% de desconto recorrente na fatura. Com 7 indicações, a mensalidade zera!</span>
            </div>
          </div>

          {/* Result display */}
          <div className="rounded-2xl border border-white/10 dark:border-white/5 bg-gradient-to-b from-white/60 to-white/20 dark:from-slate-950/60 dark:to-slate-950/20 p-6 sm:p-8 space-y-5 relative shadow-[0_8px_32px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Mensalidade atual</span>
              <span className="font-semibold text-[#0A1F3D] dark:text-slate-200 tabular-nums">{fmt(mensalidade)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Desconto acumulado ({referrals} ativos)</span>
              <span className="font-bold text-[#C5A059] bg-[#C5A059]/10 px-2.5 py-0.5 rounded-full text-xs">
                {discount}% OFF
              </span>
            </div>
            <div className="h-px bg-slate-200/50 dark:bg-slate-800/50" />
            
            <div className="flex justify-between items-center pt-2">
              <span className="font-serif font-normal text-lg sm:text-xl text-[#0A1F3D] dark:text-white">
                Sua nova mensalidade
              </span>
              <div className="text-right">
                <div className={`text-3xl sm:text-4xl font-extrabold tabular-nums tracking-tight ${isFree ? 'text-emerald-500' : 'text-foreground'}`}>
                  {isFree ? 'R$ 0,00' : fmt(youPay)}
                </div>
                {isFree && (
                  <Badge className="mt-1 bg-emerald-500 text-white animate-pulse border-none shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                    MENSALIDADE ZERADA!
                  </Badge>
                )}
              </div>
            </div>

            {(savings > 0 || annualSavings > 0) && (
              <div className="pt-4 space-y-2 border-t border-slate-200/50 dark:bg-transparent dark:border-slate-800/50">
                {savings > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Economia mensal</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-500 tabular-nums">−{fmt(savings)}</span>
                  </div>
                )}
                {annualSavings > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Economia anual estimada</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-500 tabular-nums">−{fmt(annualSavings)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
        
        <p className="mt-6 text-xs sm:text-sm text-muted-foreground text-center flex items-center justify-center gap-2 font-medium">
          <Check className="w-4 h-4 text-emerald-500" />
          Os descontos são válidos e vitalícios enquanto as assinaturas indicadas permanecerem ativas.
        </p>
      </div>
    </section>
  )
}

export function IndiqueClient() {
  return (
    <div className="min-h-screen bg-background selection:bg-[#C5A059]/20 text-foreground overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative py-28 sm:py-36 px-6 overflow-hidden">
        {/* Halos de Brilho de Elite */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full max-w-5xl h-[600px] bg-gradient-to-b from-[#C5A059]/10 via-[#489FB5]/5 to-transparent blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute top-40 right-[-10%] w-[500px] h-[500px] bg-[#489FB5]/5 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-60 left-[-10%] w-[500px] h-[500px] bg-[#C5A059]/5 blur-[120px] pointer-events-none rounded-full" />

        <div className="relative mx-auto max-w-5xl text-center z-10 space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/10 text-[#C5A059] font-semibold text-xs tracking-wider uppercase backdrop-blur-md shadow-[0_4px_20px_rgba(197,160,89,0.15)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Programa VIP de Indicação</span>
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight font-serif text-[#0A1F3D] dark:text-white leading-[1.15]"
          >
            Indique. Ganhe.<br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#E2C799] to-[#C5A059] font-normal italic">
              Zere a sua assinatura.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Cada colega que você indica e se torna assinante no Estetia garante a você <strong className="text-foreground font-semibold">15% de desconto recorrente</strong>.
            Com 7 indicações ativas, você utiliza o melhor CRM de estética gratuitamente.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button asChild size="lg" className="h-14 px-8 rounded-full text-sm font-semibold tracking-wide uppercase bg-gradient-to-r from-[#C5A059] to-[#E2C799] hover:from-[#E2C799] hover:to-[#C5A059] text-[#0A1F3D] border border-[#C5A059]/30 shadow-[0_10px_30px_rgba(197,160,89,0.25)] transition-all duration-300 hover:-translate-y-1">
              <Link href="/dashboard/billing">
                Pegar meu link exclusivo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-8 rounded-full text-sm font-semibold tracking-wide uppercase border-white/20 dark:border-white/10 bg-white/10 dark:bg-slate-900/10 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 hover:-translate-y-1">
              <Link href="/register">
                Criar conta de avaliação
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Cards Section */}
      <section className="relative px-6 -mt-8 z-20">
        <div className="mx-auto max-w-5xl">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { value: '+15%', label: 'Desconto mensal e vitalício por indicação ativa', icon: TrendingDown },
              { value: '20%', label: 'Desconto garantido para seus indicados nos 3 meses iniciais', icon: Gift },
              { value: '7', label: 'Indicações de prestígio necessárias para anular sua mensalidade', icon: Users }
            ].map((stat, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 overflow-hidden relative group">
                  {/* Luz de Topo Brilhante em Dourado */}
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardContent className="p-8 text-center flex flex-col items-center justify-center space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#C5A059]/10 to-[#C5A059]/20 text-[#C5A059] flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div className="text-4xl font-extrabold text-foreground tracking-tight font-serif bg-clip-text bg-gradient-to-b from-foreground to-foreground/80">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground font-medium max-w-[200px] leading-relaxed">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 px-6 bg-background relative">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[350px] h-[350px] bg-[#489FB5]/5 blur-[120px] pointer-events-none rounded-full" />
        
        <div className="mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight mb-4 font-serif text-[#0A1F3D] dark:text-white">
              Como funciona o programa
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Zerar a assinatura do seu CRM de estética é muito simples. Siga os passos e acumule benefícios recorrentes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Linha Conectora Decorativa no Desktop */}
            <div className="hidden lg:block absolute top-[48px] left-[12%] right-[12%] h-[1px] bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent z-0" />
            
            {steps.map((step, idx) => (
              <motion.div 
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 group"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Bolha do Passo */}
                  <div className="w-24 h-24 rounded-3xl bg-white/50 dark:bg-slate-900/50 border border-white/10 dark:border-white/5 shadow-md flex items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:border-[#C5A059]/30 group-hover:shadow-[0_12px_24px_rgba(197,160,89,0.1)]">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="text-3xl font-black font-serif text-transparent bg-clip-text bg-gradient-to-br from-[#C5A059] to-[#B38F46]">{step.number}</span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground pt-2">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed px-4">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Referral Calculator Integration */}
      <ReferralCalculator />

      {/* Gold Ticket Benefit Destaque */}
      <section className="py-28 px-6 bg-background relative overflow-hidden">
        {/* Brilho Dourado por trás do Ticket */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#C5A059]/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-4xl relative z-10 text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-normal tracking-tight font-serif text-[#0A1F3D] dark:text-white">
            Quem você indica também sai ganhando
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            O seu link exclusivo de indicação não serve apenas para gerar o seu desconto — ele funciona como um passe de entrada exclusivo.
          </p>

          {/* Gold Ticket Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto max-w-2xl rounded-3xl border border-[#C5A059]/30 bg-gradient-to-b from-[#C5A059]/10 to-white/5 dark:to-slate-900/5 backdrop-blur-xl p-8 sm:p-12 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.25)] group"
          >
            {/* Detalhe de luxo das bordas pontilhadas (Ticket) */}
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-[radial-gradient(#C5A059_2px,transparent_2px)] bg-[size:1px_12px] opacity-40" />
            <div className="absolute top-0 bottom-0 right-0 w-1 bg-[radial-gradient(#C5A059_2px,transparent_2px)] bg-[size:1px_12px] opacity-40" />
            
            {/* Recortes de Ticket nas laterais */}
            <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-background border-r border-[#C5A059]/30 -translate-y-1/2 z-20" />
            <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-background border-l border-[#C5A059]/30 -translate-y-1/2 z-20" />

            <div className="flex flex-col items-center space-y-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#E2C799] flex items-center justify-center shadow-lg shadow-[#C5A059]/20 group-hover:scale-105 transition-transform duration-300">
                <Gift className="w-6 h-6 text-[#0A1F3D]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold tracking-wide uppercase text-[#C5A059]">20% OFF por 3 Meses</h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                  Válido para qualquer combinação de módulos contratados pelo indicado, sem valor mínimo exigido.
                </p>
              </div>

              <div className="w-full border-t border-dashed border-[#C5A059]/25 py-4 flex flex-col sm:flex-row justify-between items-center text-xs text-muted-foreground font-semibold uppercase tracking-wider gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                  <span>Código de Indicação VIP</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                  <span>Estetia CRM</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-28 px-6 relative bg-slate-50/50 dark:bg-slate-900/10">
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#C5A059]/3 blur-[120px] pointer-events-none rounded-full" />
        
        <div className="mx-auto max-w-3xl relative z-10">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 border-[#C5A059]/30 text-[#C5A059] bg-[#C5A059]/5 py-1 px-3">
              FAQ
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight font-serif text-[#0A1F3D] dark:text-white">
              Perguntas Frequentes
            </h2>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, i) => (
                <AccordionItem 
                  key={i} 
                  value={`item-${i}`} 
                  className="border border-white/10 dark:border-white/5 rounded-2xl px-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md hover:bg-white/60 dark:hover:bg-slate-900/60 transition-colors duration-300 shadow-sm data-[state=open]:bg-white/80 dark:data-[state=open]:bg-slate-900/80"
                >
                  <AccordionTrigger className="text-left font-semibold py-5 hover:no-underline text-base text-foreground flex items-center justify-between group">
                    <span className="group-hover:text-[#C5A059] transition-colors">{faq.q}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 leading-relaxed text-sm sm:text-base font-medium">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA Final VIP Section */}
      <section className="py-32 px-6 relative overflow-hidden bg-background">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[500px] bg-gradient-to-tr from-[#C5A059]/10 via-[#489FB5]/5 to-transparent blur-[140px] pointer-events-none rounded-full" />
        
        <div className="relative mx-auto max-w-3xl text-center z-10 space-y-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#C5A059] to-[#E2C799] flex items-center justify-center mx-auto shadow-2xl shadow-[#C5A059]/30"
          >
            <Star className="w-7 h-7 text-[#0A1F3D] fill-[#0A1F3D]/20" />
          </motion.div>

          <div className="space-y-4">
            <h2 className="text-3xl sm:text-5xl font-light tracking-tight font-serif text-[#0A1F3D] dark:text-white">
              Pronto para zerar sua assinatura?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto">
              Acesse sua conta exclusiva para copiar seu link personalizado e convidar suas clínicas parceiras hoje mesmo.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button asChild size="lg" className="h-14 px-8 rounded-full text-sm font-semibold tracking-wide uppercase bg-gradient-to-r from-[#C5A059] to-[#E2C799] hover:from-[#E2C799] hover:to-[#C5A059] text-[#0A1F3D] border border-[#C5A059]/30 shadow-[0_10px_30px_rgba(197,160,89,0.25)] transition-all duration-300 hover:-translate-y-1">
              <Link href="/dashboard/billing">
                Copiar meu link agora
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-8 rounded-full text-sm font-semibold tracking-wide uppercase border-white/20 dark:border-white/10 bg-white/10 dark:bg-slate-900/10 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 hover:-translate-y-1">
              <Link href="/register">
                Criar conta de avaliação
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
