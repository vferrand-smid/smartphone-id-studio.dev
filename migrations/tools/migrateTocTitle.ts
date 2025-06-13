import {createClient} from '@sanity/client'
import 'dotenv/config'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: process.env.SANITY_API_VERSION,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const TOC_TITLES: Record<string, string> = {
  'ar-SA': 'قائمة المحتويات',
  'ar-AE': 'قائمة المحتويات',
  'de-DE': 'Inhaltsverzeichnis',
  'en-AU': 'Table of contents',
  'en-CA': 'Table of contents',
  'en-GB': 'Table of contents',
  'en-IE': 'Table of contents',
  'en-US': 'Table of contents',
  'es-AR': 'Tabla de contenidos',
  'es-CO': 'Tabla de contenidos',
  'es-ES': 'Tabla de contenidos',
  'es-MX': 'Tabla de contenidos',
  'fr-FR': 'Table des matières',
  'fr-BE': 'Table des matières',
  'fr-CA': 'Table des matières',
  'fr-CH': 'Table des matières',
  'it-IT': 'Indice',
  'pt-PT': 'Índice',
  'sv-SE': 'Innehållsförteckning',
}

async function run() {
  const locale = 'sv-SE'

  const docs = await client.fetch(
    `*[_type == "page" && locale == $locale && content[0].customStyle == "toc-title" && content[0].children[0].text == "Table des matières"]{_id, content, locale}`,
    {locale},
  )

  console.log(`📝 ${docs.length} documents à mettre à jour pour ${locale}`)

  for (const doc of docs) {
    const translatedTitle = TOC_TITLES[doc.locale] || 'Table of contents'

    doc.content[0].children[0].text = translatedTitle

    await client.patch(doc._id).set({content: doc.content}).commit()

    console.log(`✅ Mis à jour : ${doc._id} (${doc.locale}) → ${translatedTitle}`)
  }
}

run().catch((err) => {
  console.error('❌ Erreur dans la migration TOC :', err)
  process.exit(1)
})
