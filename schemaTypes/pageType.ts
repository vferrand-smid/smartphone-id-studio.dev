import {DocumentIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const pageType = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({name: 'title', type: 'string'}),
    defineField({name: 'slug', type: 'slug'}),
    defineField({name: 'date', type: 'datetime'}),
    defineField({name: 'modified', type: 'datetime'}),
    defineField({
      name: 'status',
      type: 'string',
      options: {
        list: [
          {title: 'Published', value: 'publish'},
          {title: 'Draft', value: 'draft'},
          {title: 'Trash', value: 'trash'},
        ],
      },
    }),
    defineField({
      name: 'content',
      type: 'blockContent',
      title: 'Content',
    }),

    defineField({
      name: 'excerpt',
      type: 'array',
      title: 'Excerpt',
      of: [{type: 'block'}],
    }),

    defineField({
      name: 'featuredMedia',
      type: 'image',
      title: 'Featured Image',
      options: {hotspot: true},
    }),

    defineField({
      name: 'author',
      type: 'reference',
      title: 'Author',
      to: [{type: 'author'}],
    }),
    defineField({
      name: 'locale',
      title: 'Locale',
      type: 'string',
      options: {
        list: [
          {title: 'Arabic', value: 'ar'},
          {title: 'Arabic (Saudi Arabia) 🇸🇦', value: 'ar-SA'},
          {title: 'Arabic (United Arab Emirates) 🇦🇪', value: 'ar-AE'},
          // {title: 'Chinese', value: 'zh-CN'},
          {title: 'Deutsch', value: 'de'},
          {title: 'Deutsch (Germany) 🇩🇪', value: 'de-DE'},
          // {title: 'Deutsch (Netherlands)', value: 'de-NL'},
          // {title: 'Deutsch (Switzerland)', value: 'de-CH'},
          {title: 'English', value: 'en'},
          // {title: 'English (Australia)', value: 'en-AU'},
          {title: 'English (Canada) 🇨🇦', value: 'en-CA'},
          {title: 'English (UK) 🇬🇧', value: 'en-GB'},
          // {title: 'English (India)', value: 'en-IN'},
          {title: 'English (Ireland) 🇮🇪', value: 'en-IE'},
          // {title: 'English (Nigeria)', value: 'en-NG'},
          // {title: 'English (New Zealand)', value: 'en-NZ'},
          // {title: 'English (Singapore)', value: 'en-SG'},
          // {title: 'English (South Africa)', value: 'en-ZA'},
          {title: 'English (US) 🇺🇸', value: 'en-US'},
          // {title: 'Estonian (Estonia)', value: 'et-EE'},
          // {title: 'Spanish', value: 'es'},
          // {title: 'Spanish (Argentina)', value: 'es-AR'},
          // {title: 'Spanish (Colombia)', value: 'es-CO'},
          // {title: 'Spanish (Mexico)', value: 'es-MX'},
          // {title: 'Netherlands', value: 'nl-NL'},
          // {title: 'Français', value: 'fr'},
          {title: 'Français (Belgium) 🇧🇪', value: 'fr-BE'},
          {title: 'Français (Canada) 🇨🇦', value: 'fr-CA'},
          {title: 'Français (France) 🇫🇷', value: 'fr-FR'},
          {title: 'Français (Suisse) 🇨🇭', value: 'fr-CH'},
          // {title: 'Italian (Italy)', value: 'it-IT'},
          // {title: 'Italiano', value: 'it'},
          // {title: 'Polish (Poland)', value: 'pl-PL'},
          // {title: 'Portuguese', value: 'pt'},
          // {title: 'Portuguese (Brazil)', value: 'pt-BR'},
          {title: 'Portuguese (Portugal) 🇵🇹', value: 'pt-PT'},
          // {title: 'Russian (Russia)', value: 'ru-RU'},
          // {title: 'Russian (Русский)', value: 'ru'},
          {title: 'Swedish (Sweden) 🇸🇪', value: 'sv-SE'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sourceId',
      type: 'number',
      hidden: true,
    }),
    defineField({
      name: 'trashed',
      type: 'boolean',
      hidden: true,
    }),
  ],
  // Option de tri par langue dans Sanity
  orderings: [
    {
      title: 'By Locale',
      name: 'localeAsc',
      by: [{field: 'locale', direction: 'asc'}],
    },
    {
      title: 'By Date',
      name: 'dateDesc',
      by: [{field: 'date', direction: 'desc'}],
    },
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'locale',
      media: 'featuredMedia',
    },
  },
})
