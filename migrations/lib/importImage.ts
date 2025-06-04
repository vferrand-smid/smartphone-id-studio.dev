import {createClient} from '@sanity/client'
import axios from 'axios'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: process.env.SANITY_API_VERSION!,

  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

export async function importImage(url: string): Promise<string> {
  const response = await axios.get(url, {responseType: 'arraybuffer'})

  const asset = await client.assets.upload('image', response.data, {
    filename: url.split('/').pop(),
  })

  return asset._id
}
