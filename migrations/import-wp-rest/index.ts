// SCRIPT POUR IMPORTER LES PAGES DE WP AVEC L'API REST

import axios from 'axios'
import {decode} from 'html-entities'
import {createOrReplace, defineMigration} from 'sanity/migrate'
import {htmlToPortableText, loadImageCache, saveImageCache} from '../lib/htmlToPortableText'
import {mapWpmlToSanityLocale} from '../lib/localeMapping'

// Langue WordPress à importer
const LANGUAGE_CODE = 'en_CA'

// Mappage vers Sanity
const SANITY_LOCALE = mapWpmlToSanityLocale(LANGUAGE_CODE)
if (!SANITY_LOCALE) throw new Error(`❌ Locale WP "${LANGUAGE_CODE}" inconnue dans le mapping.`)

export default defineMigration({
  title: `Import WP REST - ${SANITY_LOCALE}`,

  async *migrate() {
    await loadImageCache()

    const perPage = 100
    let page = 1
    let totalImported = 0

    console.log(`🚀 Migration REST pour WP=${LANGUAGE_CODE} → Sanity=${SANITY_LOCALE}`)

    try {
      while (true) {
        const url = `https://www.smartphone-id.com/wp-json/wp/v2/pages?lang=${LANGUAGE_CODE}&per_page=${perPage}&page=${page}&_fields=id,slug,title,content,date,modified,status`
        console.log(`📥 Fetching page ${page} from: ${url}`)

        const res = await axios.get(url, {
          auth: {
            username: process.env.WP_USER!,
            password: process.env.WP_APP_PASSWORD!,
          },
        })

        const pages = res.data
        if (!pages.length) break

        const docsPromises = pages.map(async (pageItem: any) => {
          try {
            // console.log(
            //   `💡 HTML reçu pour ${pageItem.slug}:\n`,
            //   pageItem.content?.rendered?.includes('lwptoc') ? '✅ TOC détecté' : '❌ Pas de TOC',
            // )

            const parsedContent = await htmlToPortableText(pageItem.content?.rendered || '')

            return createOrReplace({
              _id: `page-${pageItem.slug || pageItem.id}-${LANGUAGE_CODE}`,
              _type: 'page',
              title: decode(pageItem.title?.rendered || 'Sans titre'),
              slug: {_type: 'slug', current: pageItem.slug},
              content: parsedContent.length
                ? parsedContent
                : [{_type: 'block', style: 'normal', children: [{_type: 'span', text: ''}]}],
              date: pageItem.date,
              modified: pageItem.modified,
              status: pageItem.status ?? 'draft',
              locale: SANITY_LOCALE,
            })
          } catch (error) {
            console.error(`❌ Erreur page "${pageItem.slug}":`, error)
            return null
          }
        })

        const docs = (await Promise.all(docsPromises)).filter(Boolean)
        if (docs.length > 0) {
          yield docs
          totalImported += docs.length
          console.log(`✅ ${totalImported} pages importées`)

          // Vérifier s’il y a encore des pages à importer
          const totalPages = parseInt(res.headers['x-wp-totalpages'] || '1', 10)
          if (page >= totalPages) break

          page++
        }

        page++
      }

      await saveImageCache()
      console.log(`🎉 Import terminé. Total: ${totalImported} pages`)
    } catch (err) {
      console.error('❌ Erreur lors de la migration:', err)
      throw err
    }
  },
})
