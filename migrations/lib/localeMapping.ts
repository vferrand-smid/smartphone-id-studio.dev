const wpmlToSanityLocaleMap: Record<string, string> = {
  ar: 'ar-SA',
  ar_SA: 'ar-SA',
  ar_AE: 'ar-AE',
  de: 'de-DE',
  et: 'et-EE',
  qu: 'de-CH',
  en: 'en',
  sq: 'en-NG',
  hi: 'en-IN',
  mt: 'en-SG',
  en_AU: 'en-AU',
  en_CA: 'en-CA',
  en_GB: 'en-GB',
  en_IE: 'en-IE',
  en_IN: 'en-IN',
  en_NZ: 'en-NZ',
  en_US: 'en-US',
  en_ZA: 'en-ZA',
  es: 'es-ES',
  es_AR: 'es-AR',
  es_CO: 'es-CO',
  es_MX: 'es-MX',
  fr: 'fr-FR',
  eu: 'fr-BE',
  pa: 'fr-CH',
  ne: 'fr-CA',
  it: 'it-IT',
  eo: 'nl-BE',
  nl: 'nl-NL',
  pl: 'pl-PL',
  'pt-br': 'pt-BR',
  pt_PT: 'pt-PT',
  ru: 'ru-RU',
  sv: 'sv-SE',
  'zh-hans': 'zh-CN',
}

export function mapWpmlToSanityLocale(wpmlCode?: string): string {
  if (!wpmlCode) {
    console.warn('⚠️ Aucun code WPML fourni, fallback en "und"')
    return 'und' // und = undefined locale
  }

  const sanityLocale = wpmlToSanityLocaleMap[wpmlCode]

  if (!sanityLocale) {
    console.warn(`⚠️ Code WPML inconnu (${wpmlCode}), fallback en "und"`)
    return 'und'
  }

  return sanityLocale
}
