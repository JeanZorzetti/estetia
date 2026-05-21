'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Users, Gift, TrendingDown, ArrowRight, Check, Star, Sparkles } from 'lucide-react'
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
    description: 'Envie para amigos, equipes de vendas, parceiros — qualquer empresa que precise de um CRM.',
  },
  {
    number: '03',
    title: 'Eles assinem',
    description: 'Quando seu indicado fechar qualquer plano pago, os descontos são ativados automaticamente.',
  },
  {
    number: '04',
    title: 'Vocês ganham',
    description: 'Seu indicado ganha 20% off por 3 meses. Você acumula +15% de desconto recorrente.',
  },
]

const faqs = [
  {
    q: 'O desconto é realmente recorrente?',
    a: 'Sim. Enquanto seu indicado mantiver a assinatura ativa, você continua recebendo os 15% de desconto todo mês — não é um benefício único.',
  },
  {
    q: 'O que acontece se o indicado cancelar?',
    a: 'Se um indicado cancelar, os 15% correspondentes a ele são removidos do seu desconto acumulado. Os outros permanecem.',
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
    a: 'Automaticamente assim que o pagamento do indicado for confirmado. Você recebe uma notificação e o desconto aparece na próxima fatura.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
}

function ReferralCalculator() {
  const [mensalidade, setMensalidade] = useState(200)
  const [referrals, setReferrals] = useState(0)

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
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-muted/30" />
      <div className="relative mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4">Calcule sua economia</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Informe sua mensalidade atual e veja quanto você paga com indicações ativas.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl border border-border/50 bg-background/50 backdrop-blur-xl shadow-2xl p-8 space-y-8"
        >
          {/* Mensalidade input */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-foreground">
              Quanto você paga hoje no Estetia?
            </label>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-muted-foreground">R$</span>
              <input
                type="number"
                min={58}
                max={2000}
                step={10}
                value={mensalidade}
                onChange={(e) => setMensalidade(Math.max(58, Math.min(2000, Number(e.target.value))))}
                className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-lg font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <input
              type="range"
              min={58}
              max={2000}
              step={10}
              value={mensalidade}
              onChange={(e) => setMensalidade(Number(e.target.value))}
              className="w-full mt-3 accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>R$58 (mínimo)</span>
              <span>R$2.000</span>
            </div>
          </div>

          {/* Referrals selector */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-foreground">
              Quantas indicações ativas você tem?
            </label>
            <div className="flex flex-wrap gap-2">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => (
                <button
                  key={n}
                  onClick={() => setReferrals(n)}
                  className={`w-11 h-11 rounded-xl text-sm font-bold transition-all duration-200 ${
                    referrals === n
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105'
                      : 'bg-muted/60 text-foreground hover:bg-muted'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Cada indicação ativa = +15% de desconto na sua mensalidade
            </p>
          </div>

          {/* Result display */}
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-background border border-primary/20 p-6 space-y-4">
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Sua mensalidade hoje</span>
              <span className="font-semibold text-foreground tabular-nums">{fmt(mensalidade)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Desconto acumulado</span>
              <span className="font-bold text-primary tabular-nums">{discount}%</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">Você passa a pagar</span>
              <div className="text-right">
                <div className={`text-3xl font-black tabular-nums ${isFree ? 'text-green-500' : 'text-primary'}`}>
                  {isFree ? 'R$ 0,00' : fmt(youPay)}
                </div>
                {isFree && (
                  <Badge className="mt-1 bg-green-500 text-white animate-pulse text-xs">Grátis!</Badge>
                )}
              </div>
            </div>
            {savings > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Economia mensal</span>
                <span className="font-semibold text-green-600 tabular-nums">−{fmt(savings)}</span>
              </div>
            )}
            {annualSavings > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Economia anual estimada</span>
                <span className="font-semibold text-green-600 tabular-nums">−{fmt(annualSavings)}</span>
              </div>
            )}
          </div>
        </motion.div>
        <p className="mt-6 text-sm text-muted-foreground text-center flex items-center justify-center gap-2">
          <Check className="w-4 h-4 text-green-500" />
          O desconto permanece ativo enquanto a indicação mantiver a assinatura paga.
        </p>
      </div>
    </section>
  )
}

export function IndiqueClient() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">

      {/* Hero */}
      <section className="relative py-32 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 w-full max-w-4xl -translate-x-1/2 h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50 dark:opacity-30" />
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative mx-auto max-w-5xl text-center z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary font-medium text-sm backdrop-blur-md shadow-[0_0_20px_rgba(var(--primary),0.2)]">
              <Sparkles className="w-4 h-4" />
              <span>Programa de Indicação Estetia</span>
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-[5rem] leading-[1.1]"
          >
            Indique. Ganhe.<br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-purple-600">
              {' '}Zere a mensalidade.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Cada amigo que você indica e assina o Estetia vale <strong className="text-foreground font-semibold">15% de desconto recorrente</strong> na sua mensalidade.
            Com 7 indicações ativas, você usa o CRM de graça — para sempre.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button asChild size="lg" className="h-14 px-8 rounded-full text-base font-semibold shadow-xl shadow-primary/25 transition-transform hover:-translate-y-1">
              <Link href="/dashboard/billing">
                Acessar meu link de indicação
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-8 rounded-full text-base font-semibold border-border/50 bg-background/50 backdrop-blur-md hover:bg-muted transition-transform hover:-translate-y-1">
              <Link href="/register">
                Criar conta grátis
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="relative px-6 -mt-10 z-20">
        <div className="mx-auto max-w-5xl">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { value: '+15%', label: 'de desconto por indicação ativa', icon: TrendingDown },
              { value: '20%', label: 'off para quem você indicar (3 meses)', icon: Gift },
              { value: '7', label: 'indicações para zerar sua mensalidade', icon: Users }
            ].map((stat, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card className="bg-background/60 backdrop-blur-xl border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="p-8 text-center flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div className="text-4xl font-black text-foreground mb-2 tracking-tight">{stat.value}</div>
                    <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-32 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Como funciona</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Um processo simples, transparente e 100% automático para você e seus indicados.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connection Line (Desktop only) */}
            <div className="hidden lg:block absolute top-[44px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-border to-transparent z-0" />
            
            {steps.map((step, idx) => (
              <motion.div 
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative z-10"
              >
                <div className="flex flex-col items-center text-center group">
                  <div className="w-24 h-24 rounded-3xl bg-background border border-border shadow-sm flex items-center justify-center mb-6 relative overflow-hidden transition-transform duration-300 group-hover:scale-110 group-hover:shadow-primary/20 group-hover:shadow-xl group-hover:border-primary/30">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-foreground to-muted-foreground">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Referral Calculator */}
      <ReferralCalculator />

      {/* Indicado benefits */}
      <section className="py-32 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold tracking-tight mb-6">Quem você indica<br/>também sai ganhando</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
              Seu link não é apenas um convite — é um benefício exclusivo. Quem se cadastra através da sua indicação recebe{' '}
              <strong className="text-foreground font-semibold bg-primary/10 px-2 py-0.5 rounded text-primary">
                20% de desconto nos 3 primeiros meses
              </strong>{' '}
              em qualquer combinação de módulos que ele escolher.
            </p>
            <div className="inline-flex items-center gap-4 p-6 rounded-2xl border border-border/50 bg-muted/20">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                <Gift className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-lg">20% off por 3 meses</div>
                <div className="text-sm text-muted-foreground">
                  Válido para qualquer combo de módulos, sem valor mínimo.
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 px-6 relative bg-muted/20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">FAQ</Badge>
            <h2 className="text-4xl font-bold tracking-tight">Perguntas Frequentes</h2>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border border-border/50 rounded-xl px-6 bg-background hover:bg-muted/30 transition-colors data-[state=open]:bg-muted/30">
                  <AccordionTrigger className="text-left font-semibold py-5 hover:no-underline text-base">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 leading-relaxed text-base">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="relative mx-auto max-w-3xl text-center z-10">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/30"
          >
            <Star className="w-10 h-10 text-white fill-white/20" />
          </motion.div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">Pronto para zerar sua assinatura?</h2>
          <p className="text-xl text-muted-foreground mb-12">
            Faça login para copiar seu link exclusivo e começar a acumular descontos hoje mesmo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="h-14 px-8 rounded-full text-base font-semibold shadow-xl shadow-primary/25 transition-transform hover:-translate-y-1">
              <Link href="/dashboard/billing">
                Pegar meu link agora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-8 rounded-full text-base font-semibold border-border/50 bg-background/50 backdrop-blur-md hover:bg-muted transition-transform hover:-translate-y-1">
              <Link href="/register">
                Criar conta grátis
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
