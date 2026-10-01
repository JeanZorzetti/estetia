import { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { buildLocaleAlternates } from '@/lib/seo/canonical'
import { Link } from '@/i18n/routing'
import {
  FICHAS,
  FICHAS_ATUALIZADO_EM,
  FICHAS_BASE_PATH,
  FICHA_COM_LOGO,
  fichaImagem,
  fichaPath,
} from '@/config/fichas-anamnese'

const BASE_URL = 'https://estetiacrm.com.br'
const PAGINA = `${BASE_URL}${FICHAS_BASE_PATH}`
const TITLE = `Fichas de anamnese para imprimir: ${FICHAS.length} modelos em PDF grátis`
const DESCRIPTION =
  'Fichas de anamnese por procedimento em PDF, grátis e sem cadastro: estética, sobrancelha, cílios, depilação, podologia, limpeza de pele e mais. Baixe e imprima.'

const FAQ = [
  {
    pergunta: 'O que é uma ficha de anamnese?',
    resposta:
      'A ficha de anamnese é o documento em que a profissional registra, antes do atendimento, a identificação, a queixa, o histórico de saúde e os hábitos de quem será atendido. Ela orienta a escolha do procedimento e dos produtos e fica guardada, assinada, como registro do que foi informado.',
  },
  {
    pergunta: 'Por que usar uma ficha de anamnese por procedimento?',
    resposta:
      'Cada procedimento pede perguntas próprias. A ficha de anamnese de podologia pergunta sobre diabetes e sensibilidade nos pés; a de cílios, sobre lentes de contato e alergia a cola; a de depilação, sobre sol recente. Uma ficha genérica deixa essas perguntas de fora ou ocupa espaço com as que não se aplicam.',
  },
  {
    pergunta: 'As fichas de anamnese são grátis mesmo?',
    resposta: `São. As ${FICHAS.length} fichas de anamnese desta página podem ser baixadas em PDF ou impressas direto do navegador, sem cadastro e sem pagamento. A única versão paga é a personalizada, com a logo e o nome do seu negócio no cabeçalho, por ${FICHA_COM_LOGO.preco} em pagamento único.`,
  },
]

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const alternates = buildLocaleAlternates(locale, FICHAS_BASE_PATH)
  const imagem = { url: `${BASE_URL}${fichaImagem(FICHAS[0].slug)}`, width: 1240, height: 1754, alt: 'Ficha de anamnese para imprimir' }
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates,
    openGraph: { title: TITLE, description: DESCRIPTION, url: alternates.canonical, images: [imagem] },
    twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [imagem.url] },
  }
}

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': `${PAGINA}#webpage`,
      url: PAGINA,
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: 'pt-BR',
      isPartOf: { '@id': `${BASE_URL}/#website` },
      dateModified: FICHAS_ATUALIZADO_EM,
      breadcrumb: { '@id': `${PAGINA}#breadcrumb` },
      mainEntity: { '@id': `${PAGINA}#lista` },
    },
    {
      '@type': 'ItemList',
      '@id': `${PAGINA}#lista`,
      itemListElement: FICHAS.map((f, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: f.nome,
        url: `${BASE_URL}${fichaPath(f.slug)}`,
      })),
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${PAGINA}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Ferramentas', item: `${BASE_URL}/ferramentas` },
        { '@type': 'ListItem', position: 3, name: 'Fichas de anamnese', item: PAGINA },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${PAGINA}#faq`,
      mainEntity: FAQ.map(({ pergunta, resposta }) => ({
        '@type': 'Question',
        name: pergunta,
        acceptedAnswer: { '@type': 'Answer', text: resposta },
      })),
    },
  ],
}

export default async function FichasDeAnamnesePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const h2 = 'font-serif text-2xl font-bold leading-tight text-[#0A1F3D] sm:text-3xl'
  const texto = 'text-base leading-relaxed text-[#334155]'

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="bg-[#EEF0F8]">
        <section className="bg-[#0A1F3D] px-4 py-12 text-white sm:px-6 sm:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <nav aria-label="Você está em" className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/70">
              <Link href="/ferramentas" className="inline-flex min-h-12 items-center hover:text-white">Ferramentas</Link>
            </nav>
            <h1 className="font-serif font-normal leading-[1.1] text-white" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)' }}>
              Fichas de anamnese para imprimir, <span className="font-bold text-[#E5C98B]">por procedimento</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/80">
              {FICHAS.length} modelos em PDF, cada um com as perguntas do seu procedimento. Grátis, sem cadastro.
            </p>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6">
          <ul className="mx-auto grid max-w-5xl grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-5">
            {FICHAS.map((f, i) => (
              <li key={f.slug}>
                <Link
                  href={fichaPath(f.slug) as any}
                  className="group flex h-full flex-col rounded-2xl border border-[#0A1F3D]/10 bg-white p-4 transition-shadow hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F3D]"
                >
                  <span className="block h-44 overflow-hidden rounded-lg border border-[#0A1F3D]/10 bg-[#F8FAFC]">
                    <img
                      src={fichaImagem(f.slug)}
                      width={1240}
                      height={1754}
                      alt={`${f.nome} para imprimir`}
                      loading={i < 3 ? 'eager' : 'lazy'}
                      className="h-auto w-full"
                    />
                  </span>
                  <h2 className="mt-4 font-serif text-lg font-bold leading-snug text-[#0A1F3D]">{f.nome}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-[#475569]">{f.paraQuem}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-3xl">
            {FAQ.map(({ pergunta, resposta }, i) => (
              <div key={pergunta} className={i ? 'mt-10' : ''}>
                <h2 className={h2}>{pergunta}</h2>
                <p className={`mt-3 ${texto}`}>{resposta}</p>
              </div>
            ))}

            <h2 className={`mt-10 ${h2}`}>O que todas as fichas têm</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-base text-[#334155]">
              <li>Uma folha A4, frente e verso, com letra de tamanho normal.</li>
              <li>Identificação, perguntas de saúde e perguntas próprias do procedimento.</li>
              <li>Tabela com data para anotar cada sessão ou cada medida.</li>
              <li>Declaração e campos de assinatura.</li>
            </ul>

            <p className="mt-10 text-sm leading-relaxed text-[#475569]">
              Os modelos são um ponto de partida para adaptar ao seu atendimento. Não são protocolo clínico e não substituem a avaliação profissional nem o termo de consentimento do procedimento. A vigilância sanitária do seu município e o seu conselho profissional podem ter exigências próprias. Atualizado em{' '}
              <time dateTime={FICHAS_ATUALIZADO_EM}>{new Date(`${FICHAS_ATUALIZADO_EM}T12:00:00`).toLocaleDateString('pt-BR')}</time>.
            </p>
          </div>
        </section>
      </div>
    </>
  )
}
