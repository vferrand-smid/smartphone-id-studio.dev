import {defineType} from 'sanity'

export const tableCustom = defineType({
  name: 'tableCustom',
  title: 'Tableau',
  type: 'object',
  fields: [
    {
      name: 'rows',
      title: 'Lignes',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'tableRow',
          fields: [
            {
              name: 'isHeader',
              title: 'Est une ligne d’en-tête',
              type: 'boolean',
            },
            {
              name: 'cells',
              title: 'Cellules',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'content',
                      type: 'cellRichText',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
})
