// test-token.ts
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: '1t78evbt',
  dataset: 'test',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-10-10',
  useCdn: false,
})

async function testWrite() {
  try {
    await client.create({
      _type: 'test',
      title: 'Hello world!',
    })
    console.log('✅ Token fonctionne : écriture OK')
  } catch (err: any) {
    console.error('❌ Token invalide ou permissions insuffisantes :', err.message)
  }
}

testWrite()
