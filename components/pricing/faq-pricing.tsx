'use client'

import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion'

const FAQS = [
  {
    q: 'Posso trocar de módulos a qualquer momento?',
    a: 'Sim. Você pode adicionar ou remover módulos a qualquer momento direto no painel. Mudanças são aplicadas imediatamente com proração no próximo ciclo. Sem multa, sem fidelidade.',
  },
  {
    q: 'Como funciona o trial gratuito de 7 dias?',
    a: 'Você cria sua conta e pode testar gratuitamente todos os módulos selecionados por 7 dias. Não cobramos nada nesse período e você pode cancelar a qualquer momento. Não pedimos cartão de crédito no signup.',
  },
  {
    q: 'O que é a Plataforma Base de R$ 39/mês?',
    a: 'A Base é a fundação obrigatória do sistema. Ela entrega a infraestrutura compartilhada que todos os outros módulos precisam para funcionar: login, gestão de 2 usuários, cadastro ilimitado de pacientes, agenda básica (1 profissional + 1 sala), LGPD completa (consentimentos, audit log, direito ao esquecimento), dashboard com KPIs gerais e suporte por e-mail. Pense nela como o sistema operacional sobre o qual você instala os módulos clínicos.',
  },
  {
    q: 'Posso assinar só a Plataforma Base por R$ 39?',
    a: 'Tecnicamente sim, mas não recomendamos — a Base sozinha não opera uma clínica. Ela não inclui prontuário eletrônico, controle de procedimentos, fotos, pacotes, WhatsApp ou recall. Para conseguir atender pacientes de verdade você precisa adicionar pelo menos um módulo clínico (Prontuário R$ 29 ou Procedimentos R$ 19). O combo mais leve fica em R$ 58/mês (Base + Prontuário). Por isso a Base não é vendida isoladamente como "plano" — ela é o componente obrigatório de qualquer assinatura.',
  },
  {
    q: 'Como vocês cobram por mais usuários?',
    a: 'Cada plano inclui 2 usuários, 1 sala e 1 profissional na agenda. Acima disso você paga R$ 19/usuário, R$ 9/sala e R$ 15/profissional. Ideal para clínicas que crescem aos poucos.',
  },
  {
    q: 'Qual a diferença entre WhatsApp Evolution e Cloud API?',
    a: 'Evolution (R$ 79) é uma integração não-oficial que funciona com WhatsApp pessoal. Cloud API (R$ 149) é o WhatsApp Business oficial Meta com selo verificado, templates aprovados e conformidade enterprise. Recomendamos Cloud API se você fará campanhas em massa.',
  },
  {
    q: 'Posso ter mais de uma instância de WhatsApp?',
    a: 'Sim. Cada módulo de WhatsApp inclui 1 instância. Instâncias adicionais custam R$ 49/mês cada. Você pode até combinar Evolution + Cloud API para casos avançados.',
  },
  {
    q: 'TISS é obrigatório para clínica de estética?',
    a: 'Não. TISS só é necessário se você atende convênios médicos (saúde suplementar). Clínicas particulares não precisam. Por isso TISS é um módulo opcional de R$ 59/mês — você só ativa se precisar.',
  },
  {
    q: 'Os preços incluem implantação?',
    a: 'Sim, 100%. Não cobramos taxa de setup nem treinamento. Onboarding guiado dentro do próprio sistema com checklist de configuração. Tutoriais em vídeo e suporte por chat inclusos.',
  },
  {
    q: 'Como funciona o desconto anual de 15%?',
    a: 'Ao escolher pagamento anual, aplicamos 15% de desconto sobre o total. Você paga 1× a cada 12 meses (via boleto ou cartão) e economiza ~2 meses no ano. Pode cancelar a qualquer momento com reembolso proporcional.',
  },
  {
    q: 'Vocês têm versão grátis?',
    a: 'Oferecemos 7 dias grátis para testar todos os módulos. Após o trial, a assinatura mais leve fica em R$ 58/mês (Plataforma Base R$ 39 + Procedimentos R$ 19, combo mínimo para uma clínica iniciante operar). Se quiser prontuário eletrônico junto, o combo Base + Prontuário fica em R$ 68/mês. Se você está começando agora, podemos conversar sobre preços especiais — entre em contato.',
  },
]

export function FaqPricing() {
  return (
    <Accordion type="single" collapsible className="w-full flex flex-col gap-2">
      {FAQS.map((f, i) => (
        <AccordionItem 
          key={i} 
          value={`item-${i}`}
          className="border-b-0 bg-white/20 dark:bg-slate-900/10 backdrop-blur-xs rounded-2xl border border-slate-200/30 dark:border-white/5 px-5 transition-all duration-350 hover:bg-white/40 dark:hover:bg-slate-900/20 data-[state=open]:bg-white/60 dark:data-[state=open]:bg-slate-900/30 data-[state=open]:border-[#C5A059]/25 shadow-xs"
        >
          <AccordionTrigger className="text-left font-serif font-bold text-sm text-[#0A1F3D] dark:text-slate-100 hover:text-[#C5A059] dark:hover:text-[#C5A059] transition-all duration-200 py-4 hover:no-underline">
            {f.q}
          </AccordionTrigger>
          <AccordionContent className="text-xs font-sans font-medium text-slate-500 dark:text-slate-400 leading-relaxed pb-4 pt-1 pr-4">
            {f.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

