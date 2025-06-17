// scripts/cleanImageCache.ts
import {createClient} from '@sanity/client'
import 'dotenv/config'
import fs from 'fs/promises'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: process.env.SANITY_API_VERSION! || '2023-12-01',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

async function main() {
  const path = './.sanityImageCache.json'
  const raw = await fs.readFile(path, 'utf8')
  const imageCache = new Map(Object.entries(JSON.parse(raw)))

  console.log(`🧹 Nettoyage du cache (total initial : ${imageCache.size})…`)

  let removed = 0

  for (const [hash, _id] of imageCache.entries()) {
    const exists = await client.fetch(`count(*[_id == $id])`, {id: _id})

    if (exists === 0) {
      console.warn(`❌ Retiré du cache : ${_id}`)
      imageCache.delete(hash)
      removed++
    }
  }

  await fs.writeFile(path, JSON.stringify(Object.fromEntries(imageCache), null, 2), 'utf8')
  console.log(`✅ Cache mis à jour. ${removed} image(s) supprimée(s).`)
}

main().catch((err) => {
  console.error('Erreur :', err)
  process.exit(1)
})
