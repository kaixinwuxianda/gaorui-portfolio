import { mkdir, readdir, rename, writeFile } from 'node:fs/promises'

const worker = `export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request)
    if (response.status !== 404) return response
    return env.ASSETS.fetch(new Request(new URL('/', request.url), request))
  },
}
`

const dist = new URL('../dist/', import.meta.url)
const publicDir = new URL('../dist/public/', import.meta.url)

await mkdir(publicDir, { recursive: true })
for (const entry of await readdir(dist)) {
  if (!['.openai', 'public', 'server'].includes(entry)) {
    await rename(new URL(entry, dist), new URL(entry, publicDir))
  }
}

await mkdir(new URL('../dist/server/', import.meta.url), { recursive: true })
await writeFile(new URL('../dist/server/index.js', import.meta.url), worker)
