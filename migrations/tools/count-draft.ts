import {createClient} from '@sanity/client'
import 'dotenv/config'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: process.env.SANITY_API_VERSION!,
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false, // important
})

async function run() {
  const docs = await client.fetch(
    `*[_id in path("drafts.**") && _type == "page" && locale == "en-US"]{_id, title}`,
  )

  console.log(`📄 ${docs.length} draft(s) trouvé(s) :`)
  console.log(docs)
}

run()
