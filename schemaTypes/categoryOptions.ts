type CategoryOption = {
  title: string
  value: string
}

type CategoryDefinition = {
  value: string
  defaultTitle: string
  titles?: Record<string, string>
}

const CATEGORY_DEFINITIONS = {
  test: {value: 'test', defaultTitle: 'Test'},
  'photos-identité-DIY': {value: 'Photos-identité-DIY', defaultTitle: "Photos d'identité DIY"},
  'normes-photo-d-identite': {
    value: 'normes-photo-d-identite',
    defaultTitle: "Normes photo d'identité",
  },
  'produit-ephoto': {value: 'Produit-ephoto ', defaultTitle: 'Produit ephoto'},
  'permis-de-conduire': {
    value: 'permis-de-conduire',
    defaultTitle: 'Permis de conduire',
    titles: {en: "Driver's License", es: 'Permiso de conducir'},
  },
  'titre-de-sejour': {
    value: 'titre-de-sejour',
    defaultTitle: 'Titre de séjour',
    titles: {en: 'Residence permit'},
  },
  passeport: {value: 'passeport', defaultTitle: 'Passeport', titles: {en: 'Passport'}},
  'carte-d-identite': {
    value: 'carte-d-identite',
    defaultTitle: "Carte d'identité",
    titles: {en: 'ID card', 'it-it': 'Carta d’identità'},
  },
  visa: {value: 'visa', defaultTitle: 'Visa'},
  'articles-divers': {value: 'Articles-divers', defaultTitle: 'Articles divers'},
  'passport-photos-requirements': {
    value: 'Passport-Photos-Requirements',
    defaultTitle: 'Passport Photos Requirements',
  },
  'passport-photos-DIY': {
    value: 'passport-photos-DIY',
    defaultTitle: 'Passport Photos DIY',
  },
  'passport-photos-services-locations': {
    value: 'passport-photos-services-locations',
    defaultTitle: 'Passport Photos services & locations',
  },
  'US-specific-document-photos': {
    value: 'US-specific-document-photos',
    defaultTitle: 'US-Specific Document Photos',
  },
  'international-passport-photo': {
    value: 'international-passport-photo',
    defaultTitle: 'International passport photo',
  },
  'green-card': {
    value: 'green-card',
    defaultTitle: 'Green Card',
  },
  'uk-idpc': {
    value: 'uk-idpc',
    defaultTitle: 'UK IDPC',
  },
  'id-citizen-cards': {
    value: 'id-citizen-cards',
    defaultTitle: 'ID & Citizen Cards',
  },
  'pet-passport': {
    value: 'pet-passport',
    defaultTitle: 'Pet Passport',
  },
  'passport-photo-requirements-DIY': {
    value: 'passport-photo-requirements-DIY',
    defaultTitle: 'Passport Photo Requirements & DIY',
  },
  'permanent-resident-card': {
    value: 'permanent-resident-card',
    defaultTitle: 'Permanent Resident (PR) Card ',
  },
  'id-card-licences': {
    value: 'id-card-licences',
    defaultTitle: 'ID Card & licences',
  },
  'international-document': {
    value: 'international-document',
    defaultTitle: 'International document',
  },
  'passport-card': {
    value: 'passport-card',
    defaultTitle: 'Passport Card',
  },
  'public-service-card': {
    value: 'public-service-card',
    defaultTitle: 'Public Service Card',
  },
  'residence-permit': {
    value: 'residence-permit',
    defaultTitle: 'Residence permit',
  },
  'student-cards': {
    value: 'student-cards',
    defaultTitle: 'Student Cards',
  },
  'id-card': {
    value: 'id-card',
    defaultTitle: 'ID Card',
  },
  'ids-licences': {
    value: 'ids-licences',
    defaultTitle: 'IDs & Licences',
  },
  'foto-passaporto': {
    value: 'foto-passaporto',
    defaultTitle: 'Foto passaporto',
  },
  'patente-di-guida': {
    value: 'patente-di-guida',
    defaultTitle: 'Patente di guida',
  },
  'permesso-di-soggiorno': {
    value: 'permesso-di-soggiorno',
    defaultTitle: 'Permesso di soggiorno',
  },
  'fototessera-norme-diy': {
    value: 'fototessera-norme-diy',
    defaultTitle: 'Fototessera norme & DIY',
  },
} satisfies Record<string, CategoryDefinition>

type CategoryId = keyof typeof CATEGORY_DEFINITIONS

const COMMON_CATEGORY_IDS: CategoryId[] = ['visa']

const CATEGORY_IDS_BY_LOCALE: Record<string, CategoryId[]> = {
  default: [],
  'fr-fr': [
    'test',
    'photos-identité-DIY',
    'produit-ephoto',
    'permis-de-conduire',
    'titre-de-sejour',
    'passeport',
    'carte-d-identite',
    'articles-divers',
  ],
  'en-us': [
    'passport-photos-requirements',
    'passport-photos-DIY',
    'passport-photos-services-locations',
    'US-specific-document-photos',
    'international-passport-photo',
    'permis-de-conduire',
    'green-card',
  ],
  'en-gb': [
    'passport-photos-requirements',
    'passport-photos-DIY',
    'passport-photos-services-locations',
    'passeport',
    'permis-de-conduire',
    'visa',
    'uk-idpc',
    'id-citizen-cards',
    'pet-passport',
    'international-passport-photo',
  ],
  'en-ca': [
    'passport-photo-requirements-DIY',
    'passport-photos-services-locations',
    'passeport',
    'visa',
    'permanent-resident-card',
    'id-card-licences',
    'permis-de-conduire',
    'international-document',
  ],
  'en-ie': [
    'passport-card',
    'passport-photos-requirements',
    'passport-photos-services-locations',
    'passeport',
    'visa',
    'permis-de-conduire',
    'public-service-card',
    'residence-permit',
    'student-cards',
  ],
  'en-au': [
    'passport-photo-requirements-DIY',
    'visa',
    'passport-photos-services-locations',
    'id-card',
    'permis-de-conduire',
    'ids-licences',
    'passeport',
  ],
  'it-it': [
    'foto-passaporto',
    'visa',
    'patente-di-guida',
    'carte-d-identite',
    'fototessera-norme-diy',
  ],
}

const resolveLocaleCandidates = (locale?: string) => {
  if (!locale) return ['default']

  const normalized = locale.toLowerCase()
  const parts = normalized.split('-')
  const base = parts[0]

  const candidates = [normalized]
  if (base && base !== normalized) candidates.push(base)
  candidates.push('default')

  return Array.from(new Set(candidates))
}

const getCategoryTitle = (id: CategoryId, localeKey?: string) => {
  const definition = CATEGORY_DEFINITIONS[id]
  if (!localeKey) return definition.defaultTitle

  const candidates = [localeKey]
  const base = localeKey.split('-')[0]
  if (base && base !== localeKey) candidates.push(base)

  for (const candidate of candidates) {
    const translation = definition.titles?.[candidate]
    if (translation) return translation
  }

  return definition.defaultTitle
}

const getCategoriesForLocale = (locale?: string): CategoryOption[] => {
  const localeCandidates = resolveLocaleCandidates(locale)
  const localeSpecificIds =
    localeCandidates
      .map((candidate) => CATEGORY_IDS_BY_LOCALE[candidate])
      .find((ids): ids is CategoryId[] => Array.isArray(ids)) ?? CATEGORY_IDS_BY_LOCALE.default

  const uniqueIds = Array.from(new Set([...localeSpecificIds, ...COMMON_CATEGORY_IDS]))

  return uniqueIds
    .map((id) => {
      const definition = CATEGORY_DEFINITIONS[id]
      if (!definition) return null

      const localeKey = localeCandidates[0]
      const title = getCategoryTitle(id, localeKey)

      return {value: definition.value, title}
    })
    .filter((option): option is CategoryOption => Boolean(option))
}

export {getCategoriesForLocale}
export type {CategoryOption}
