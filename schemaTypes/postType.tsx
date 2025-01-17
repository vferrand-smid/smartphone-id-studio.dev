import {defineField, defineType} from 'sanity'
import {defineArrayMember} from 'sanity'
import {Card, Text} from '@sanity/ui'

export const postType = defineType({
    name: 'post',
    title: 'Post',
    type: 'document',
    array: [
      defineArrayMember({
      name: 'content',
      type: 'block',
      styles: [
        {
          title: 'Section Header',
          value: 'sectionHeader',
          component: (props) => (
            <Card paddingBottom={4}>
              <Text size={4} weight="bold">
                {props.children}
              </Text>
            </Card>
          ),
        },
      ],
    })
  ]
    fields: [
        defineField({
            name: 'title',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
            type: 'slug',
            options: {source: 'title'},
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'publishedAt',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'image',
            type: 'image',
        }),
        defineField({
            name: 'body',
            type: 'array',
            of: [{type: 'block'}],
        }),
        defineField({
            name: 'locale',
            title: 'Locale',
            type: 'string',
            options: {
                list: [
                    { title: 'English (UK)', value: 'en-GB' },
                    { title: 'French (France)', value: 'fr-FR' },
                    { title: 'Spanish (Spain)', value: 'es-ES' },
                    // Ajoutez d'autres locales ici selon vos besoins
                ],
            },
            validation: (rule) => rule.required(),
        }),
    ],
});
