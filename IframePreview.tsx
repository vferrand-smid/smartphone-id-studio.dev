export default function IframePreview(props: any) {
  const doc = props.document.displayed
  if (!doc?.slug?.current || !doc?.locale) {
    return <div style={{padding: 32}}>Pas de slug ou de locale…</div>
  }
  // const params = new URLSearchParams({
  //   locale: doc.locale,
  //   slug: doc.slug.current,
  //   type: doc._type,
  //   rev: doc._rev || '',
  // }).toString()
  //const url = `${process.env.PREVIEW_FRONT_URL}/api/preview?${params}`
  const previewFrontUrl = process.env.SANITY_STUDIO_PREVIEW_URL
  console.log('SANITY_STUDIO_PREVIEW_URL :', previewFrontUrl)
  const url = `${previewFrontUrl}/api/preview?locale=${doc.locale}&type=blog&slug=${doc.slug.current}`
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
