// ./src/lib/getLocales.ts
import {createClient} from 'next-sanity'

const client = createClient({
  projectId: 'uvnumxlz',
  dataset: 'dev',
  useCdn: false,
  apiVersion: '2024-06-01',
})

export async function getLocales() {
  const query = `array::unique(*[_type == "page" && defined(locale)].locale)`
  return await client.fetch(query)
}
