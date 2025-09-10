import {createClient} from '@sanity/client'
import {StructureBuilder} from 'sanity/structure'
import IframePreview from './IframePreview'
import {getLocales} from './migrations/lib/getLocales'

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET!,
  apiVersion: process.env.SANITY_STUDIO_API_VERSION!,
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
    client.fetch<number>('count(*[_type == "page" && status == "publish"])'),
    client.fetch<number>('count(*[_type == "page" && status == "draft"])'),
    client.fetch<number>('count(*[_type == "page" && status == "trash"])'),
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
      filter: '_type == "page" && status == "publish"',
    },
    {
      label: `📝 Brouillons (${countDraft})`,
      filter: '_type == "page" && status == "draft"',
    },
    {
      label: `❓ Sans statut (${countUndefined})`,
      filter: '_type == "page" && (!defined(status) || status == null)',
    },
    {
      label: `🗑️ Corbeille (${countTrash})`,
      filter: '_type == "page" && status == "trash"',
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
            .child((documentId) => {
              return S.document()
                .documentId(documentId)
                .schemaType('page')
                .views([S.view.form(), S.view.component(IframePreview).title('Preview')])
            }),
        )
    }),
  )

  // ⚖️ Section "Pages légales" (FR/EN uniquement, IDs fixes)
  const buildLegalSection = (S: StructureBuilder) =>
    S.listItem()
      .title('Pages légales ⚖️')
      .child(
        S.list()
          .title('Pages légales')
          .items([
            S.listItem()
              .title('Privacy (FR)')
              .child(
                S.editor().id('privacy-fr').schemaType('legalPage').documentId('legal_privacy_fr'),
              ),
            S.listItem()
              .title('Privacy (EN)')
              .child(
                S.editor().id('privacy-en').schemaType('legalPage').documentId('legal_privacy_en'),
              ),
            S.listItem()
              .title('Terms (FR)')
              .child(
                S.editor().id('terms-fr').schemaType('legalPage').documentId('legal_terms_fr'),
              ),
            S.listItem()
              .title('Terms (EN)')
              .child(
                S.editor().id('terms-en').schemaType('legalPage').documentId('legal_terms_en'),
              ),
            S.listItem()
              .title('Imprint (FR)')
              .child(
                S.editor().id('imprint-fr').schemaType('legalPage').documentId('legal_imprint_fr'),
              ),
            S.listItem()
              .title('Imprint (EN)')
              .child(
                S.editor().id('imprint-en').schemaType('legalPage').documentId('legal_imprint_en'),
              ),
            S.listItem()
              .title('Cookies (FR)')
              .child(
                S.editor().id('cookies-fr').schemaType('legalPage').documentId('legal_cookies_fr'),
              ),
            S.listItem()
              .title('Cookies (EN)')
              .child(
                S.editor().id('cookies-en').schemaType('legalPage').documentId('legal_cookies_en'),
              ),
          ]),
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

      // Section dédiée aux pages légales (singletons)
      buildLegalSection(S),

      S.listItem()
        .title('Auteurs 🧑‍💻')
        .child(
          S.documentTypeList('author')
            .title('Auteurs')
            .defaultOrdering([{field: 'name', direction: 'asc'}]),
        ),
    ])
}
