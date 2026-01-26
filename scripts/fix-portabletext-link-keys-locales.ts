import {createClient} from '@sanity/client'
import 'dotenv/config'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: process.env.SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

/**
 * ✅ À ADAPTER
 */
const DOC_TYPE = 'page'
const FIELD = 'content'

const DRY_RUN = process.env.DRY_RUN !== 'false'

// --- locale normalization: xx_YY -> xx-yy
const LOCALE_UNDERSCORE_RE = /\b([a-z]{2})_([A-Z]{2})\b/g
const normalizeWpLocale = (s: string) =>
  s.replace(LOCALE_UNDERSCORE_RE, (_, lang: string, region: string) =>
    `${lang}-${region}`.toLowerCase(),
  )

function isObject(v: any) {
  return v && typeof v === 'object' && !Array.isArray(v)
}

function patchPortableText(value: any) {
  let changed = false

  function walk(node: any) {
    if (Array.isArray(node)) {
      for (let i = 0; i < node.length; i++) {
        const before = node[i]
        const after = walk(before)
        if (after !== before) {
          node[i] = after
          changed = true
        }
      }
      return node
    }

    if (!isObject(node)) return node

    // Portable Text block case
    if (Array.isArray(node.markDefs)) {
      const keyMap = new Map()

      for (const def of node.markDefs) {
        if (!def) continue

        // ✅ Normalize markDef _key (this is what pollutes source)
        if (typeof def._key === 'string') {
          const newKey = normalizeWpLocale(def._key)
          if (newKey !== def._key) {
            keyMap.set(def._key, newKey)
            def._key = newKey
            changed = true
          }
        }

        // Optional cleanup: trim href + normalize wp locale inside href too
        if (typeof def.href === 'string') {
          const trimmed = def.href.trim()
          let next = trimmed
          // If you also want to normalize hrefs that still contain xx_YY:
          next = normalizeWpLocale(next)
          if (next !== def.href) {
            def.href = next
            changed = true
          }
        }
      }

      // Update children marks that reference old keys
      if ((keyMap.size || true) && Array.isArray(node.children)) {
        for (const child of node.children) {
          if (!child || !Array.isArray(child.marks)) continue
          for (let i = 0; i < child.marks.length; i++) {
            const m = child.marks[i]
            if (typeof m !== 'string') continue

            if (keyMap.has(m)) {
              child.marks[i] = keyMap.get(m)
              changed = true
            } else {
              const nm = normalizeWpLocale(m)
              if (nm !== m) {
                child.marks[i] = nm
                changed = true
              }
            }
          }
        }
      }
    }

    // Generic recursion
    for (const k of Object.keys(node)) {
      node[k] = walk(node[k])
    }

    return node
  }

  const cloned = structuredClone(value)
  walk(cloned)

  return {patched: cloned, changed}
}

async function main() {
  if (!process.env.SANITY_PROJECT_ID || !process.env.SANITY_DATASET || !process.env.SANITY_TOKEN) {
    throw new Error('Missing SANITY_PROJECT_ID / SANITY_DATASET / SANITY_TOKEN in env')
  }

  // ✅ More general query: any markDef._key containing "_XX" pattern
  const query = `*[_type == $type && ${FIELD}[].markDefs[]._key match "*_*"]{
    _id, _type, title, locale, pageUrl, "${FIELD}": ${FIELD}
  }`

  const docs = await client.fetch(query, {type: DOC_TYPE})
  console.log(`Found ${docs.length} candidate docs (markDef keys contain "_")`)

  let patchedCount = 0

  for (const doc of docs) {
    const {patched, changed} = patchPortableText(doc[FIELD])
    if (!changed) continue

    patchedCount++
    console.log(
      `\n- ${doc._id} | ${doc.title ?? '(no title)'} | ${doc.locale ?? ''} | ${doc.pageUrl ?? ''}`,
    )

    if (DRY_RUN) {
      console.log(`  DRY_RUN: would patch ${doc._id} ${FIELD}`)
    } else {
      await client.patch(doc._id, {
        set: {
          [FIELD]: patched,
        },
      })
    }
  }

  console.log(`✅ ${patchedCount} docs patched`)
}

main().catch(console.error)
