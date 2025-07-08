// scripts/checkMissingImages.ts
import {createClient} from '@sanity/client'
import 'dotenv/config'
import fs from 'fs/promises'

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET!,
  apiVersion: process.env.SANITY_STUDIO_API_VERSION!,
  useCdn: false,
})

async function main() {
  const path = './.sanityImageCache.json'
  const raw = await fs.readFile(path, 'utf8')
  const imageCache = new Map(Object.entries(JSON.parse(raw)))

  console.log(`🔍 Vérification de ${imageCache.size} images dans le cache…`)

  let missing = 0

  for (const [hash, _id] of imageCache.entries()) {
    const exists = await client.fetch(`count(*[_id == $id])`, {id: _id})

    if (exists === 0) {
      console.warn(`❌ Image absente de Sanity: ${_id} (hash: ${hash})`)
      missing++
    }
  }

  if (missing === 0) {
    console.log('✅ Aucune image manquante.')
  } else {
    console.warn(`🚨 ${missing} image(s) référencée(s) mais absente(s) du dataset.`)
  }
}

main().catch((err) => {
  console.error('Erreur :', err)
  process.exit(1)
})
