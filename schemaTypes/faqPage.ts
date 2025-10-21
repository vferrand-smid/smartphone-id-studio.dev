import {defineArrayMember, defineField, defineType} from 'sanity'

import {LOCALE_OPTIONS} from './utils/localeOptions'

const isUniquePerLocale = (slug: any, context: any) => {
  const {document, getClient} = context
  const client = getClient({apiVersion: '2024-06-01'})

  const id = document?._id?.replace(/^drafts\./, '')
  const locale = document?.locale
  const current = slug?.current

  if (!locale || !current) return true

  const params = {
    slug: current,
    locale,
    draftId: `drafts.${id}`,
    publishedId: id,
  }

  const query = `!defined(*[
    _type == "faqPage" &&
    slug.current == $slug &&
    locale == $locale &&
    !(_id in [$draftId, $publishedId])
  ][0]._id)`

  return client.fetch(query, params)
}

export const faqPage = defineType({
  name: 'faqPage',
  title: 'FAQ — Page locale',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre interne',
      type: 'string',
      description: 'Optionnel, utilisé uniquement pour vous repérer dans le Studio.',
    }),
    defineField({
      name: 'locale',
      title: 'Locale',
      type: 'string',
      options: {list: LOCALE_OPTIONS},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: () => 'faq',
        maxLength: 96,
        isUnique: isUniquePerLocale,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sections',
      title: 'Sections de questions',
      type: 'array',
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqSection',
          fields: [
            defineField({
              name: 'title',
              title: 'Titre de section',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'anchor',
              title: 'Ancre personnalisée',
              type: 'slug',
              description: 'Optionnel. Permet de définir un identifiant d’ancre (FAQ #titre).',
              options: {source: 'title', maxLength: 100},
            }),
            defineField({
              name: 'questions',
              title: 'Questions / réponses',
              type: 'array',
              validation: (Rule) => Rule.required().min(1),
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'faqQuestion',
                  fields: [
                    defineField({
                      name: 'question',
                      title: 'Question',
                      type: 'string',
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: 'answer',
                      title: 'Réponse',
                      type: 'array',
                      of: [defineArrayMember({type: 'block'})],
                      validation: (Rule) => Rule.required().min(1),
                    }),
                  ],
                  preview: {
                    select: {title: 'question'},
                    prepare: ({title}) => ({
                      title: title || 'Question sans titre',
                    }),
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {title: 'title', questions: 'questions'},
            prepare: ({title, questions}) => {
              const count = Array.isArray(questions) ? questions.length : 0
              return {
                title: title || 'Section sans titre',
                subtitle: count ? `${count} question${count > 1 ? 's' : ''}` : '0 question',
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      locale: 'locale',
      sections: 'sections',
    },
    prepare: ({title, locale, sections}) => {
      const count = Array.isArray(sections) ? sections.length : 0
      return {
        title: title || `FAQ ${locale || '–'}`,
        subtitle: `${locale?.toUpperCase() || 'Locale inconnue'} — ${count} section${
          count > 1 ? 's' : ''
        }`,
      }
    },
  },
})
