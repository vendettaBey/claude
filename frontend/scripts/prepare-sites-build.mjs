import { mkdir, readdir, rename, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const outputDirectory = resolve('dist')
const clientDirectory = resolve(outputDirectory, 'client')
const serverDirectory = resolve('dist/server')
const workerPath = resolve(serverDirectory, 'index.js')
const wranglerPath = resolve(serverDirectory, 'wrangler.json')

await mkdir(clientDirectory, { recursive: true })

for (const entry of await readdir(outputDirectory)) {
  if (entry === 'client' || entry === 'server') continue
  await rename(resolve(outputDirectory, entry), resolve(clientDirectory, entry))
}

const workerSource = `const worker = {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname === '/api/v1/quote-requests' && request.method === 'POST') {
      return handleQuoteRequest(request, env)
    }

    if (url.pathname === '/api/v1/quote-requests') {
      return json({ success: false, message: 'Yönteme izin verilmiyor.' }, 405)
    }

    const assetRequest = url.pathname === '/'
      ? new Request(new URL('/index.html', request.url), request)
      : request
    const response = await env.ASSETS.fetch(assetRequest)

    if (response.status !== 404 || request.method !== 'GET') {
      return response
    }

    const acceptsHtml = (request.headers.get('accept') || '').includes('text/html')
    if (!acceptsHtml) return response

    const fallbackUrl = new URL('/index.html', request.url)
    return env.ASSETS.fetch(new Request(fallbackUrl, request))
  },
}

const quoteTableSql = \`CREATE TABLE IF NOT EXISTS quote_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  company_name TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service_type TEXT NOT NULL,
  budget_range TEXT NOT NULL,
  preferred_contact_method TEXT NOT NULL,
  project_description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
)\`

const rateLimitTableSql = \`CREATE TABLE IF NOT EXISTS quote_request_rate_limits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  identifier_hash TEXT NOT NULL,
  created_at TEXT NOT NULL
)\`

const json = (body, status = 200) => Response.json(body, { status })
const cleanText = (value) => typeof value === 'string' ? value.trim() : ''

async function hashIdentifier(value) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('')
}

async function handleQuoteRequest(request, env) {
  try {
    const raw = await request.json()
    const values = {
      project_description: cleanText(raw.project_description),
      full_name: cleanText(raw.full_name),
      company_name: cleanText(raw.company_name),
      email: cleanText(raw.email),
      phone: cleanText(raw.phone),
      service_type: cleanText(raw.service_type),
      budget_range: cleanText(raw.budget_range),
      preferred_contact_method: cleanText(raw.preferred_contact_method),
      website: cleanText(raw.website),
    }

    const emailIsValid = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(values.email)
    const phoneIsValid = /^[+()\\d\\s.-]{10,20}$/.test(values.phone)
    const invalid = values.website || values.project_description.length < 20 ||
      values.project_description.length > 5000 || values.full_name.length < 2 ||
      values.full_name.length > 120 || values.company_name.length > 160 ||
      !emailIsValid || values.email.length > 180 || !phoneIsValid ||
      !values.service_type || !values.budget_range || !values.preferred_contact_method

    if (invalid) {
      return json({ success: false, message: 'Formdaki bazı alanları kontrol edin.' }, 422)
    }

    if (!env.DB) {
      return json({ success: false, message: 'Teklif servisi şu anda kullanılamıyor.' }, 503)
    }

    await env.DB.batch([
      env.DB.prepare(quoteTableSql),
      env.DB.prepare('CREATE INDEX IF NOT EXISTS quote_requests_created_at_idx ON quote_requests(created_at)'),
      env.DB.prepare(rateLimitTableSql),
      env.DB.prepare('CREATE INDEX IF NOT EXISTS quote_request_rate_limits_lookup_idx ON quote_request_rate_limits(identifier_hash, created_at)'),
    ])

    const now = new Date().toISOString()
    const windowStart = new Date(Date.now() - 15 * 60 * 1000).toISOString()
    const forwarded = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown'
    const identifierHash = await hashIdentifier(forwarded.split(',')[0].trim())
    const rate = await env.DB.prepare(
      'SELECT COUNT(*) AS count FROM quote_request_rate_limits WHERE identifier_hash = ? AND created_at >= ?',
    ).bind(identifierHash, windowStart).first()

    if ((rate?.count || 0) >= 5) {
      return json({ success: false, message: 'Çok fazla istek gönderdiniz. Lütfen biraz sonra yeniden deneyin.' }, 429)
    }

    await env.DB.prepare(
      'INSERT INTO quote_request_rate_limits (identifier_hash, created_at) VALUES (?, ?)',
    ).bind(identifierHash, now).run()

    const result = await env.DB.prepare(
      \`INSERT INTO quote_requests
       (full_name, company_name, email, phone, service_type, budget_range, preferred_contact_method, project_description, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?)\`,
    ).bind(
      values.full_name,
      values.company_name || null,
      values.email,
      values.phone,
      values.service_type,
      values.budget_range,
      values.preferred_contact_method,
      values.project_description,
      now,
      now,
    ).run()

    return json({
      success: true,
      message: 'Mesajınız bize ulaştı.',
      data: { request_id: result.meta.last_row_id },
    }, 201)
  } catch {
    return json({ success: false, message: 'Talebiniz şu anda işlenemedi.' }, 500)
  }
}

export default worker
`

const wranglerConfig = {
  name: 'ulku-yazilim-studio',
  compatibility_date: '2026-08-13',
  compatibility_flags: ['nodejs_compat'],
  main: 'index.js',
  no_bundle: true,
  rules: [{ type: 'ESModule', globs: ['**/*.js', '**/*.mjs'] }],
  assets: { directory: '../client' },
  d1_databases: [
    {
      binding: 'DB',
      database_name: 'site-creator-d1',
      database_id: '00000000-0000-4000-8000-000000000000',
    },
  ],
  observability: { enabled: true },
}

await mkdir(serverDirectory, { recursive: true })
await writeFile(workerPath, workerSource, 'utf8')
await writeFile(wranglerPath, JSON.stringify(wranglerConfig), 'utf8')
