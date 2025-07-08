import {createClient} from '@sanity/client'
import wpmlToSanityLocaleMap from './lib/localeMapping'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: process.env.SANITY_API_VERSION!,
  useCdn: false,
})

async function renameIdsWithLocales() {
  const allLocales = Object.keys(wpmlToSanityLocaleMap)
  let total = 0

  for (const wpLocale of allLocales) {
    const sanityLocale = wpmlToSanityLocaleMap[wpLocale]
    const regex = new RegExp(`-${wpLocale}$`)
    const sanitySuffix = `-${sanityLocale}`

    const docs = await client.fetch(
      `*[_type == "page" && _id match "page-*-${wpLocale}"]{_id, _type, title, slug, locale, content, date, modified, status}`,
    )

    if (!docs.length) continue

    console.log(`🔁 ${docs.length} documents à renommer pour "${wpLocale}" → "${sanityLocale}"`)

    for (const doc of docs) {
      const newId = doc._id.replace(regex, sanitySuffix)

      if (doc._id === newId) {
        console.log(`⏭️ ID déjà correct, on ignore : ${doc._id}`)
        continue
      }

      console.log(`➡️ Renommage : ${doc._id} → ${newId}`)

      try {
        await client.createOrReplace({
          ...doc,
          _id: newId,
          locale: sanityLocale, // on met aussi à jour le champ `locale`
        })

        await client.delete(doc._id)

        console.log(`✅ OK`)
        total++
      } catch (err: any) {
        console.error(`❌ Erreur pour ${doc._id}:`, err.message || err)
      }
    }
  }

  console.log(`🎉 Terminé : ${total} documents renommés.`)
}

renameIdsWithLocales().catch((err) => {
  console.error('❌ Erreur générale:', err)
  process.exit(1)
})
