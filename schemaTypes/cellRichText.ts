import {defineArrayMember, defineField, defineType} from 'sanity'

import {validateLink} from './utils/linkValidation'

export const cellRichText = defineType({
  name: 'cellRichText',
  title: 'Cellule enrichie',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [{title: 'Normal', value: 'normal'}],
      lists: [{title: 'Liste à puces', value: 'bullet'}],
      marks: {
        decorators: [
          {title: 'Gras', value: 'strong'},
          {title: 'Italique', value: 'em'},
          {title: 'Surligné', value: 'highlight'},
        ],
        annotations: [
          defineType({
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
          }),
          {
            name: 'color',
            type: 'object',
            title: 'Couleur du texte TEST',
            fields: [{name: 'hex', type: 'string', title: 'Code couleur (hex)'}],
          },
          {
            name: 'bgColor',
            type: 'object',
            title: 'Couleur de surlignage',
            fields: [
              {
                name: 'hex',
                type: 'string',
                title: 'Code couleur (hex)',
                description: 'Exemple : #2FC977',
              },
            ],
          },
        ],
      },
    }),
  ],
})
