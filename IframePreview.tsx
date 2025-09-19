export default function IframePreview(props: any) {
  const doc = props.document.displayed
  const previewFrontUrl = process.env.SANITY_STUDIO_PREVIEW_URL
  if (!doc?.slug?.current) {
    return <div style={{padding: 32}}>Pas de slug défini…</div>
  }

  if (!previewFrontUrl) {
    return <div style={{padding: 32}}>Prévisualisation indisponible (URL front manquante)</div>
  }

  const docType = doc?._type
  const params = new URLSearchParams({slug: doc.slug.current})

  if (docType === 'legalPage') {
    const pivotLanguage = typeof doc?.pivotLanguage === 'string' ? doc.pivotLanguage.toLowerCase() : ''
    if (!pivotLanguage) {
      return <div style={{padding: 32}}>Pas de langue pivot définie…</div>
    }
    params.set('locale', pivotLanguage)
    params.set('type', 'legal')
    if (typeof doc?.kind === 'string' && doc.kind) {
      params.set('kind', doc.kind)
    }
  } else if (doc?.locale) {
    params.set('locale', doc.locale.toLowerCase())
    params.set('type', 'blog')
  } else {
    return <div style={{padding: 32}}>Pas de locale définie…</div>
  }

  const url = `${previewFrontUrl}/api/preview?${params.toString()}`
  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      <div style={{margin: '16px 8px'}}>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '8px 16px',
            background: '#0070f3',
            color: 'white',
            borderRadius: 4,
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          🔗 Ouvrir la preview dans un nouvel onglet
        </a>
      </div>
      <iframe
        key={doc._rev} // force le refresh après chaque sauvegarde
        src={url}
        style={{width: '100%', height: '100%', border: 'none'}}
        title="Preview"
        loading="lazy"
      />
    </div>
  )
}
