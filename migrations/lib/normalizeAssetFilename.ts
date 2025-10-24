function stripDiacritics(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function slugify(value: string) {
  const stripped = stripDiacritics(value)
  const slug = stripped.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  return slug.toLowerCase()
}

function ensureExtension(rawExt?: string, fallback = '.jpg') {
  if (!rawExt) return fallback
  const ext = rawExt.startsWith('.') ? rawExt : `.${rawExt}`
  if (/^\.[a-z0-9]+$/i.test(ext)) {
    return ext.toLowerCase()
  }
  return fallback
}

function extractNameAndExt(input?: string) {
  if (!input) return {name: '', ext: ''}
  const sanitized = input.split(/[?#]/)[0]
  const lastSeparator = Math.max(sanitized.lastIndexOf('/'), sanitized.lastIndexOf('\\'))
  const base = lastSeparator >= 0 ? sanitized.slice(lastSeparator + 1) : sanitized
  if (!base) return {name: '', ext: ''}

  const lastDot = base.lastIndexOf('.')
  if (lastDot > 0 && lastDot < base.length - 1) {
    return {
      name: base.slice(0, lastDot),
      ext: base.slice(lastDot),
    }
  }

  return {name: base, ext: ''}
}

type NormalizeParams = {
  url?: string
  originalName?: string
  prefix?: string
  defaultName?: string
  defaultExtension?: string
}

export function normalizeAssetFilename({
  url,
  originalName,
  prefix,
  defaultName = 'image',
  defaultExtension = '.jpg',
}: NormalizeParams) {
  const candidates: string[] = []

  if (originalName) {
    candidates.push(originalName)
  }

  if (url) {
    try {
      const parsedUrl = new URL(url)
      const pathname = parsedUrl.pathname
      if (pathname) {
        const segments = pathname.split('/')
        const lastSegment = segments[segments.length - 1]
        candidates.push(lastSegment || pathname)
      }
    } catch {
      candidates.push(url)
    }
  }

  const {name, ext} = extractNameAndExt(candidates.find(Boolean))
  const base = name || defaultName
  const slug = slugify(base) || slugify(defaultName)
  const extension = ensureExtension(ext || defaultExtension)
  const prefixSlug = typeof prefix === 'string' && prefix.trim() ? slugify(prefix) : undefined
  const parts = [prefixSlug, slug].filter(Boolean)

  return `${parts.join('-')}${extension}`
}
