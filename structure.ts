import {createClient} from '@sanity/client'
import {StructureBuilder} from 'sanity/structure'
import {getLocales} from './migrations/lib/getLocales'

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET!,
  apiVersion: process.env.SANITY_STUDIO_API_VERSION!,
  token: process.env.SANITY_STUDIO_API_TOKEN!,
  useCdn: false,
  perspective: 'raw',
})

function flagEmojiFromLocale(locale: string) {
  const code = locale.split('-')[1] || locale
  return code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
}

export const structure = async (S: StructureBuilder) => {
  const locales = (await getLocales()) || []

  // ➕ Compter les pages par statut
  const [countPublished, countDraft, countTrash, countUndefined] = await Promise.all([
    client.fetch<number>(
      'count(*[_type == "page" && status == "publish" && !(_id in path("drafts.**"))])',
    ),
    client.fetch<number>(
      'count(*[_type == "page" && status == "draft" && !(_id in path("drafts.**"))])',
    ),
    client.fetch<number>(
      'count(*[_type == "page" && status == "trash" && !(_id in path("drafts.**"))])',
    ),
    client.fetch<number>(
      `count(*[
    _type == "page" &&
    !defined(status) &&
    !(_id in path("drafts.**")) &&
    !(_id match "_.%") &&
    !(_id match "_.**") &&
    !(_id match "*i18n*" || _id match "*translation*")
  ])`,
    ),
  ])

  // ➕ Créer dynamiquement les items par statut
  const statusItems = [
    {
      label: `🟢 Publiées (${countPublished})`,
      filter: '_type == "page" && status == "publish" && !(_id in path("drafts.**"))',
    },
    {
      label: `📝 Brouillons (${countDraft})`,
      filter: '_type == "page" && status == "draft" && !(_id in path("drafts.**"))',
    },
    {
      label: `❓ Sans statut (${countUndefined})`,
      filter:
        '_type == "page" && (!defined(status) || status == null) && !(_id in path("drafts.**"))',
    },
    {
      label: `🗑️ Corbeille (${countTrash})`,
      filter: '_type == "page" && status == "trash" && !(_id in path("drafts.**"))',
    },
  ].map(({label, filter}) =>
    S.listItem()
      .title(label)
      .child(
        S.documentList()
          .title(label)
          .filter(filter)
          .defaultOrdering([{field: 'title', direction: 'asc'}]),
      ),
  )

  // ➕ Pages sans locale
  const undefinedLocaleCount = await client.fetch<number>(
    `count(*[_type == "page" && (!defined(locale) || locale == null || locale == "" || locale == "und")])`,
  )

  const undefinedLocaleItem = S.listItem()
    .title(`❓ Locale manquante (${undefinedLocaleCount})`)
    .child(
      S.documentList()
        .title('Pages sans locale')
        .defaultOrdering([{field: 'title', direction: 'asc'}])
        .filter(
          '_type == "page" && (!defined(locale) || locale == null || locale == "" || locale == "und")',
        ),
    )

  // ➕ Créer dynamiquement les items par locale
  const localeItems = await Promise.all(
    locales.map(async (locale: string) => {
      const count = await client.fetch<number>(`count(*[_type == "page" && locale == $locale])`, {
        locale,
      })

      return S.listItem()
        .title(`${flagEmojiFromLocale(locale)} Pages (${locale} – ${count})`)
        .child(
          S.documentList()
            .title(`Pages – ${locale}`)
            .filter('_type == "page" && locale == $locale')
            .params({locale})
            .defaultOrdering([{field: 'title', direction: 'asc'}])
            .menuItems(S.documentTypeList('page').getMenuItems()),
        )
    }),
  )

  // ➕ Structure finale
  return S.list()
    .title('Contenu')
    .items([
      S.listItem()
        .title('Pages par statut 📄')
        .child(S.list().title('Pages par statut').items(statusItems)),

      S.listItem()
        .title('Pages par locale 🌏')
        .child(
          S.list()
            .title('Pages par locale')
            .items([undefinedLocaleItem, ...localeItems]),
        ),

      S.divider(),

      S.listItem()
        .title('Auteurs 🧑‍💻')
        .child(
          S.documentTypeList('author')
            .title('Auteurs')
            .defaultOrdering([{field: 'name', direction: 'asc'}]),
        ),
    ])
}
