import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'legalPage',
  title: 'Legal Page',
  type: 'document',
  fields: [
    defineField({
      name: 'kind',
      title: 'Kind',
      type: 'string',
      options: {
        list: [
          {title: 'Privacy policy', value: 'privacy'},
          {title: 'Terms of service', value: 'terms'},
          {title: 'Legal notice / Imprint', value: 'imprint'},
          {title: 'Cookies', value: 'cookies'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pivotLanguage',
      title: 'Pivot language',
      type: 'string',
      options: {
        list: [
          {title: 'Français', value: 'fr'},
          {title: 'English', value: 'en'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'title', title: 'Title', type: 'string', validation: (R) => R.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (R) => R.required(),
    }),
    defineField({name: 'content', title: 'Content', type: 'blockContent'}),
    defineField({name: 'updatedAt', title: 'Last updated', type: 'datetime'}),
  ],
  preview: {
    select: {title: 'title', kind: 'kind', lang: 'pivotLanguage'},
    prepare: ({title, kind, lang}) => ({title: `${title} — ${kind} (${lang?.toUpperCase()})`}),
  },
})
