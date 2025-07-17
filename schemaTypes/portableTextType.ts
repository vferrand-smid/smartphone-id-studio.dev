import {defineType} from 'sanity'

export default defineType({
  name: 'blockContent',
  title: 'Contenu riche',
  type: 'array',
  of: [
    {
      type: 'block',
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
            fields: [{name: 'href', type: 'url', title: 'URL'}],
          },
          {
            name: 'color',
            type: 'object',
            title: 'Couleur du texte',
            fields: [{name: 'hex', type: 'string', title: 'Code couleur (hex)'}],
          },
        ],
      },
    },
    {type: 'image', options: {hotspot: true}},
    {type: 'videoEmbed'},
    {type: 'tableOfContents'},
    {type: 'tableCustom'},
  ],
})
