import {BetaAnalyticsDataClient} from '@google-analytics/data'
import {createClient} from '@sanity/client'
import {config as tokensConfig} from 'dotenv'
import fs from 'fs'

const explicitEnvFile = process.env.READCOUNT_ENV_FILE
const envFiles = explicitEnvFile
  ? [explicitEnvFile]
  : ['.env.local', '.env.development', '.env.production']
envFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    tokensConfig({path: file, override: true})
  }
})

const REQUIRED_ENV = [
  'SANITY_PROJECT_ID',
  'SANITY_DATASET',
  'SANITY_API_VERSION',
  'SANITY_API_TOKEN',
  'GA4_PROPERTY_ID',
]

for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    throw new Error(`Missing env var: ${key}`)
  }
}

const DAYS = Number(process.env.GA4_DAYS || 30)
const LOCALE_FILTER = process.env.READCOUNT_LOCALE || ''
const RESET_MISSING = process.env.READCOUNT_RESET_MISSING === 'true'
const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID!

const DEFAULT_GA_KEY_FILE = 'schemaTypes/utils/credentials.json'
const gaKeyFile =
  process.env.GA4_KEY_FILE || (fs.existsSync(DEFAULT_GA_KEY_FILE) ? DEFAULT_GA_KEY_FILE : '')

const analyticsClient = new BetaAnalyticsDataClient(
  process.env.GA4_CREDENTIALS_JSON
    ? {credentials: JSON.parse(process.env.GA4_CREDENTIALS_JSON)}
    : gaKeyFile
      ? {keyFilename: gaKeyFile}
      : {},
)

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: process.env.SANITY_API_VERSION!,
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

const LOCALE_RE = /^[a-z]{2}[-_][a-z]{2}$/i

const toSegment = (locale: string) => (locale || 'fr-FR').toLowerCase().replace(/_/g, '-')
const isDefault = (locale: string) => toSegment(locale) === 'fr-fr'

const normalizePath = (value: string) => {
  const raw = `${value || ''}`.trim()
  const clean = raw.split('?')[0]?.split('#')[0] || ''
  const withSlash = clean.startsWith('/') ? clean : `/${clean}`
  return withSlash.replace(/\/{2,}/g, '/').replace(/\/$/, '') || '/'
}

const buildPath = (locale: string, slug: string) => {
  const safeSlug = `${slug || ''}`.trim().replace(/^\/+/, '').replace(/\/+$/, '')
  const base = safeSlug ? `/${safeSlug}` : '/'
  if (!LOCALE_RE.test(locale || '')) return base
  if (isDefault(locale)) return base
  return normalizePath(`/${toSegment(locale)}${base}`)
}

async function fetchPages() {
  const query = `*[_type == "page" && defined(slug.current)${
    LOCALE_FILTER ? ' && locale == $locale' : ''
  }]{
    _id,
    "slug": slug.current,
    locale
  }`
  return client.fetch(query, LOCALE_FILTER ? {locale: LOCALE_FILTER} : {})
}

async function fetchPageViews() {
  const [report] = await analyticsClient.runReport({
    property: `properties/${GA4_PROPERTY_ID}`,
    dateRanges: [{startDate: `${DAYS}daysAgo`, endDate: 'yesterday'}],
    dimensions: [{name: 'pagePath'}],
    metrics: [{name: 'screenPageViews'}],
    limit: 100000,
  })

  const rows = report.rows || []
  const views = new Map<string, number>()

  for (const row of rows) {
    const path = row.dimensionValues?.[0]?.value || ''
    const count = Number(row.metricValues?.[0]?.value || 0)
    if (!path) continue
    views.set(normalizePath(path), count)
  }

  return views
}

async function updateReadCount() {
  const [pages, views] = await Promise.all([fetchPages(), fetchPageViews()])
  const pathToId = new Map<string, string>()
  const sanityPaths: string[] = []

  pages.forEach((page: {_id: string; slug: string; locale: string}) => {
    const path = buildPath(page.locale, page.slug)
    pathToId.set(path, page._id)
    sanityPaths.push(path)
  })

  const updates = []
  for (const [path, count] of views.entries()) {
    const id = pathToId.get(normalizePath(path))
    if (!id) continue
    updates.push({id, count})
  }

  if (RESET_MISSING) {
    const viewPaths = new Set(views.keys())
    for (const [path, id] of pathToId.entries()) {
      if (!viewPaths.has(path)) {
        updates.push({id, count: 0})
      }
    }
  }

  if (!updates.length) {
    console.log('Aucun document à mettre à jour.')
    console.log(`Pages Sanity: ${pages.length}`)
    console.log(`Paths GA4: ${views.size}`)
    console.log('Exemples paths GA4:', Array.from(views.keys()).slice(0, 10))
    console.log('Exemples paths Sanity:', sanityPaths.slice(0, 10))
    return
  }

  console.log(`Pages Sanity: ${pages.length}`)
  console.log(`Paths GA4: ${views.size}`)
  console.log(`Updates à appliquer: ${updates.length}`)

  const batchSize = 100
  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize)
    let tx = client.transaction()
    batch.forEach((entry) => {
      tx = tx.patch(entry.id, {set: {readCount: entry.count}})
    })
    await tx.commit()
    console.log(`Mise à jour batch ${i + 1}-${i + batch.length}`)
  }
}

updateReadCount().catch((err) => {
  console.error('Erreur updateReadCount:', err.message)
  process.exit(1)
})
