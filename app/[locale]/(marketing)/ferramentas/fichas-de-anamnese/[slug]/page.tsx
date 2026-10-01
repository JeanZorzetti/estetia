import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { Download } from 'lucide-react'
import { buildLocaleAlternates } from '@/lib/seo/canonical'
import { Link } from '@/i18n/routing'
import { FichaFolha } from '@/components/fichas/ficha-folha'
import { BotaoImprimir, InteresseDigital, PedirComLogo } from '@/components/fichas/ficha-acoes'
import {
  FICHAS,
  FICHAS_ATUALIZADO_EM,
  FICHAS_BASE_PATH,
  FICHA_COM_LOGO,
  faqComum,
  fichaImagem,
  fichaPath,
  fichaPdf,
  getFicha,
} from '@/config/fichas-anamnese'

const BASE_URL = 'https://estetiacrm.com.br'

// Only the forms in config/fichas-anamnese.ts exist; anything else is a 404, not a render.
export const dynamicParams = false

export function generateStaticParams() {
  return FICHAS.map(({ slug }) => ({ slug }))
}

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const ficha = getFicha(slug)
  if (!ficha) return {}
  const alternates = buildLocaleAlternates(locale, fichaPath(slug))
  const imagem = { url: `${BASE_URL}${fichaImagem(slug)}`, width: 1240, height: 1754, alt: `${ficha.nome} para imprimir` }
  return {
    title: ficha.title,
    description: ficha.description,
    alternates,
    openGraph: { title: ficha.title, description: ficha.description, url: alternates.canonical, type: 'article', images: [imagem] },
    twitter: { card: 'summary_large_image', title: ficha.title, description: ficha.description, images: [imagem.url] },
  }
}

export default async function FichaPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const ficha = getFicha(slug)
  if (!ficha) notFound()

  const url = `${BASE_URL}${fichaPath(slug)}`
  const pdf = fichaPdf(slug)
  const imagem = fichaImagem(slug)
  const nomeMinusculo = ficha.nome.toLowerCase()
  const faq = [...ficha.faq, ...faqComum(ficha)]
  const secoes = [...new Set(ficha.template.fields.map((c) => c.section))].filter((s) => s !== 'Assinaturas')
  const outras = FICHAS.filter((f) => f.slug !== slug)

  // One @graph per page; Organization and WebSite come from the root layout and are referenced by @id.
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: ficha.title,
        description: ficha.description,
        inLanguage: 'pt-BR',
        isPartOf: { '@id': `${BASE_URL}/#website` },
        dateModified: FICHAS_ATUALIZADO_EM,
        primaryImageOfPage: { '@id': `${url}#imagem` },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        mainEntity: { '@id': `${url}#ficha` },
      },
      {
        '@type': 'ImageObject',
        '@id': `${url}#imagem`,
        contentUrl: `${BASE_URL}${imagem}`,
        url: `${BASE_URL}${imagem}`,
        width: 1240,
        height: 1754,
        caption: `${ficha.nome} para imprimir`,
      },
      {
        '@type': 'DigitalDocument',
        '@id': `${url}#ficha`,
        name: ficha.nome,
        description: ficha.resumo,
        inLanguage: 'pt-BR',
        isAccessibleForFree: true,
        encodingFormat: 'application/pdf',
        url: `${BASE_URL}${pdf}`,
        image: { '@id': `${url}#imagem` },
        publisher: { '@id': `${BASE_URL}/#organization` },
        dateModified: FICHAS_ATUALIZADO_EM,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'Ferramentas', item: `${BASE_URL}/ferramentas` },
          { '@type': 'ListItem', position: 3, name: 'Fichas de anamnese', item: `${BASE_URL}${FICHAS_BASE_PATH}` },
          { '@type': 'ListItem', position: 4, name: ficha.rotulo, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: faq.map(({ pergunta, resposta }) => ({
          '@type': 'Question',
          name: pergunta,
          acceptedAnswer: { '@type': 'Answer', text: resposta },
        })),
      },
    ],
  }

  const h2 = 'font-serif text-2xl font-bold leading-tight text-[#0A1F3D] sm:text-3xl'
  const texto = 'text-base leading-relaxed text-[#334155]'

  return (
    <>
      {/* Native <script>: next/script would leave the JSON-LD out of the server HTML. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="bg-[#EEF0F8] print:bg-white">
        {/* Hero */}
        <section className="no-print bg-[#0A1F3D] px-4 py-12 text-white sm:px-6 sm:py-16">
          <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[1fr_auto]">
            <div>
              <nav aria-label="Você está em" className="mb-2 flex flex-wrap items-center gap-x-2 text-xs font-semibold uppercase tracking-widest text-white/70">
                <Link href="/ferramentas" className="inline-flex min-h-12 items-center hover:text-white">Ferramentas</Link>
                <span aria-hidden>›</span>
                <Link href={FICHAS_BASE_PATH as any} className="inline-flex min-h-12 items-center hover:text-white">Fichas de anamnese</Link>
              </nav>
              <h1 className="font-serif font-normal leading-[1.1] text-white" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)' }}>
                {ficha.nome}, <span className="font-bold text-[#E5C98B]">pronta para imprimir</span>
              </h1>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/80">
                Modelo em PDF, grátis e sem cadastro. Uma folha A4, frente e verso, com as perguntas do procedimento e espaço para anotar cada sessão.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href={pdf}
                  download
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-7 text-sm font-bold text-[#0A1F3D] transition-colors hover:bg-[#EEF0F8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <Download aria-hidden className="size-4" />
                  Baixar PDF grátis
                </a>
                <BotaoImprimir slug={slug} />
              </div>
              <p className="mt-4 text-sm text-white/70">Para: {ficha.paraQuem}</p>
            </div>
            <a href={pdf} className="mx-auto block w-52 shrink-0 rotate-1 rounded-sm bg-white p-1.5 shadow-2xl shadow-black/40 sm:w-60">
              <img
                src={imagem}
                width={1240}
                height={1754}
                alt={`${ficha.nome} para imprimir: primeira página do modelo em PDF`}
                className="h-auto w-full"
                fetchPriority="high"
              />
            </a>
          </div>
        </section>

        {/* What is in it: header-answer block that survives being quoted on its own */}
        <section className="no-print bg-white px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className={h2}>O que tem na {nomeMinusculo}</h2>
            <p className={`mt-4 ${texto}`}>{ficha.resumo}</p>
            <ul className="mt-5 grid gap-x-8 gap-y-2 text-[#0A1F3D] sm:grid-cols-2">
              {[...secoes, ...ficha.tabelas.map((t) => t.titulo), 'Declaração e assinaturas'].map((item) => (
                <li key={item} className="flex gap-2 text-base">
                  <span aria-hidden className="text-[#8B6E32]">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* The sheet itself: the only block that prints */}
        <section className="px-4 py-12 sm:px-6 print:p-0">
          <div className="no-print mx-auto mb-6 max-w-[794px]">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#8B6E32]">A ficha completa</p>
            <p className={`mt-1 ${texto}`}>É esta folha que sai no PDF e na impressão.</p>
          </div>
          <FichaFolha ficha={ficha} />
          <div className="no-print mx-auto mt-6 flex max-w-[794px] justify-center">
            <a
              href={pdf}
              download
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#0A1F3D] px-7 text-sm font-bold text-white transition-colors hover:bg-[#162D54] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F3D]"
            >
              <Download aria-hidden className="size-4" />
              Baixar PDF grátis
            </a>
          </div>
        </section>

        {/* Why these questions + how to use */}
        <section className="no-print bg-white px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className={h2}>Por que esta ficha pergunta o que pergunta</h2>
            {ficha.notas.map(({ titulo, texto: corpo }) => (
              <div key={titulo} className="mt-6">
                <h3 className="text-lg font-bold text-[#0A1F3D]">{titulo}</h3>
                <p className={`mt-2 ${texto}`}>{corpo}</p>
              </div>
            ))}

            <h2 className={`mt-12 ${h2}`}>Como usar em 3 passos</h2>
            <ol className="mt-5 space-y-3">
              {[
                'Baixe o PDF ou imprima direto desta página.',
                'Imprima em A4, frente e verso, quantas cópias precisar.',
                'Preencha antes do atendimento, releia as respostas com quem você atende e anote cada sessão na tabela.',
              ].map((passo, i) => (
                <li key={passo} className="flex gap-3 text-base text-[#334155]">
                  <span aria-hidden className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#0A1F3D] text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  {passo}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Paid step and digital interest */}
        <section className="no-print px-4 py-12 sm:px-6">
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
            <div id="com-a-sua-logo" className="scroll-mt-24 rounded-2xl border-2 border-[#0A1F3D] bg-white p-6 sm:p-8">
              <h2 className={h2}>A mesma ficha, com a sua logo</h2>
              <p className={`mt-3 ${texto}`}>
                Você recebe a {nomeMinusculo} em PDF com a logo e o nome do seu negócio no cabeçalho, para imprimir quantas vezes quiser.
              </p>
              <p className="mt-4 text-[#0A1F3D]">
                <span className="block font-serif text-4xl font-bold">{FICHA_COM_LOGO.preco}</span>
                <span className="block text-base">pagamento único, sem assinatura</span>
              </p>
              <ol className="mt-4 list-decimal space-y-1 pl-5 text-base text-[#334155]">
                <li>Pague pelo Stripe.</li>
                <li>Envie a logo e o nome do negócio por WhatsApp ou e-mail.</li>
                <li>Receba o PDF em até {FICHA_COM_LOGO.prazo}.</li>
              </ol>
              <div className="mt-6">
                <PedirComLogo slug={slug} nome={ficha.nome} />
              </div>
              <p className="mt-4 text-sm text-[#475569]">
                Desistiu? Você tem 7 dias para pedir o reembolso integral, pelo mesmo WhatsApp ou e-mail.
              </p>
            </div>

            <div id="versao-digital" className="scroll-mt-24 rounded-2xl border border-[#0A1F3D]/15 bg-white p-6 sm:p-8">
              <h2 className={h2}>Versão digital, com assinatura pelo celular</h2>
              <p className={`mt-3 ${texto}`}>
                Quem você atende preenche e assina a ficha pelo celular, antes de chegar, e o PDF assinado fica guardado para você.
              </p>
              <p className={`mt-3 ${texto}`}>
                Essa versão das fichas ainda não abriu. Deixe seu e-mail e avisamos quando abrir.
              </p>
              <div className="mt-6">
                <InteresseDigital slug={slug} />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="no-print bg-white px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className={h2}>Perguntas frequentes</h2>
            <div className="mt-5 divide-y divide-[#0A1F3D]/10 border-y border-[#0A1F3D]/10">
              {faq.map(({ pergunta, resposta }) => (
                <details key={pergunta} className="group">
                  <summary className="flex min-h-12 cursor-pointer items-center py-3 text-base font-semibold text-[#0A1F3D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F3D]">
                    {pergunta}
                  </summary>
                  <p className={`pb-4 ${texto}`}>{resposta}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Sibling forms */}
        <section className="no-print px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <h2 className={h2}>Outras fichas de anamnese para imprimir</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {outras.map((f) => (
                <li key={f.slug}>
                  <Link
                    href={fichaPath(f.slug) as any}
                    className="flex min-h-12 items-center rounded-xl border border-[#0A1F3D]/15 bg-white px-4 py-3 text-base font-semibold text-[#0A1F3D] transition-colors hover:border-[#0A1F3D]/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F3D]"
                  >
                    {f.nome}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm leading-relaxed text-[#475569]">
              Este modelo é um ponto de partida para adaptar ao seu atendimento. Não é protocolo clínico, não substitui a avaliação profissional nem o termo de consentimento do procedimento. A vigilância sanitária do seu município e o seu conselho profissional podem ter exigências próprias. Atualizado em{' '}
              <time dateTime={FICHAS_ATUALIZADO_EM}>{new Date(`${FICHAS_ATUALIZADO_EM}T12:00:00`).toLocaleDateString('pt-BR')}</time>.
            </p>
          </div>
        </section>
      </div>
    </>
  )
}
