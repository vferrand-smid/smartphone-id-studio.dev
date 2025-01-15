// schemas/blogPost.js
import { defineType, defineField } from 'sanity';

export const blogPost = defineType({
    name: 'blogPost',
    title: 'Blog Post',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            type: 'string',
            title: 'Title',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            type: 'slug',
            title: 'Slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'publishedAt',
            type: 'datetime',
            title: 'Published At',
            validation: (Rule) => Rule.required(),
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
        defineField({
            name: 'image',
            type: 'image',
            title: 'Main Image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'body',
            type: 'array',
            title: 'Body',
            of: [
                { type: 'block' }, // Texte simple
                {
                    type: 'image', // Image dans le corps
                    options: { hotspot: true },
                },
                {
                    type: 'object', // Section de texte structurée
                    name: 'section',
                    fields: [
                        defineField({
                            name: 'heading',
                            type: 'string',
                            title: 'Section Heading',
                        }),
                        defineField({
                            name: 'content',
                            type: 'array',
                            of: [{ type: 'block' }],
                        }),
                    ],
                },
            ],
        }),
        defineField({
            name: 'links',
            type: 'array', // Nouveau champ pour gérer les liens séparément
            title: 'Links',
            of: [
                {
                    type: 'url', // Lien externe
                    title: 'External Link',
                },
            ],
        }),
    ],
});
