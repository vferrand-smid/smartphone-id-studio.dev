import {createClient} from '@sanity/client'
import {StructureBuilder} from 'sanity/structure'
import {getLocales} from './migrations/lib/getLocales'

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET!,
  apiVersion: process.env.SANITY_STUDIO_API_VERSION!,
  useCdn: false,
})

export const structure = async (S: StructureBuilder) => {
  const locales = (await getLocales()) || []

  return S.list()
    .title('Contenu')
    .items([
      S.listItem()
        .title('Pages')
        .child(
          S.list()
            .title('Pages par locale')
            .items(
              await Promise.all(
                locales.map(async (locale: string) => {
                  const count = await client.fetch<number>(
                    `count(*[_type == "page" && locale == $locale])`,
                    {locale},
                  )

                  return S.listItem()
                    .title(`Pages (${locale} – ${count})`)
                    .child(
                      S.documentList()
                        .title(`Pages – ${locale}`)
                        .filter('_type == "page" && locale == $locale')
                        .params({locale})
                        .menuItems(S.documentTypeList('page').getMenuItems()),
                    )
                }),
              ),
            ),
        ),
      S.divider(),
      S.documentTypeListItem('author').title('Auteurs'),
    ])
}
