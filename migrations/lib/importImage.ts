import {createClient} from '@sanity/client'
import axios from 'axios'
import {normalizeAssetFilename} from './normalizeAssetFilename'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: process.env.SANITY_API_VERSION!,
  useCdn: false,
})

export async function importImage(url: string): Promise<string> {
  const response = await axios.get(url, {responseType: 'arraybuffer'})

  const buffer = Buffer.from(response.data)
  const asset = await client.assets.upload('image', buffer, {
    filename: normalizeAssetFilename({url}),
  })

  return asset._id
}
