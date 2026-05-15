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
    q: 'Por que existe uma Plataforma Base obrigatória?',
    a: 'A Base de R$ 39/mês inclui pacientes, agenda, LGPD, 2 usuários e suporte. É o mínimo necessário para uma clínica operar — todo o restante é opcional. Isso garante que você sempre tenha um sistema funcional mesmo sem nenhum add-on.',
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
    a: 'Oferecemos 7 dias grátis para testar todos os módulos. Após o trial, o valor mínimo é R$ 39/mês (Plataforma Base). Se você é uma clínica iniciante, podemos conversar sobre preços especiais — entre em contato.',
  },
]

export function FaqPricing() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {FAQS.map((f, i) => (
        <AccordionItem key={i} value={`item-${i}`}>
          <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed">
            {f.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
