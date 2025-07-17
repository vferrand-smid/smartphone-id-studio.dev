import {defineType} from 'sanity'

export const cellRichText = defineType({
  name: 'cellRichText',
  title: 'Cellule enrichie',
  type: 'array',
  of: [
    {
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
          {
            name: 'link',
            type: 'object',
            title: 'Lien',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
              },
            ],
          },
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
    },
  ],
})
