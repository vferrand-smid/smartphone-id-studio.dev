import {createClient} from '@sanity/client'
import axios from 'axios'

const sanityClient = createClient({
  projectId: 'uvnumxlz',
  dataset: 'dev',
  apiVersion: '2024-06-17',
  token: process.env.SANITY_API_TOKEN,
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
