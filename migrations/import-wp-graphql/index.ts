// SCRIPT POUR IMPORTER LES PAGES DE WP AVEC GRAPHQL

import {GraphQLClient, gql} from 'graphql-request'
import {createOrReplace, defineMigration} from 'sanity/migrate'
import {htmlToPortableText, loadImageCache, saveImageCache} from '../lib/htmlToPortableText'
import {mapWpmlToSanityLocale} from '../lib/localeMapping'

const client = new GraphQLClient('https://www.smartphone-id.com/graphql')

// Ici tu précises directement la langue
const LANGUAGE_CODE = 'ne' // <-- change ici si tu veux tester une autre langue !

// Requête GraphQL simple avec la langue fixée
const GET_PAGES = gql`
  query GetPages($after: String) {
    pages(first: 100, after: $after, where: { language: "${LANGUAGE_CODE}" }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          slug
          title
          content
          date
          modified
          status
          language {
            code
          }
        }
      }
    }
  }
`

export default defineMigration({
  title: `Import WP Pages - ${LANGUAGE_CODE.toUpperCase()}`,

  async *migrate() {
    await loadImageCache()

    let hasNextPage = true
    let after: string | null = null
    let totalImported = 0

    console.log(`🚀 Migration des pages pour la langue : ${LANGUAGE_CODE}`)

    try {
      while (hasNextPage) {
        const {pages}: any = await client.request(GET_PAGES, {after})

        const docsPromises = pages.edges.map(async ({node}: any) => {
          try {
            console.log(`💡 HTML reçu pour ${node.slug}:\n`, node.content)
            const parsedContent = await htmlToPortableText(node.content)

            return createOrReplace({
              _id: `page-${node.slug || node.id}-${node.language?.code}`,
              _type: 'page',
              title: node.title || 'Sans titre',
              slug: {_type: 'slug', current: node.slug},
              content: parsedContent.length
                ? parsedContent
                : [{_type: 'block', style: 'normal', children: [{_type: 'span', text: ''}]}],
              date: node.date,
              modified: node.modified,
              status: node.status ?? 'draft',
              locale: mapWpmlToSanityLocale(node.language?.code) || 'und',
            })
          } catch (error) {
            console.error(`Erreur lors du traitement de la page ${node.slug}:`, error)
            return null
          }
        })

        const docs = (await Promise.all(docsPromises)).filter(Boolean)
        if (docs.length > 0) {
          yield docs
          totalImported += docs.length
          console.log(`✅ ${totalImported} pages importées au total`)
        }

        hasNextPage = pages.pageInfo.hasNextPage
        after = pages.pageInfo.endCursor
      }
      console.log(`✅ Migration terminée, ${totalImported} pages importées.`)

      await saveImageCache()
      return
    } catch (error) {
      console.error('Erreur lors de la migration:', error)
      throw error
    }
  },
})
