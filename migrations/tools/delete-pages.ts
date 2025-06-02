import {createClient} from '@sanity/client'

// IMPORTANT : même code que dans ton index.ts
const TARGET_LOCALE = 'fr-CA'

const client = createClient({
  projectId: 'uvnumxlz',
  dataset: 'dev',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2023-10-10',
})

async function deletePages() {
  const ids = await client.fetch(`*[_type == "page" && locale == $locale]._id`, {
    locale: TARGET_LOCALE,
  })

  if (!ids.length) {
    console.log(`✅ Aucune page à supprimer pour la locale "${TARGET_LOCALE}".`)
    return
  }

  console.log(`🚨 Suppression de ${ids.length} pages pour la locale "${TARGET_LOCALE}"...`)

  const tx = client.transaction()
  ids.forEach((id: string) => tx.delete(id))

  await tx.commit()
  console.log('✅ Suppression terminée.')
}

deletePages().catch((err) => {
  console.error('❌ Erreur :', err.message)
})
