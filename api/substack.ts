/**
 * Vercel serverless function: fetch + parse the Substack RSS feed and return
 * clean JSON. Static pages can't read the feed directly (no CORS), so the
 * page calls this same-origin endpoint instead. Runs in prod and under
 * `vercel dev`; under plain `vite dev` it 404s and the page degrades.
 */
const FEED = 'https://gokhul.substack.com/feed'

// minimal, self-contained handler types so this needs no extra deps
type Res = {
  setHeader: (k: string, v: string) => void
  status: (n: number) => { json: (body: unknown) => void }
}

function tag(block: string, name: string): string {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, 'i'))
  if (!m) return ''
  return m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim()
}

function stripHtml(s: string): string {
  return s
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#?[a-z0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export default async function handler(_req: unknown, res: Res) {
  try {
    const r = await fetch(FEED, { headers: { 'user-agent': 'gokhul.dev' } })
    if (!r.ok) throw new Error(`feed responded ${r.status}`)
    const xml = await r.text()
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
      .slice(0, 5)
      .map((m) => {
        const block = m[1]
        const desc = tag(block, 'description') || tag(block, 'content:encoded')
        return {
          title: tag(block, 'title'),
          link: tag(block, 'link'),
          date: tag(block, 'pubDate'),
          excerpt: stripHtml(desc).slice(0, 180),
        }
      })
      .filter((p) => p.title && p.link)
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
    res.status(200).json({ items })
  } catch (e) {
    res.status(200).json({ items: [], error: String(e) })
  }
}
