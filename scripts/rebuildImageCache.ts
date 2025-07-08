import {createClient} from '@sanity/client'
import fs from 'fs/promises'
import fetch from 'node-fetch'
import path from 'path'
import {fileURLToPath} from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const projectId = process.env.SANITY_PROJECT_ID // Ton nouveau projet
const dataset = process.env.SANITY_STUDIO_DATASET
const token = process.env.SANITY_API_TOKEN // définit dans ton .env

const imageUrls = [
  'https://www.smartphone-id.com/wp-content/uploads/2024/10/visa-resident-temporaire-2025-1024x569.png',
  'https://www.smartphone-id.com/wp-content/uploads/2024/10/photo-identite-en-ligne-Canada-1024x569.png',
  'https://www.smartphone-id.com/wp-content/uploads/2024/10/permis-de-conduire-canadien-1024x569.png',
  'https://www.smartphone-id.com/wp-content/uploads/2024/10/passeport-Canada-1024x569.png',
  'https://www.smartphone-id.com/wp-content/uploads/2024/10/carte-de-resident-permanent-Canada-1024x569.png',
  'https://www.smartphone-id.com/wp-content/uploads/2024/10/photo-identite-exigences-1024x569.png',
  'https://www.smartphone-id.com/wp-content/uploads/2024/10/Photo-carte-de-residence-permanent-Canada-1024x569.png',
  'https://www.smartphone-id.com/wp-content/uploads/2024/10/photo-didentite-du-passeport-canadien-1024x569.png',
  'https://www.smartphone-id.com/wp-content/uploads/2024/10/photo-visa-Canada-1-1024x569.png',
  'https://www.smartphone-id.com/wp-content/uploads/2024/10/photo-permis-de-conduire-Canada-1024x569.png',
  'https://www.smartphone-id.com/wp-content/uploads/2024/10/photo-didentite-pour-bebe-canada-2025-1024x569.png',
  'https://www.smartphone-id.com/wp-content/uploads/2024/10/carte-photo-d-lOtario-Canada-2025-1024x569.png',
  'https://www.smartphone-id.com/wp-content/uploads/2024/10/photo-en-ligne-smartphone-id-1024x569.png',
  'https://www.smartphone-id.com/wp-content/uploads/2024/10/Quels-criteres-prendre-en-compte-1024x569.png',
  'https://www.smartphone-id.com/wp-content/uploads/2024/10/Dimensions-Photo-didentite-non-valide.png',
  'https://www.smartphone-id.com/wp-content/uploads/2024/10/photo-de-visa-bon-marche-Canada-1024x569.png',
  'https://www.smartphone-id.com/wp-content/uploads/2024/10/prix-foto-id-Canada-1-1024x569.png',
  'https://www.smartphone-id.com/wp-content/uploads/2024/11/photo-identite-bebe-accepte-refuse.png',
  'https://www.smartphone-id.com/wp-content/uploads/2024/10/prix-foto-id-Canada-1024x569.png',
  'https://www.smartphone-id.com/wp-content/uploads/2024/10/Qualite-de-la-photo-pas-bon.png',
  'https://www.smartphone-id.com/wp-content/uploads/2024/11/photo-bebe-eccepte-refuse.png',
  'https://www.smartphone-id.com/wp-content/uploads/2024/10/Eclairage-Photo-didentite-pas-bon.png',
  'https://www.smartphone-id.com/wp-content/uploads/2024/11/photo-identite-bebe-accepte-et-refuse.png',
  'https://www.smartphone-id.com/wp-content/uploads/2024/10/Position-Visage-Photo-didentite-pas-bon.png',
  'https://www.smartphone-id.com/wp-content/uploads/2024/10/Photo-dIdentite-en-ligne-100-reussie-2025-1024x569.png',
  'https://www.smartphone-id.com/wp-content/uploads/2024/10/Lunettes-Expression-Photo-didentite-pas-bon.png',
  'https://www.smartphone-id.com/wp-content/uploads/2024/10/photo-bebe-1024x569.png',
  'https://www.smartphone-id.com/wp-content/uploads/2024/11/Photo-identite-exception-religion-.png',
  'https://www.smartphone-id.com/wp-content/uploads/2024/10/Le-Fond-Photo-didentite-pas-bon.png',
  'https://www.smartphone-id.com/wp-content/uploads/2024/10/Enfant-de-moins-de-6-ans-Photo-didentite-.png',
  'https://www.smartphone-id.com/wp-content/uploads/2024/10/etapes-pour-prendre-une-photo-id-1024x569.png',
]

const imageCachePath = path.resolve(__dirname, 'imageCache.json')
const client = createClient({projectId, dataset, token, useCdn: false, apiVersion: '2024-06-01'})

const imageCache: Record<string, string> = {}

async function uploadAllImages() {
  for (const url of imageUrls) {
    try {
      console.log(`📤 Uploading: ${url}`)
      const res = await fetch(url)
      const buffer = await res.arrayBuffer()

      const asset = await client.assets.upload('image', Buffer.from(buffer), {
        filename: url.split('/').pop(),
      })

      imageCache[url] = asset._id
    } catch (err) {
      console.error(`❌ Failed to upload ${url}`, err)
    }
  }

  await fs.writeFile(imageCachePath, JSON.stringify(imageCache, null, 2))
  console.log(
    '✅ Nouveau fichier imageCache.json créé avec',
    Object.keys(imageCache).length,
    'images',
  )
}

uploadAllImages()
