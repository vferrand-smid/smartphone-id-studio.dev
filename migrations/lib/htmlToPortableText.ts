import {createClient} from '@sanity/client'
import axios from 'axios'
import fs from 'fs/promises'
import {decode} from 'html-entities'
import {HTMLElement, parse} from 'node-html-parser'
import pLimit from 'p-limit'

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const sanityClient = createClient({
  projectId: 'uvnumxlz',
  dataset: 'dev',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2023-03-25',
})

const imageCachePath = './.sanityImageCache.json'
const limit = pLimit(1)
let imageCache: Map<string, string> = new Map()

async function loadImageCache() {
  try {
    const data = await fs.readFile(imageCachePath, 'utf8')
    imageCache = new Map(Object.entries(JSON.parse(data)))
  } catch {
    imageCache = new Map()
  }
}

async function saveImageCache() {
  await fs.writeFile(imageCachePath, JSON.stringify(Object.fromEntries(imageCache)), 'utf8')
}

async function uploadImageToSanity(url: string) {
  return limit(async () => {
    if (imageCache.has(url)) {
      return {
        _type: 'image',
        asset: {_type: 'reference', _ref: imageCache.get(url)!},
      }
    }

    try {
      await wait(15000)
      const response = await axios.get(url, {responseType: 'arraybuffer'})
      const asset = await sanityClient.assets.upload('image', response.data, {
        filename: url.split('/').pop(),
      })

      imageCache.set(url, asset._id)

      return {
        _type: 'image',
        asset: {_type: 'reference', _ref: asset._id},
      }
    } catch (err) {
      console.warn(`❌ Image non importée depuis ${url}: ${err}`)
      return null
    }
  })
}

export async function htmlToPortableText(html: string) {
  if (!html) return []

  const root = parse(html)
  const blocks: any[] = []

  for (const node of root.childNodes) {
    if (!(node instanceof HTMLElement)) continue

    switch (node.tagName) {
      case 'P':
        blocks.push({
          _type: 'block',
          style: 'normal',
          children: parseSpans(node),
        })
        break

      case 'H2':
      case 'H3':
        blocks.push({
          _type: 'block',
          style: node.tagName.toLowerCase(),
          children: parseSpans(node),
        })
        break

      case 'FIGURE':
      case 'IMG': {
        const imgNode = node.querySelector('img') || node
        const src = imgNode.getAttribute('src')
        if (src) {
          const imageBlock = await uploadImageToSanity(src)
          if (imageBlock) blocks.push(imageBlock)
        }
        break
      }

      case 'UL':
      case 'OL': {
        const isOrdered = node.tagName === 'OL'
        const items = node.querySelectorAll('li')
        for (const li of items) {
          const link = li.querySelector('a')
          const text = decode(link?.innerText || li.innerText)
          const href = link?.getAttribute('href')

          const markKey = href ? `link-${href}` : undefined

          if (href) {
            blocks.push({
              _type: 'block',
              style: 'normal',
              listItem: isOrdered ? 'number' : 'bullet',
              markDefs: [
                {
                  _type: 'link',
                  _key: markKey,
                  href,
                },
              ],
              children: [
                {
                  _type: 'span',
                  text,
                  marks: [markKey],
                },
              ],
            })
          } else {
            blocks.push({
              _type: 'block',
              style: 'normal',
              listItem: isOrdered ? 'number' : 'bullet',
              children: [{_type: 'span', text, marks: []}],
            })
          }
        }
      }

      case 'IFRAME': {
        const src = node.getAttribute('src')
        if (src) {
          blocks.push({
            _type: 'videoEmbed',
            url: src,
          })
        }
        break
      }
    }
  }

  return blocks
}

function parseSpans(node: HTMLElement) {
  const spans: any[] = []
  node.childNodes.forEach((child) => {
    if (child instanceof HTMLElement && child.tagName === 'A') {
      const href = child.getAttribute('href') || '#'
      spans.push({
        _type: 'span',
        text: decode(child.text || ''),
        marks: [`link-${href}`],
      })
    } else {
      spans.push({
        _type: 'span',
        text: decode((child.text || '').trim()),
        marks: [],
      })
    }
  })
  return spans
}
export {loadImageCache, saveImageCache}
