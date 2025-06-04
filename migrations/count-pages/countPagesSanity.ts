import {createClient} from '@sanity/client'

// 👉 Récupère la locale passée en argument (ex: fr-FR)
const LOCALE_TO_COUNT = process.argv[2]

if (!LOCALE_TO_COUNT) {
  console.error('❌ Merci de préciser une locale ! Exemple : npm run count-pages fr-FR')
  process.exit(1)
}

// 👉 Configure ton client Sanity
const client = createClient({
  projectId: 'uvnumxlz', // 🔁 remplace par le tien
  dataset: 'dev', // 🔁 ou 'production' selon l'env
  apiVersion: '2024-06-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // 🔐 facultatif mais utile si dataset privé
})

async function countPages(locale: string) {
  const query = `count(*[_type == "page" && locale == $locale])`
  const count = await client.fetch(query, {locale})

  console.log(`📄 Nombre de pages pour la locale "${locale}" : ${count}`)
}

countPages(LOCALE_TO_COUNT)
  .then(() => console.log('✅ Comptage terminé.'))
  .catch((err) => console.error('❌ Erreur pendant le comptage :', err))
