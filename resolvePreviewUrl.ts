export function resolvePreviewUrl(doc: any) {
  const slug = doc?.slug?.current || null
  const locale = typeof doc?.locale === 'string' ? doc.locale.toLowerCase() : null
  const secret = process.env.SANITY_PREVIEW_SECRET || '123456789abcdef'
  const PreviewUrl = process.env.SANITY_PREVIEW_URL

  if (!slug || !locale || !secret) {
    console.warn('[resolvePreviewUrl] Page non prête pour la preview')
    return 'about:blank'
  }

  const url = `${PreviewUrl}/api/draft-mode/enable?secret=${secret}&slug=${slug}&locale=${locale}`
  console.log('[Preview URL ✅]', url)
  return url
}
