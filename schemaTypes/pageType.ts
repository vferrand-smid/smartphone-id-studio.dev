import {DocumentIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import {ALL_CATEGORY_OPTIONS, getCategoriesForLocale, sanitizeCategoryValue} from './categoryOptions'
import {CategorySelectInput} from './components/CategorySelectInput'

const isUniquePerLocale = (slug: any, context: any) => {
  const {document, getClient} = context
  const client = getClient({apiVersion: '2024-06-01'}) // adapte si besoin

  const id = document?._id?.replace(/^drafts\./, '')
  const type = document?._type || 'page'
  const locale = document?.locale
  const current = slug?.current

  if (!current || !locale) return true

  const params = {
    type,
    slug: current,
    locale,
    draftId: `drafts.${id}`,
    publishedId: id,
  }

  // Return true when no other doc (except this one’s draft/published pair)
  // has the same slug in the same locale
  const query = `!defined(*[
    _type == $type &&
    slug.current == $slug &&
    locale == $locale &&
    !(_id in [$draftId, $publishedId])
  ][0]._id)`

  return client.fetch(query, params)
}

export const pageType = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({name: 'title', type: 'string'}),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: isUniquePerLocale, // <-- clé
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'date', type: 'datetime'}),
    defineField({name: 'modified', type: 'datetime'}),
    defineField({
      name: 'status',
      type: 'string',
      options: {
        list: [
          {title: 'Published', value: 'publish'},
          {title: 'Draft', value: 'draft'},
          {title: 'Trash', value: 'trash'},
        ],
      },
    }),

    defineField({
      name: 'content',
      type: 'blockContent',
      title: 'Content',
    }),

    // defineField({
    //   name: "excerpt",
    //   type: "array",
    //   title: "Excerpt",
    //   of: [{ type: "block" }],
    // }),

    defineField({
      name: 'featuredMedia',
      type: 'image',
      title: 'Featured Image',
      options: {hotspot: true},
    }),

    defineField({
      name: 'author',
      type: 'reference',
      title: 'Author',
      to: [{type: 'author'}],
    }),
    defineField({
      name: 'locale',
      title: 'Locale',
      type: 'string',
      options: {
        list: [
          {title: 'Arabic', value: 'ar'},
          {title: 'Arabic (Saudi Arabia) 🇸🇦', value: 'ar-SA'},
          {title: 'Arabic (United Arab Emirates) 🇦🇪', value: 'ar-AE'},
          {title: 'Chinese (China) 🇨🇳', value: 'zh-CN'},
          {title: 'Deutsch 🇩🇪', value: 'de'},
          {title: 'Deutsch (Germany) 🇩🇪', value: 'de-DE'},
          {title: 'Deutsch (Switzerland) 🇨🇭', value: 'de-CH'},
          {title: 'English 🇺🇸', value: 'en'},
          {title: 'English (Australia) 🇦🇺', value: 'en-AU'},
          {title: 'English (Canada) 🇨🇦', value: 'en-CA'},
          {title: 'English (UK) 🇬🇧', value: 'en-GB'},
          {title: 'English (India) 🇮🇳', value: 'en-IN'},
          {title: 'English (Ireland) 🇮🇪', value: 'en-IE'},
          {title: 'English (Nigeria) 🇳🇬', value: 'en-NG'},
          {title: 'English (New Zealand) 🇳🇿', value: 'en-NZ'},
          {title: 'English (Singapore) 🇸🇬', value: 'en-SG'},
          {title: 'English (South Africa) 🇿🇦', value: 'en-ZA'},
          {title: 'English (US) 🇺🇸', value: 'en-US'},
          {title: 'Estonian (Estonia) 🇪🇪', value: 'et-EE'},
          {title: 'Spanish (Argentina) 🇦🇷', value: 'es-AR'},
          {title: 'Spanish (Colombia) 🇨🇴', value: 'es-CO'},
          {title: 'Spanish 🇪🇸', value: 'es-ES'},
          {title: 'Spanish (Mexico) 🇲🇽', value: 'es-MX'},
          {title: 'Netherlands (Belgium) 🇧🇪', value: 'nl-BE'},
          {title: 'Netherlands (Netherlands) 🇳🇱', value: 'nl-NL'},
          {title: 'Français (Belgium) 🇧🇪', value: 'fr-BE'},
          {title: 'Français (Canada) 🇨🇦', value: 'fr-CA'},
          {title: 'Français (France) 🇫🇷', value: 'fr-FR'},
          {title: 'Français (Suisse) 🇨🇭', value: 'fr-CH'},
          {title: 'Italian (Italy) 🇮🇹', value: 'it-IT'},
          {title: 'Polish (Poland) 🇵🇱', value: 'pl-PL'},
          {title: 'Portuguese (Brazil) 🇧🇷', value: 'pt-BR'},
          {title: 'Portuguese (Portugal) 🇵🇹', value: 'pt-PT'},
          {title: 'Russian (Russia) 🇷🇺', value: 'ru-RU'},
          {title: 'Swedish (Sweden) 🇸🇪', value: 'sv-SE'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'categorie',
      title: 'Catégorie',
      type: 'string',
      description: 'Sélectionnez d’abord la locale pour afficher les catégories disponibles.',
      hidden: ({document}) => !document?.locale,
      components: {
        input: CategorySelectInput,
      },
      options: {
        list: ALL_CATEGORY_OPTIONS,
      },
      validation: (Rule) =>
        Rule.required().custom((value, context) => {
          if (!value) return true

          const locale = context?.document?.locale as string | undefined
          const available = getCategoriesForLocale(locale).map((option) => option.value)
          const normalizedAvailable = new Set(available.map(sanitizeCategoryValue))

          return normalizedAvailable.has(sanitizeCategoryValue(value))
            ? true
            : 'Cette catégorie n’est pas disponible pour la locale sélectionnée.'
        }),
    }),
    defineField({
      name: 'sourceId',
      type: 'number',
      hidden: true,
    }),
    defineField({
      name: 'trashed',
      type: 'boolean',
      hidden: true,
    }),
  ],
  // Option de tri par langue dans Sanity
  orderings: [
    {
      title: 'By Locale',
      name: 'localeAsc',
      by: [{field: 'locale', direction: 'asc'}],
    },
    {
      title: 'By Date',
      name: 'dateDesc',
      by: [{field: 'date', direction: 'desc'}],
    },
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'locale',
      media: 'featuredMedia',
    },
  },
})
