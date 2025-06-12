import {createClient} from '@sanity/client'

const TARGET_LOCALE = 'ar-SA'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: process.env.SANITY_API_VERSION!,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

async function deletePages() {
  const ids = await client.fetch(`*[_type == "page" && locale == $locale]._id`, {
    locale: TARGET_LOCALE,
  })

  if (!ids.length) {
    console.log(`✅ Aucune page à supprimer pour la locale "${TARGET_LOCALE}".`)
    return
  }

  const allIds = ids.flatMap((id: string) => [id, `drafts.${id}`])

  console.log(
    `🚨 Suppression de ${allIds.length} documents (avec drafts) pour la locale "${TARGET_LOCALE}"...`,
  )

  const tx = client.transaction()
  allIds.forEach((id: string) => tx.delete(id))

  await tx.commit()
  console.log('✅ Suppression terminée.')
}

deletePages().catch((err) => {
  console.error('❌ Erreur :', err.message)
})
