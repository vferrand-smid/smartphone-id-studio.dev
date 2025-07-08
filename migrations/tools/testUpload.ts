import {createClient} from '@sanity/client'
import axios from 'axios'

const sanityClient = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET,
  apiVersion: process.env.SANITY_STUDIO_API_VERSION,
  useCdn: false,
})

async function testUpload() {
  const url =
    'https://www.smartphone-id.com/wp-content/uploads/2024/10/zdjecie-spelniajace-standardy-icao-1024x325.png'
  const response = await axios.get(url, {responseType: 'arraybuffer'})
  const buffer = Buffer.from(response.data)

  const asset = await sanityClient.assets.upload('image', buffer, {
    filename: url.split('/').pop(),
  })

  console.log('✅ Image uploadée →', asset._id)

  const exists = await sanityClient.fetch(`*[_id == $id][0]._id`, {
    id: asset._id,
  })

  console.log('🔍 Asset accessible ? →', exists)
}

testUpload()
