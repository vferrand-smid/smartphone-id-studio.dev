import {createClient} from '@sanity/client'
import axios from 'axios'
import crypto from 'crypto'
import fs from 'fs/promises'
import {decode} from 'html-entities'
import {HTMLElement, parse} from 'node-html-parser'
import pLimit from 'p-limit'

const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: process.env.SANITY_API_VERSION!,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

function hashBuffer(buffer: Buffer): string {
  return crypto.createHash('sha1').update(buffer).digest('hex')
}

const imageCachePath = './.sanityImageCache.json'
const limit = pLimit(1)
let imageCache: Map<string, string> = new Map()

export async function loadImageCache() {
  try {
    const data = await fs.readFile(imageCachePath, 'utf8')
    imageCache = new Map(Object.entries(JSON.parse(data)))
  } catch {
    imageCache = new Map()
  }
}

export async function saveImageCache() {
  await fs.writeFile(imageCachePath, JSON.stringify(Object.fromEntries(imageCache)), 'utf8')
}

async function uploadImageToSanity(url: string) {
  return limit(async () => {
    try {
      const response = await axios.get(url, {responseType: 'arraybuffer'})
      const buffer = Buffer.from(response.data)
      const hash = hashBuffer(buffer)

      if (imageCache.has(hash)) {
        return {
          _type: 'image',
          asset: {_type: 'reference', _ref: imageCache.get(hash)!},
        }
      }

      // Lenteur volontaire seulement pour test réseau ou API
      // await new Promise((r) => setTimeout(r, 15000))

      const asset = await sanityClient.assets.upload('image', buffer, {
        filename: url.split('/').pop(),
      })

      imageCache.set(hash, asset._id)
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

function parseSpansRich(node: HTMLElement): any[] {
  const spans: any[] = []

  node.childNodes.forEach((child) => {
    if (child.nodeType === 3) {
      const text = decode(child.rawText || '').trim()
      if (text) spans.push({_type: 'span', text, marks: []})
      return
    }

    if (child instanceof HTMLElement) {
      const raw = decode(child.innerText || '').trim()
      if (!raw) return

      const marks: string[] = []
      if (child.tagName === 'STRONG') marks.push('strong')
      if (child.tagName === 'EM') marks.push('em')
      if (child.tagName === 'A') {
        const href = child.getAttribute('href') || '#'
        const key = `link-${href}`
        marks.push(key)
      }

      spans.push({_type: 'span', text: raw, marks})
    }
  })

  return spans
}

export async function htmlToPortableText(html: string) {
  if (!html) return []

  const root = parse(html)
  const blocks: any[] = []

  // TOC depuis les H2/H3 (hors FAQ)
  const tocBlocks: any[] = []
  const headings = root.querySelectorAll('h2, h3')

  let inFAQ = false
  let index = 1

  for (const heading of headings) {
    const text = decode(heading.textContent || '').trim()

    // Marque d’entrée dans la FAQ
    if (heading.tagName === 'H2' && /faq/i.test(text)) {
      inFAQ = true
      continue
    }

    if (inFAQ) continue

    const slug = heading.getAttribute('id') || text.toLowerCase().replace(/[^\w]+/g, '-')
    heading.setAttribute('id', slug)

    tocBlocks.push({
      _type: 'block',
      style: 'normal',
      children: [{_type: 'span', text: `${index}. ${text}`, marks: [`link-#${slug}`]}],

      markDefs: [
        {
          _type: 'link',
          _key: `link-#${slug}`,
          href: `#${slug}`,
        },
      ],
    })
    index++
  }

  if (tocBlocks.length > 0) {
    blocks.unshift(
      {
        _type: 'block',
        style: 'h2',
        children: [
          {
            _type: 'span',
            text: 'Table des matières',
            marks: [],
          },
        ],
        customStyle: 'toc-title',
      },
      ...tocBlocks,
    )
  }

  // 🎯 CONTENU PRINCIPAL
  for (const node of root.childNodes) {
    if (!(node instanceof HTMLElement)) continue

    switch (node.tagName) {
      case 'P':
      case 'DIV': {
        const children = parseSpansRich(node)
        if (children.length > 0) {
          blocks.push({_type: 'block', style: 'normal', children})
        }
        break
      }

      case 'H1':
      case 'H2':
      case 'H3':
      case 'H4':
      case 'H5':
      case 'H6': {
        const children = parseSpansRich(node)
        if (children.length > 0) {
          blocks.push({_type: 'block', style: node.tagName.toLowerCase(), children})
        }
        break
      }

      case 'UL':
      case 'OL': {
        const isOrdered = node.tagName === 'OL'
        node.querySelectorAll(':scope > li').forEach((li) => {
          const link = li.querySelector('a')
          const text = decode(link?.textContent || li.textContent || '').trim()
          const href = link?.getAttribute('href')
          const markKey = href ? `link-${href}` : undefined

          const block: any = {
            _type: 'block',
            style: 'normal',
            listItem: isOrdered ? 'number' : 'bullet',
            children: [{_type: 'span', text, marks: href ? [markKey] : []}],
            markDefs: href ? [{_type: 'link', _key: markKey, href}] : [],
          }

          blocks.push(block)
        })
        break
      }

      case 'FIGURE': {
        const table = node.querySelector('table')
        if (table) {
          const rows: any[] = []

          const headerRows = table.querySelectorAll('thead tr')
          const bodyRows = table.querySelectorAll('tbody tr')

          for (const row of headerRows) {
            const cells = row.querySelectorAll('th').map((cell) => decode(cell.text.trim()))
            rows.push({_type: 'tableRow', cells, isHeader: true})
          }

          for (const row of bodyRows) {
            const cells = row.querySelectorAll('td').map((cell) => decode(cell.text.trim()))
            rows.push({_type: 'tableRow', cells})
          }

          blocks.push({_type: 'table', rows})
          break
        }

        const img = node.querySelector('img')
        const caption = decode(node.querySelector('figcaption')?.textContent || '').trim()
        if (img) {
          const src = img.getAttribute('src')
          if (src) {
            const imageBlock = await uploadImageToSanity(src)
            if (imageBlock) blocks.push({...imageBlock, caption})
          }
        }

        break
      }

      case 'IMG': {
        const src = node.getAttribute('src')
        if (src) {
          const imageBlock = await uploadImageToSanity(src)
          if (imageBlock) blocks.push(imageBlock)
        }
        break
      }

      case 'IFRAME': {
        const src = node.getAttribute('src')
        if (src) blocks.push({_type: 'videoEmbed', url: src})
        break
      }

      case 'TABLE': {
        const rows: any[] = []
        const headerRows = node.querySelectorAll('thead tr')
        const bodyRows = node.querySelectorAll('tbody tr')

        for (const row of [...headerRows, ...bodyRows]) {
          const isHeader = row.parentNode?.tagName === 'THEAD'
          const cells = row
            .querySelectorAll(isHeader ? 'th' : 'td')
            .map((cell) => decode(cell.text.trim()))

          rows.push({_type: 'tableRow', cells, isHeader})
        }

        blocks.push({_type: 'table', rows})
        break
      }
    }
  }

  return blocks
}
