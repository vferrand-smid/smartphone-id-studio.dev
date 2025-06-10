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
        ],
      },
    },
  ],
})
