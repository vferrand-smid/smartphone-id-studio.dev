import {StructureBuilder} from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Contenu')
    .items([
      S.listItem()
        .title('Pages')
        .child(
          S.list()
            .title('Pages par locale')
            .items(
              locales.map((locale) =>
                S.listItem()
                  .title(`Pages (${locale})`)
                  .child(
                    S.documentList()
                      .title(`Pages – ${locale}`)
                      .filter('_type == "page" && locale == $locale')
                      .params({locale}),
                  ),
              ),
            ),
        ),
      S.divider(),
      S.documentTypeListItem('auteur').title('Auteurs'),
    ])
