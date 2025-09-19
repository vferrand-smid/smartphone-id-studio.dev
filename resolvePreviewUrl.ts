export function resolvePreviewUrl(doc: any) {
  const slug = doc?.slug?.current || null
  const secret = process.env.SANITY_PREVIEW_SECRET || '123456789abcdef'
  const previewUrl = process.env.SANITY_PREVIEW_URL
  const docType = doc?._type

  let locale: string | null = null
  let typeParam = 'blog'
  const extraParams: Record<string, string> = {}

  if (docType === 'legalPage') {
    locale = typeof doc?.pivotLanguage === 'string' ? doc.pivotLanguage.toLowerCase() : null
    typeParam = 'legal'
    if (typeof doc?.kind === 'string' && doc.kind) {
      extraParams.kind = doc.kind
    }
  } else {
    locale = typeof doc?.locale === 'string' ? doc.locale.toLowerCase() : null
  }

  if (!slug || !locale || !secret || !previewUrl) {
    console.warn('[resolvePreviewUrl] Page non prête pour la preview')
    return 'about:blank'
  }

  const params = new URLSearchParams({
    secret,
    slug,
    locale,
    type: typeParam,
  })

  for (const [key, value] of Object.entries(extraParams)) {
    params.set(key, value)
  }

  const url = `${previewUrl}/api/draft-mode/enable?${params.toString()}`
  console.log('[Preview URL ✅]', url)
  return url
}
