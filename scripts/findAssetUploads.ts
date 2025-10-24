import path from 'path'
import {promises as fs} from 'fs'
import {fileURLToPath} from 'url'

type ScanResult = {
  filePath: string
  matches: Array<{line: number; context: string}>
}

const DEFAULT_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
])

const DEFAULT_IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  '.turbo',
  '.next',
  'dist',
  'build',
  '.sanity',
])

const UPLOAD_PATTERNS = [/(?:client|sanityClient|previewClient|\w+)?\s*\.?\s*assets\s*\.\s*upload\s*\(/g]

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const rootFromArgs = process.argv[2]
const repoRoot = rootFromArgs
  ? path.resolve(process.cwd(), rootFromArgs)
  : path.resolve(__dirname, '..')

async function collectFiles(dir: string, results: string[]) {
  const entries = await fs.readdir(dir, {withFileTypes: true})

  for (const entry of entries) {
    if (entry.name.startsWith('.DS_Store')) continue
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      if (DEFAULT_IGNORED_DIRS.has(entry.name)) continue
      await collectFiles(fullPath, results)
      continue
    }

    const ext = path.extname(entry.name)
    if (!DEFAULT_EXTENSIONS.has(ext)) continue
    results.push(fullPath)
  }
}

function findMatches(content: string) {
  const matches: Array<{index: number; length: number}> = []

  for (const pattern of UPLOAD_PATTERNS) {
    pattern.lastIndex = 0
    let match: RegExpExecArray | null
    while ((match = pattern.exec(content))) {
      matches.push({index: match.index, length: match[0].length})
    }
  }

  return matches
}

function extractLineInfo(content: string, index: number) {
  const lines = content.split(/\r?\n/)
  let running = 0

  for (let i = 0; i < lines.length; i++) {
    const lineLength = lines[i].length + 1 // include newline
    if (running + lineLength > index) {
      const context = lines[i].trim()
      return {line: i + 1, context}
    }
    running += lineLength
  }

  return {line: lines.length, context: lines[lines.length - 1]?.trim() ?? ''}
}

async function scanFile(filePath: string): Promise<ScanResult | null> {
  const content = await fs.readFile(filePath, 'utf8')
  const matches = findMatches(content)
  if (!matches.length) return null

  return {
    filePath,
    matches: matches.map(({index}) => extractLineInfo(content, index)),
  }
}

async function main() {
  const files: string[] = []
  await collectFiles(repoRoot, files)

  const results: ScanResult[] = []

  for (const file of files) {
    const res = await scanFile(file)
    if (res) results.push(res)
  }

  if (!results.length) {
    console.log('Aucun appel à `assets.upload` trouvé.')
    return
  }

  console.log(`📦 Points d’upload détectés (${results.length} fichiers):`)
  console.log('')

  for (const result of results) {
    const relativePath = path.relative(repoRoot, result.filePath)
    console.log(`• ${relativePath}`)
    for (const match of result.matches) {
      console.log(`   ↳ ligne ${match.line}: ${match.context}`)
    }
    console.log('')
  }
}

main().catch((err) => {
  console.error('❌ Erreur lors du scan des uploads Sanity:', err)
  process.exit(1)
})
