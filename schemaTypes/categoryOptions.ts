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
  'photos-identité': {
    value: 'Photos-identité',
    defaultTitle: "Photos d'identité",
    titles: {'ru-ru': 'фото на паспорт'},
  },
  'normes-photo-d-identite': {
    value: 'normes-photo-d-identite',
    defaultTitle: "Normes photo d'identité",
  },
  'produit-ephoto': {value: 'Produit-ephoto ', defaultTitle: 'Produit ephoto'},
  'permis-de-conduire': {
    value: 'permis-de-conduire',
    defaultTitle: 'Permis de conduire',
    titles: {
      en: "Driver's License",
      'it-it': 'Patente di guida',
      'es-es': 'Permiso de conducir',
      'es-mx': 'Permiso de conducir',
      'de-de': 'Fuehrerschein',
      'es-co': 'Licencia de Conducción',
      'es-ar': 'Permiso de conducir',
      'nl-nl': 'Rijbewijs',
      'ar-ae': 'رخـصة القـيادة',
      'pl-pl': 'Prawo jazdy',
      'pt-br': 'Carteiras de Motorista',
      'ru-ru': 'Водительское удостоверение',
    },
  },
  'titre-de-sejour': {
    value: 'titre-de-sejour',
    defaultTitle: 'Titre de séjour',
    titles: {en: 'Residence permit'},
  },
  passeport: {
    value: 'passeport',
    defaultTitle: 'Passeport',
    titles: {
      en: 'Passport',
      'nl-nl': 'Paspoort',
      'ar-ae': 'جواز السفر',
      'pl-pl': 'Paszport',
      'pt-br': 'Passaporte',
      'ru-ru': 'паспорт',
    },
  },
  'carte-d-identite': {
    value: 'carte-d-identite',
    defaultTitle: "Carte d'identité",
    titles: {
      en: 'ID card',
      'it-it': 'Carta d’identità',
      'de-de': 'Personalausweis',
      'nl-nl': 'ID-kaart ',
      'ar-ae': 'بطاقة الهوية',
      'pl-pl': 'Dowód osobisty',
      'pt-br': 'Carteira de identidade',
    },
  },
  visa: {
    value: 'visa',
    defaultTitle: 'Visa',
    titles: {
      'nl-nl': 'Visum',
      'ar-ae': 'التأشيرة',
      'pl-pl': 'Wiza',
      'pt-br': 'Visto',
      'ru-ru': 'Виза',
    },
  },
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
    titles: {
      'nl-nl': 'Pasfotodiensten',
    },
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
    titles: {
      'en-ie': 'Residence permit',
      'de-de': 'Aufenthaltsgenehmigung',
      'es-es': 'Permiso de residencia',
      'es-ar': 'Permiso de residencia',
      'nl-nl': 'Verblijfsvergunning',
      'ar-ae': 'بطاقة الإقامة',
      'pl-pl': 'Zezwolenie na pobyt',
      'ru-ru': 'Вид на жительство',
    },
  },
  'student-cards': {
    value: 'student-cards',
    defaultTitle: 'Student Cards',
  },
  'ids-licences': {
    value: 'ids-licences',
    defaultTitle: 'IDs & Licences',
  },
  'foto-passaporto': {
    value: 'foto-passaporto',
    defaultTitle: 'Foto passaporto',
    titles: {
      'nl-nl': 'Pasfotos',
      'pt-br': 'Foto Passaporte ',
    },
  },
  'permesso-di-soggiorno': {
    value: 'permesso-di-soggiorno',
    defaultTitle: 'Permesso di soggiorno',
  },
  'fototessera-norme-diy': {
    value: 'fototessera-norme-diy',
    defaultTitle: 'Fototessera norme & DIY',
  },
  passfotodienste: {
    value: 'passfotodienste',
    defaultTitle: 'Passfotodienste',
  },
  'other-ids': {
    value: 'other-ids',
    defaultTitle: 'Other IDs',
  },
  dni: {
    value: 'dni',
    defaultTitle: 'DNI',
  },
  'foto-carnet': {
    value: 'foto-carnet',
    defaultTitle: 'Foto Carnet',
  },
  'foto-de-identidad': {
    value: 'foto-de-identidad',
    defaultTitle: 'Foto de identidad',
    titles: {'ar-ae': 'صور جواز سفر دولية', 'pl-pl': 'Zdjęcie paszportu', 'et-ee': 'ID Foto'},
  },
  'cédula-digital-colombiana': {
    value: 'cédula-digital-colombiana',
    defaultTitle: 'Cédula Digital Colombiana',
  },
  Vaarbevoegdheidsbewijs: {
    value: 'Vaarbevoegdheidsbewijs',
    defaultTitle: 'Vaarbevoegdheidsbewijs',
  },
  'OV-chipkaart': {
    value: 'OV-chipkaart',
    defaultTitle: 'OV-chipkaart',
  },
  'gerechtsdeurwaarder-monsterboekje': {
    value: 'gerechtsdeurwaarder-monsterboekje',
    defaultTitle: 'Gerechtsdeurwaarder & Monsterboekje',
  },
  'صورشخصية إماراتية': {
    value: 'صورشخصية إماراتية',
    defaultTitle: 'صورشخصية إماراتية',
  },
  'ametlikud-dokumendid': {
    value: 'ametlikud-dokumendid',
    defaultTitle: 'Ametlikud dokumendid',
  },
  'foto-3x4': {
    value: 'foto-3x4',
    defaultTitle: 'Foto 3x4',
  },
  'identificações-legais': {
    value: 'identificações-legais',
    defaultTitle: 'Identificações Legais',
  },
  'licenças-de-saúde': {
    value: 'licenças-de-saúde',
    defaultTitle: 'Licenças de Saúde',
  },
  'documentos-de-imigração': {
    value: 'documentos-de-imigração',
    defaultTitle: 'Documentos de Imigração',
  },
  'autorizações-esportivas': {
    value: 'autorizações-esportivas',
    defaultTitle: 'Autorizações Esportivas',
  },
  'crachás-de-acesso': {
    value: 'crachás-de-acesso',
    defaultTitle: 'Crachás de Acesso',
  },
  'Фото-на-документы': {
    value: 'Фото-на-документы',
    defaultTitle: 'Фото на документы',
  },
  'Военный-билет': {
    value: 'Военный-билет',
    defaultTitle: 'Военный билет',
  },
  'document-personnels': {
    value: 'document-personnels',
    defaultTitle: 'Личные документы',
  },
  'cartes-d-accès': {
    value: 'cartes-d-accès',
    defaultTitle: 'Карты доступа',
  },
} satisfies Record<string, CategoryDefinition>

type CategoryId = keyof typeof CATEGORY_DEFINITIONS

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
    'carte-d-identite',
    'permis-de-conduire',
    'ids-licences',
    'passeport',
  ],
  'it-it': [
    'foto-passaporto',
    'visa',
    'permis-de-conduire',
    'carte-d-identite',
    'fototessera-norme-diy',
  ],
  'de-de': [
    'passport-photo-requirements-DIY',
    'passfotodienste',
    'permis-de-conduire',
    'visa',
    'carte-d-identite',
    'other-ids',
    'residence-permit',
  ],
  'es-es': ['dni', 'passeport', 'permis-de-conduire', 'residence-permit', 'visa', 'foto-carnet'],
  'es-mx': [
    'dni',
    'passeport',
    'permis-de-conduire',
    'residence-permit',
    'foto-de-identidad',
    'visa',
  ],
  'es-co': [
    'passeport',
    'visa',
    'residence-permit',
    'permis-de-conduire',
    'cédula-digital-colombiana',
    'foto-carnet',
  ],
  'es-ar': ['passeport', 'dni', 'permis-de-conduire', 'residence-permit', 'visa', 'foto-carnet'],
  'nl-nl': [
    'permis-de-conduire',
    'residence-permit',
    'passeport',
    'carte-d-identite',
    'foto-passaporto',
    'passport-photos-services-locations',
    'visa',
    'Vaarbevoegdheidsbewijs',
    'OV-chipkaart',
    'gerechtsdeurwaarder-monsterboekje',
  ],
  'ar-ae': [
    'passeport',
    'permis-de-conduire',
    'carte-d-identite',
    'visa',
    'صورشخصية إماراتية',
    'foto-de-identidad',
  ],
  'pl-pl': [
    'foto-de-identidad',
    'carte-d-identite',
    'residence-permit',
    'permis-de-conduire',
    'visa',
  ],
  'et-ee': ['foto-de-identidad', 'ametlikud-dokumendid'],
  'pt-br': [
    'passeport',
    'foto-passaporto',
    'visa',
    'carte-d-identite',
    'identificações-legais',
    'licenças-de-saúde',
    'permis-de-conduire',
    'documentos-de-imigração',
    'autorizações-esportivas',
    'crachás-de-acesso',
  ],
  'ru-ru': [
    'passeport',
    'photos-identité',
    'Фото-на-документы',
    'visa',
    'permis-de-conduire',
    'Военный-билет',
    'residence-permit',
    'document-personnels',
    'cartes-d-accès',
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

  const uniqueIds = Array.from(new Set([...localeSpecificIds]))

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
