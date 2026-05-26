const BASE_URL = 'https://estetiacrm.com.br'

export function buildLocaleAlternates(
  _locale: string,
  ptPath: string,
) {
  const ptUrl = `${BASE_URL}${ptPath}`
  return {
    canonical: ptUrl,
    languages: {
      'pt-BR': ptUrl,
      'x-default': ptUrl,
    },
  }
}
