import {GraphQLClient, gql} from 'graphql-request'

// 👉 Mets ici ton endpoint WPGraphQL
const client = new GraphQLClient('https://www.smartphone-id.com/graphql')

// 👉 Ici tu récupères l'argument passé à la commande
const LANGUAGE_TO_COUNT = process.argv[2]

if (!LANGUAGE_TO_COUNT) {
  console.error('❌ Merci de préciser une langue ! Exemple : npm run count-pages fr')
  process.exit(1)
}

// ➡️ Juste ici : je rajoute "after" dans la query.
const COUNT_PAGES = (language: string, after?: string | null) => gql`
  query CountPages {
    pages(first: 100, ${after ? `after: "${after}",` : ''} where: {language: "${language}"}) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
        }
      }
    }
  }
`

async function countPagesByLanguage(languageCode: string) {
  let totalPages = 0
  let hasNextPage = true
  let after: string | null = null

  console.log(`🚀 Démarrage du comptage des pages pour la langue : ${languageCode}`)

  while (hasNextPage) {
    const {pages}: any = await client.request(COUNT_PAGES(languageCode, after))

    totalPages += pages.edges.length
    hasNextPage = pages.pageInfo.hasNextPage
    after = pages.pageInfo.endCursor

    console.log(`🔄 ${totalPages} pages comptées jusqu'ici...`)
  }

  console.log(`🎉 Total final pour ${languageCode} : ${totalPages} pages.`)
}

countPagesByLanguage(LANGUAGE_TO_COUNT)
  .then(() => console.log('✅ Comptage terminé.'))
  .catch((err) => console.error('❌ Erreur pendant le comptage :', err))
