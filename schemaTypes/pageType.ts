import {DocumentIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

//import {ALL_CATEGORY_OPTIONS, getCategoriesForLocale, sanitizeCategoryValue} from './categoryOptions'
//import {CategorySelectInput} from './components/CategorySelectInput'
import DocumentAssocieInput from './components/DocumentAssocieInput'
import {LOCALE_OPTIONS} from './utils/localeOptions'

//const CATEGORY_FEATURE_ENABLED = false
const API_VERSION = '2024-06-01'

const DUPLICATE_SEO_DESCRIPTION_QUERY = `count(*[
  _type == "page" &&
  defined(seo.description) &&
  seo.description == $description &&
  !(_id in [$draftId, $publishedId])
])`

const isUniquePerLocale = (slug: any, context: any) => {
  const {document, getClient} = context
  const client = getClient({apiVersion: API_VERSION}) // adapte si besoin

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
      name: 'popularScore',
      type: 'number',
      title: 'Popularité (manuel)',
      description: 'Score manuel pour booster les articles les plus lus.',
      initialValue: 0,
    }),
    defineField({
      name: 'readCount',
      type: 'number',
      title: 'Nombre de lectures',
      description: 'Métrique auto (analytics).',
      readOnly: true,
    }),
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
        list: LOCALE_OPTIONS,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'documentAssocie',
      title: 'Document associé',
      type: 'string',
      components: {
        input: DocumentAssocieInput,
      },
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Meta title',
          type: 'string',
          validation: (Rule) => [
            Rule.required().warning('Le meta title est recommandé'),
            Rule.max(70).warning('Idéalement <= 60-70 caractères'),
          ],
        }),
        defineField({
          name: 'description',
          title: 'Meta description',
          type: 'text',
          rows: 4,
          validation: (Rule) => [
            Rule.required().warning('La meta description est recommandée'),
            Rule.min(70).warning('Idéalement >= 70 caractères'),
            Rule.max(160).warning('Idéalement <= 160 caractères'),
            Rule.custom(async (value, context) => {
              const description = typeof value === 'string' ? value.trim() : ''
              if (!description) return true

              const docId = (context.document?._id || '').replace(/^drafts\./, '')
              if (!docId) return true

              const client = context.getClient({apiVersion: API_VERSION})
              const count = await client.fetch(DUPLICATE_SEO_DESCRIPTION_QUERY, {
                description,
                draftId: `drafts.${docId}`,
                publishedId: docId,
              })

              return count > 0 ? 'Meta description déjà utilisée sur une autre page.' : true
            }).warning(),
          ],
        }),
      ],
    }),

    // defineField({
    //   name: 'categorie',
    //   title: 'Catégorie',
    //   type: 'string',
    //   hidden: CATEGORY_FEATURE_ENABLED ? ({document}) => !document?.locale : true,
    //   readOnly: !CATEGORY_FEATURE_ENABLED,
    //   ...(CATEGORY_FEATURE_ENABLED
    //     ? {
    //         description: 'Sélectionnez d’abord la locale pour afficher les catégories disponibles.',
    //         components: {input: CategorySelectInput},
    //         options: {list: ALL_CATEGORY_OPTIONS},
    //         validation: (Rule) =>
    //           Rule.required().custom((value, context) => {
    //             if (!value) return true

    //             const locale = context?.document?.locale as string | undefined
    //             const available = getCategoriesForLocale(locale).map((option) => option.value)
    //             const normalizedAvailable = new Set(available.map(sanitizeCategoryValue))

    //             return normalizedAvailable.has(sanitizeCategoryValue(value))
    //               ? true
    //               : 'Cette catégorie n’est pas disponible pour la locale sélectionnée.'
    //           }),
    //       }
    //     : {}),
    // }),
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
  __experimental_search: [
    {path: 'slug.current', weight: 80, mapWith: 'lower'},
    {path: 'title', weight: 40},
    {path: 'locale', weight: 10},
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
