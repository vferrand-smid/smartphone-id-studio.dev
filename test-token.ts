// test-token.ts
import {createClient} from '@sanity/client'
import 'dotenv/config'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: process.env.SANITY_API_VERSION!,
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

async function run() {
  const total = await client.fetch<number>('count(*)')
  console.log(`📦 Total de documents dans le dataset : ${total}\n`)

  const types = await client.fetch<string[]>(`array::unique(*[]._type)`)
  console.log(`🔍 Types détectés (${types.length}) :`)
  console.log(types.map((t) => ` - ${t}`).join('\n'))

  console.log('\n📊 Répartition par type :')

  for (const type of types) {
    const count = await client.fetch<number>('count(*[_type == $type])', {type})
    console.log(` - ${type} : ${count}`)
  }

  console.log('\n✅ Analyse terminée.')
}

run().catch((err) => {
  console.error('❌ Erreur :', err.message)
})
