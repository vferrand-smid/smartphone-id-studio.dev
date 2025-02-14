import type {SanityDocumentLike} from 'sanity'
import { createOrReplace, defineMigration } from 'sanity/migrate'
import { wpDataTypeFetch } from './lib/wpDataTypeFetch'
import type { WP_REST_API_Page } from 'wp-types'

// Migration pour importer uniquement les pages en français canadien
export default defineMigration({
  title: 'Import WP Pages - fr_CA',

  async *migrate() {
    const wpType = 'pages'
    const targetLocale = 'ne'
    let page = 1
    let hasMore = true

    while (hasMore) {
      try {
        // 🎯 Ajoute le filtre `wpml_language=fr_CA` dans l'URL
        const wpData = await wpDataTypeFetch(`${wpType}?wpml_language=${targetLocale}&per_page=100`, page);
        console.log(`Fetching WordPress pages in ${targetLocale} - Page ${page}`)
        console.log(wpData) // Vérifie les données retournées

        if (Array.isArray(wpData) && wpData.length) {
          const docs: SanityDocumentLike[] = []

          for (const wpDoc of wpData as WP_REST_API_Page[]) {
            // @ts-ignore
            console.log(`Processing page: ${wpDoc.title?.rendered} - Locale: ${targetLocale}`)

            // Création du document pour Sanity
            docs.push({
              _id: `page-${wpDoc.id}-${targetLocale}`,
              _type: 'page',
              title: wpDoc.title?.rendered.trim(),
              slug: wpDoc.slug,
              content: wpDoc.content?.rendered,
              excerpt: wpDoc.excerpt?.rendered?.trim(),
              status: wpDoc.status,
              date: wpDoc.date,
              locale: targetLocale,
            })
          }

          console.log(`📄 Nombre total de pages récupérées : ${docs.length}`);

          yield docs.map((doc) => createOrReplace(doc))
          page++
        } else {
          hasMore = false
        }
      } catch (error) {
        console.error(`Error fetching data for page ${page}:`, error)
        hasMore = false
      }
    }

  },
})