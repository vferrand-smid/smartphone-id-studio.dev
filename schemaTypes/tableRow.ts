import {defineType} from 'sanity'

export default defineType({
  name: 'tableRow',
  title: 'Ligne de tableau',
  type: 'object',
  fields: [
    {
      name: 'cells',
      title: 'Cellules',
      type: 'array',
      of: [{type: 'string'}],
    },
    {
      name: 'isHeader',
      title: 'Est une ligne d’en-tête',
      type: 'boolean',
      initialValue: false,
    },
  ],
})
