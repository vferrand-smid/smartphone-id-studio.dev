import {StructureBuilder} from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Contenu')
    .items([
      S.listItem()
        .title('Pages')
        .id('pages')
        .child(
          S.documentList()
            .title('Pages')
            .filter('_type == "page" && (!defined(trashed) || trashed == false)'),
        ),

      S.listItem()
        .title('🗑️ Corbeille')
        .id('trash')
        .child(
          S.documentList().title('Pages supprimées').filter('_type == "page" && trashed == true'),
        ),

      S.documentTypeListItem('author').id('author-docs'),
    ])
