// schemaTypes/videoEmbed.ts
export default {
  name: 'videoEmbed',
  type: 'object',
  title: 'Vidéo intégrée',
  fields: [
    {
      name: 'url',
      type: 'url',
      title: 'URL de la vidéo',
      validation: (Rule: any) => Rule.required(),
    },
  ],
  preview: {
    select: {
      url: 'url',
    },
    prepare({url}: {url: string}) {
      return {
        title: 'Vidéo',
        subtitle: url,
      }
    },
  },
}
