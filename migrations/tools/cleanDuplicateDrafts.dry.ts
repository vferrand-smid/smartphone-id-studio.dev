import {createClient} from '@sanity/client'
import 'dotenv/config'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: '2023-05-03',
  useCdn: false,
})

async function run() {
  const drafts = await client.fetch(
    `*[
      _id in path("drafts.**")
      && _type == "page"
      && defined(slug.current)
    ]{_id, slug}`,
  )

  let count = 0
  console.log(`🔍 Analyse de ${drafts.length} draft(s)...`)

  for (const draft of drafts) {
    const publishedId = draft._id.replace('drafts.', '')

    const exists = await client.fetch(
      `count(*[_id == $id || (slug.current == $slug && !(_id in path("drafts.**")))])`,
      {
        id: publishedId,
        slug: draft.slug.current,
      },
    )

    if (exists > 0) {
      console.log(
        `🗑️ [DRY RUN] Ce draft serait supprimé : ${draft._id} (slug: ${draft.slug.current})`,
      )
      count++
    } else {
      console.log(
        `✅ [KEEP] Aucun doublon publié trouvé pour : ${draft._id} (slug: ${draft.slug.current})`,
      )
    }
  }

  console.log(`✅ DRY RUN terminé. ${count} draft(s) seraient supprimé(s).`)
}

run().catch((err) => {
  console.error('❌ Erreur :', err)
  process.exit(1)
})
