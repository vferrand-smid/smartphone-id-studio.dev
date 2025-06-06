import {defineType} from 'sanity'

export default defineType({
  name: 'table',
  title: 'Tableau',
  type: 'object',
  fields: [
    {
      name: 'rows',
      title: 'Lignes',
      type: 'array',
      of: [{type: 'tableRow'}],
    },
  ],
})
