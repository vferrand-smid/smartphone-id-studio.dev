import {createClient} from '@sanity/client'
import axios from 'axios'

const client = createClient({
  projectId: '1t78evbt', // ← remplace par ton vrai projectId
  dataset: 'test', // ← ou 'production' si besoin
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2023-03-25',
})

export async function importImage(url: string): Promise<string> {
  const response = await axios.get(url, {responseType: 'arraybuffer'})

  const asset = await client.assets.upload('image', response.data, {
    filename: url.split('/').pop(),
  })

  return asset._id
}
