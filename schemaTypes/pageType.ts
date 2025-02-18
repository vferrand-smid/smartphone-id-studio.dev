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
                    {title: 'Future', value: 'future'},
                    {title: 'Draft', value: 'draft'},
                    {title: 'Pending', value: 'pending'},
                    {title: 'Private', value: 'private'},
                    {title: 'Trash', value: 'trash'},
                    {title: 'Auto-Draft', value: 'auto-draft'},
                    {title: 'Inherit', value: 'inherit'},
                ],
            },
        }),
        defineField({
            name: 'content',
            type: 'array',
            title: 'Content',
            of: [{ type: 'block' }],
        }),

        defineField({
            name: 'excerpt',
            type: 'array',
            title: 'Excerpt',
            of: [{ type: 'block' }],
        }),

        defineField({
            name: 'featuredMedia',
            type: 'image',
            title: 'Featured Image',
            options: { hotspot: true },
        }),

        defineField({
            name: 'author',
            type: 'reference',
            title: 'Author',
            to: [{ type: 'author' }],
        }),
        defineField({
            name: 'locale',
            title: 'Locale',
            type: 'string',
            options: {
                list: [
                    { title: 'French (Canada)', value: 'fr_CA' },
                    { title: 'French (France)', value: 'fr_FR' },
                    { title: 'English (UK)', value: 'en_GB' },
                    { title: 'English (US)', value: 'en_US' },
                    { title: 'Spanish (Argentina)', value: 'es_AR' },
                    { title: 'Portuguese (Brazil)', value: 'pt_BR' },
                    { title: 'Chinese (Simplified)', value: 'zh-hans' },
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
    ],
    // Option de tri par langue dans Sanity
    orderings: [
        {
            title: 'By Locale',
            name: 'localeAsc',
            by: [{ field: 'locale', direction: 'asc' }],
        },
        {
            title: 'By Date',
            name: 'dateDesc',
            by: [{ field: 'date', direction: 'desc' }],
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