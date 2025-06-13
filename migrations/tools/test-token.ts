// test-token.ts
import {createClient} from '@sanity/client'
import 'dotenv/config'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: process.env.SANITY_API_VERSION!,
  token: process.env.OLD_SANITY_API_TOKEN,
  useCdn: false,
})

const drafts = await client.fetch(`*[_id in path("drafts.**") && _type == "page"]{_id, title}`)
console.log(drafts)

// async function testWrite() {
//   try {
//     await client.create({
//       _type: 'test',
//       title: 'Hello world!',
//     })
//     console.log('✅ Token fonctionne : écriture OK')
//   } catch (err: any) {
//     console.error('❌ Token invalide ou permissions insuffisantes :', err.message)
//   }
// }

// testWrite()
