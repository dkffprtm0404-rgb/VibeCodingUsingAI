import { mkdir, readFile, rename, stat, writeFile } from 'node:fs/promises'
import { dirname, resolve, sep } from 'node:path'

const manifestPath = resolve(process.argv[2] ?? 'public/catalog/catalog-sources.json')
const targetDirectory = resolve('public/catalog')
const manifest = JSON.parse((await readFile(manifestPath, 'utf8')).replace(/^\uFEFF/, ''))
if (!Array.isArray(manifest)) throw new Error('Image manifest must be an array')
await mkdir(targetDirectory, { recursive: true })

let downloaded = 0
let reused = 0
const failures = []
let cursor = 0

async function worker() {
  while (cursor < manifest.length) {
    const item = manifest[cursor++]
    if (typeof item.file !== 'string' || !/^[a-z][a-z0-9-]*\.jpg$/.test(item.file)) throw new Error('Invalid catalog filename')
    const url = new URL(item.url)
    if (url.protocol !== 'https:' || url.hostname !== 'image.msscdn.net') throw new Error('Unexpected image source')
    const target = resolve(targetDirectory, item.file)
    if (!target.startsWith(targetDirectory + sep) || dirname(target) !== targetDirectory) throw new Error('Image path outside catalog')
    try {
      if ((await stat(target)).size > 1024) { reused++; continue }
    } catch { /* A missing image is downloaded below. */ }
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(30000) })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      if (!response.headers.get('content-type')?.startsWith('image/')) throw new Error('Not an image')
      const bytes = new Uint8Array(await response.arrayBuffer())
      if (bytes.length < 1024 || bytes.length > 10 * 1024 * 1024) throw new Error('Unexpected image size')
      await writeFile(target + '.tmp', bytes)
      await rename(target + '.tmp', target)
      downloaded++
    } catch (cause) {
      failures.push({ file: item.file, error: cause.message, cause: cause.cause?.code })
    }
  }
}
await Promise.all(Array.from({ length: 4 }, worker))
console.info(JSON.stringify({ downloaded, reused, failures }, null, 2))
if (failures.length) process.exitCode = 1
