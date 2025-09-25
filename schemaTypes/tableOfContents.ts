import {MdLink} from 'react-icons/md'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {TableOfContentsPreview} from './components/TableOfContentsPreview'
import {validateLink} from './utils/linkValidation'

export default defineType({
  name: 'tableOfContents',
  type: 'object',
  title: 'Table des matières',
  components: {
    preview: TableOfContentsPreview,
  },
  fields: [
    defineField({
      name: 'content',
      title: 'Contenu',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{title: 'Paragraphe', value: 'normal'}],
          lists: [{title: 'Liste à puces', value: 'bullet'}],
          marks: {
            decorators: [],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Lien',
                icon: MdLink,
                fields: [
                  {
                    name: 'href',
                    type: 'string',
                    title: 'URL',
                    validation: (Rule) => Rule.custom(validateLink),
                  },
                ],
              },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'blockIndexMap',
      title: 'Index des blocs (hérité)',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'listIndexMap',
      title: 'Index des listes (hérité)',
      type: 'string',
      hidden: true,
    }),
  ],
})
