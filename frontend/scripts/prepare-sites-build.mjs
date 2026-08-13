import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const serverDirectory = resolve('dist/server')
const workerPath = resolve(serverDirectory, 'index.js')

const workerSource = `const worker = {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request)

    if (response.status !== 404 || request.method !== 'GET') {
      return response
    }

    const acceptsHtml = (request.headers.get('accept') || '').includes('text/html')
    if (!acceptsHtml) return response

    const fallbackUrl = new URL('/index.html', request.url)
    return env.ASSETS.fetch(new Request(fallbackUrl, request))
  },
}

export default worker
`

await mkdir(serverDirectory, { recursive: true })
await writeFile(workerPath, workerSource, 'utf8')
