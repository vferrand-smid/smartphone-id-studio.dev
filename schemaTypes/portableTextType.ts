import {defineType} from 'sanity'

export default defineType({
  name: 'blockContent',
  title: 'Contenu riche',
  type: 'array',
  of: [
    {type: 'block'},
    {
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {type: 'videoEmbed'},
    {type: 'link'},
    {type: 'tableOfContents'},
    {type: 'tableCustom'},
  ],
})
