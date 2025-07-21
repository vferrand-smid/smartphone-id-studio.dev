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
        ],
        annotations: [
          {
            name: 'color',
            type: 'object',
            title: 'Couleur du texte',
            fields: [
              {
                name: 'color',
                type: 'color',
                title: 'Choisir une couleur',
                options: {
                  // Palette custom possible ici !
                  colorList: ['#2fc977', '#ffc600'],
                  // disableAlpha: true, // option pour virer la transparence
                },
              },
            ],
          },
          {
            name: 'bgColor',
            type: 'object',
            title: 'Surlignage (couleur de fond)',
            fields: [
              {
                name: 'color',
                type: 'color',
                title: 'Choisir une couleur de fond',
                options: {
                  colorList: [
                    '#2fc977', // vert
                    '#ffe066', // jaune
                    '#ffe4e1', // rose pâle
                    '#cce8ff', // bleu pâle
                  ],
                },
              },
            ],
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
