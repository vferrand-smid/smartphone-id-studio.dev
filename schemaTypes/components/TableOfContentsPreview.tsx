import type {ObjectPreviewProps} from 'sanity'

type TableOfContentsValue = {
  content?: Array<{
    _key?: string
    children?: Array<{text?: string}>
  }>
}

const getItemTitle = (value: TableOfContentsValue['content'][number]) =>
  (value?.children ?? [])
    .map((child) => child?.text ?? '')
    .join('')
    .trim()

const TableOfContentsPreview = (props: ObjectPreviewProps<TableOfContentsValue>) => {
  const items = props?.value?.content ?? []
  const hasItems = items.length > 0

  return (
    <div style={{padding: '0.75rem 1rem', border: '1px solid #ddd', borderRadius: '0.5rem'}}>
      <strong style={{display: 'block', marginBottom: '0.5rem'}}>Table des matières</strong>
      {hasItems ? (
        <ol style={{margin: 0, paddingLeft: '1.2rem', lineHeight: 1.4}}>
          {items.map((item, index) => {
            const title = getItemTitle(item)
            return (
              <li key={item?._key ?? index} style={{marginBottom: '0.3rem'}}>
                {title || 'Élément sans titre'}
              </li>
            )
          })}
        </ol>
      ) : (
        <em>Ajoutez des entrées pour afficher la table des matières.</em>
      )}
    </div>
  )
}

export {TableOfContentsPreview}
