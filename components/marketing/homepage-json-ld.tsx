import { generateFAQSchema, estetiaHomepageFAQs } from '@/lib/faq-schema'

const BASE_URL = 'https://estetiacrm.com.br'

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Estetia CRM',
  applicationCategory: 'BusinessApplication',
  applicationSubCategory: 'ClinicalManagementSoftware',
  operatingSystem: 'Web, iOS, Android',
  url: BASE_URL,
  description:
    'CRM clínico completo para clínicas de estética e dermatologia: agenda inteligente, anamnese digital, prontuário eletrônico LGPD-compliant, recall automático via WhatsApp Business e predictor de no-show com IA.',
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'BRL',
    lowPrice: '0',
    highPrice: '799',
    offerCount: '4',
    availability: 'https://schema.org/InStock',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: 4.8,
    reviewCount: 127,
    bestRating: 5,
    worstRating: 1,
  },
  featureList: [
    'Agenda inteligente com confirmação automática',
    'Anamnese digital com alertas de contraindicação',
    'Prontuário eletrônico LGPD-compliant',
    'Recall automático via WhatsApp Business',
    'Predictor de no-show com IA',
    'Integração TISS/TUSS para convênios',
    'Gestão multi-unidade',
    'Relatórios de KPIs clínicos',
  ],
  screenshot: `${BASE_URL}/og-image.png`,
  softwareVersion: '2.0',
  datePublished: '2024-01-01',
  author: { '@type': 'Organization', name: 'ROI Labs', url: 'https://roilabs.com.br' },
}

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Estetia CRM',
  description:
    'CRM clínico para clínicas de estética e dermatologia: agenda inteligente, anamnese digital, prontuário eletrônico, recall automático via WhatsApp, LGPD compliance e predictor de no-show.',
  brand: { '@type': 'Brand', name: 'ROI Labs' },
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'BRL',
    lowPrice: '0',
    highPrice: '799',
    offerCount: '4',
    availability: 'https://schema.org/InStock',
    url: `${BASE_URL}/pricing`,
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: 4.8,
    reviewCount: 127,
    bestRating: 5,
    worstRating: 1,
  },
  review: [
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Dra. Fernanda Lima' },
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      reviewBody:
        'O recall automático via WhatsApp reduziu meu no-show de 28% para 8% em 2 meses. A anamnese digital economiza muito tempo da equipe.',
    },
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Clínica Bella Pele' },
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      reviewBody:
        'O prontuário eletrônico com LGPD nativo nos deu segurança para digitalizar 100% dos atendimentos. Suporte excelente!',
    },
  ],
  image: `${BASE_URL}/og-image.png`,
  url: BASE_URL,
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'ROI Labs - Estetia CRM',
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  image: `${BASE_URL}/og-image.png`,
  description:
    'CRM clínico completo para clínicas de estética e dermatologia com agenda inteligente, anamnese digital, WhatsApp Business e LGPD compliance',
  telephone: '+55-62-98344-3919',
  email: 'suporte@estetiacrm.com.br',
  areaServed: { '@type': 'Country', name: 'Brasil' },
  address: { '@type': 'PostalAddress', addressCountry: 'BR', addressRegion: 'GO' },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+55-62-98344-3919',
    contactType: 'customer support',
    availableLanguage: 'Portuguese',
    areaServed: 'BR',
  },
  sameAs: ['https://www.linkedin.com/company/roilabs', 'https://twitter.com/roilabs'],
  priceRange: 'R$ 0 - R$ 799/mês',
}

export function HomepageJsonLd() {
  const faqSchema = generateFAQSchema(estetiaHomepageFAQs, BASE_URL)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
    </>
  )
}
