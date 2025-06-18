import axios from 'axios'
import fs from 'fs/promises'

const cachePath = './.sanityImageCache.json'

// 👇 optionnel : si tu veux lier les URL aux hash
// const imageUrlsByHash = {
//   'bd1adb...': 'https://...png',
// }

async function main() {
  const raw = await fs.readFile(cachePath, 'utf8')
  const cache = JSON.parse(raw)

  const cleanedCache: Record<string, string> = {}
  let removed = 0

  for (const [hash, ref] of Object.entries(cache)) {
    const imageId = (ref as string).replace(/^image-/, '').replace(/-.*$/, '')
    const guessedUrl = `https://www.smartphone-id.com/wp-content/uploads/${imageId.slice(0, 4)}/${imageId.slice(4)}.png`

    try {
      const res = await axios.head(guessedUrl, {timeout: 5000})
      if (res.status === 200) {
        cleanedCache[hash] = ref as string
      } else {
        console.warn(`⛔ ${guessedUrl} → status ${res.status}`)
        removed++
      }
    } catch {
      console.warn(`❌ Image inaccessible → ${guessedUrl}`)
      removed++
    }
  }

  await fs.writeFile(cachePath, JSON.stringify(cleanedCache, null, 2), 'utf8')
  console.log(`✅ Nettoyage terminé. Images supprimées du cache : ${removed}`)
}

main()
