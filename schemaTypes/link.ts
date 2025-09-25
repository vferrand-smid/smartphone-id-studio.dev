// schemas/link.ts
import {defineField, defineType} from 'sanity'

import {validateLink} from './utils/linkValidation'

export default defineType({
  name: 'link',
  type: 'object',
  title: 'Lien',
  fields: [
    defineField({
      name: 'href',
      type: 'string',
      title: 'URL',
      validation: (Rule) => Rule.custom(validateLink),
    }),
  ],
})
