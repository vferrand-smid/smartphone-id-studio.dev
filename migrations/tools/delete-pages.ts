import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'uvnumxlz',
  dataset: 'dev',
  token: process.env.SANITY_API_TOKEN, // ou ton token admin
  apiVersion: '2023-10-10',
  useCdn: false,
})

async function deletePages() {
  const ids = await client.fetch(`*[_type == "page"]._id`)

  if (!ids.length) {
    console.log('✅ Aucun document à supprimer.')
    return
  }

  console.log(`🚨 Suppression de ${ids.length} pages...`)

  const tx = client.transaction()
  ids.forEach((id: string) => tx.delete(id))

  await tx.commit()
  console.log('✅ Suppression terminée.')
}

deletePages().catch((err) => {
  console.error('❌ Erreur :', err.message)
})
