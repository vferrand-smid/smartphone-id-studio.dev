import {UserIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const authorType = defineType({
  name: 'author',
  title: 'Auteurs',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({name: 'name', type: 'string'}),
    defineField({name: 'description', type: 'text'}),
    defineField({name: 'avatar', type: 'image'}),
    defineField({name: 'link', type: 'url'}),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'avatar',
    },
  },
})
