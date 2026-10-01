import { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { FICHAS_BASE_PATH, FICHA_COM_LOGO, whatsappFicha } from '@/config/fichas-anamnese'

export const metadata: Metadata = {
  title: 'Falta só a sua logo',
  robots: { index: false, follow: false },
}

// Stripe sends the buyer here after paying. Delivery is by hand: this page only says what to send.
export default async function ObrigadoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const botao =
    'inline-flex min-h-12 items-center justify-center rounded-xl px-7 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F3D]'

  return (
    <div className="min-h-[70vh] bg-[#EEF0F8] px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl rounded-2xl border border-[#0A1F3D]/10 bg-white p-6 sm:p-10">
        <h1 className="font-serif text-3xl font-bold leading-tight text-[#0A1F3D]">Falta só a sua logo</h1>
        <p className="mt-4 text-base leading-relaxed text-[#334155]">
          Assim que o pagamento é confirmado, o Stripe envia o recibo para o seu e-mail. Para montarmos a ficha, envie:
        </p>
        <ol className="mt-4 list-decimal space-y-1 pl-5 text-base text-[#334155]">
          <li>A logo, em PNG, JPG ou PDF.</li>
          <li>O nome do negócio, do jeito que deve aparecer.</li>
          <li>Qual ficha você pediu.</li>
        </ol>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <a
            href={whatsappFicha('Olá! Paguei a ficha de anamnese com a minha logo. Vou enviar a logo e o nome do negócio.')}
            className={`${botao} bg-[#0A1F3D] text-white hover:bg-[#162D54]`}
          >
            Enviar pelo WhatsApp
          </a>
          <a
            href={`mailto:${FICHA_COM_LOGO.email}?subject=${encodeURIComponent('Ficha de anamnese com a minha logo')}`}
            className={`${botao} border border-[#0A1F3D]/30 text-[#0A1F3D] hover:bg-[#0A1F3D]/5`}
          >
            Enviar por e-mail
          </a>
        </div>
        <p className="mt-6 text-sm leading-relaxed text-[#475569]">
          Você recebe o PDF em até {FICHA_COM_LOGO.prazo} depois de enviar a logo. Desistiu? Você tem 7 dias para pedir o reembolso integral, pelo mesmo WhatsApp ou e-mail ({FICHA_COM_LOGO.email}).
        </p>
        <p className="mt-6">
          <Link href={FICHAS_BASE_PATH as any} className="text-sm font-semibold text-[#0A1F3D] underline">
            Ver todas as fichas de anamnese
          </Link>
        </p>
      </div>
    </div>
  )
}
