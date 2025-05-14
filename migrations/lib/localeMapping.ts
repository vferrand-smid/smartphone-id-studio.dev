const wpmlToSanityLocaleMap: Record<string, string> = {
  fr: 'fr-FR',
  en_US: 'en-US',
  ne: 'fr-CA',
  de: 'de-DE',
  // ➔ Ajoute ici tes autres langues WPML !
  // es: 'es-ES',
  // de: 'de-DE',
  // etc...
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
