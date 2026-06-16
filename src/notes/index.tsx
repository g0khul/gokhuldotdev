import { useState, useEffect, type ReactNode } from 'react'
import type { Note } from '../workspace/types'
import { Wl, Ext } from '../lib/wikilink'
import { personal } from '../data/personal'
import { experience } from '../data/experience'
import { building, type BuildingProject } from '../data/building'
import { projects } from '../data/projects'
import { killed } from '../data/killed'
import { social } from '../data/social'
import { dsa } from '../data/dsa'

/* ---------- small presentational helpers ---------- */

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-line py-3.5 last:border-b-0 sm:flex-row sm:gap-4">
      <div className="shrink-0 pt-0.5 font-mono text-xs text-dim sm:w-28">{label}</div>
      <div className="min-w-0">{children}</div>
    </div>
  )
}

function Tags({ items }: { items: string[] }) {
  return (
    <div className="mt-2.5 flex flex-wrap gap-1.5">
      {items.map((t) => (
        <span
          key={t}
          className="rounded-full border border-line2 px-2.5 py-0.5 font-mono text-[10px] text-muted"
        >
          {t}
        </span>
      ))}
    </div>
  )
}

const url = (name: string) => social.find((s) => s.name === name)?.url ?? '#'

/** A live, maintained project — the richer showcase card for "what i'm building". */
function BuildCard({ p }: { p: BuildingProject }) {
  return (
    <div className="rounded-lg border border-line2 bg-panel p-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <a
          href={p.url}
          target="_blank"
          rel="noreferrer"
          className="text-[16px] font-semibold text-fg underline decoration-line2 underline-offset-4 transition-colors hover:decoration-violet"
        >
          {p.name} <span className="text-violet">↗</span>
        </a>
        <span className="rounded-full border border-violet/40 bg-violet-soft px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-violet">
          {p.status}
        </span>
        <span className="font-mono text-[11px] text-muted">{p.role}</span>
      </div>
      <p className="mt-3 text-[14px] leading-relaxed text-read">{p.description}</p>
      <ul className="mt-3.5 flex flex-col gap-2">
        {p.highlights.map((h) => (
          <li key={h} className="flex gap-2.5 text-[13.5px] text-muted">
            <span className="mt-[3px] shrink-0 font-mono text-[11px] text-violet">→</span>
            <span>{h}</span>
          </li>
        ))}
      </ul>
      <Tags items={p.technologies} />
    </div>
  )
}

function CopyEmail() {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(personal.email)
          setCopied(true)
          setTimeout(() => setCopied(false), 1600)
        } catch (e) { /* ignore */ }
      }}
      className="inline-flex items-center gap-2 rounded-md border border-violet/40 bg-violet-soft px-3 py-2 font-mono text-[13px] text-fg transition-colors hover:border-violet"
    >
      <span className="text-violet">{copied ? '✓' : '⎘'}</span>
      {copied ? 'copied to clipboard' : personal.email}
    </button>
  )
}

interface Post {
  title: string
  link: string
  date: string
  excerpt: string
}

function fmtDate(s: string): string {
  const d = new Date(s)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/** Pulls the recent Substack posts from /api/substack and previews them in our
 *  design. Degrades to a plain Substack link if the endpoint isn't reachable
 *  (e.g. under plain `vite dev`, or a feed hiccup). */
function SubstackFeed() {
  const [posts, setPosts] = useState<Post[] | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let alive = true
    fetch('/api/substack')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: { items?: Post[] }) => {
        if (!alive) return
        if (d.items && d.items.length) setPosts(d.items.slice(0, 5))
        else setFailed(true)
      })
      .catch(() => alive && setFailed(true))
    return () => {
      alive = false
    }
  }, [])

  if (failed) {
    return (
      <p className="text-[13.5px] text-muted">
        The latest is over on <Ext href={url('Substack')}>Substack ↗</Ext>.
      </p>
    )
  }

  if (!posts) {
    return (
      <div className="flex flex-col gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-[58px] animate-pulse rounded-lg border border-line bg-panel" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {posts.map((p) => (
        <a
          key={p.link}
          href={p.link}
          target="_blank"
          rel="noreferrer"
          className="group rounded-lg border border-line2 bg-panel px-4 py-3 transition-colors hover:border-violet"
        >
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[14.5px] font-medium text-fg transition-colors group-hover:text-violet">
              {p.title}
            </span>
            {p.date && <span className="shrink-0 font-mono text-[10px] text-dim">{fmtDate(p.date)}</span>}
          </div>
          {p.excerpt && <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-muted">{p.excerpt}</p>}
        </a>
      ))}
    </div>
  )
}

/* ---------- notes ---------- */

const now: Note = {
  id: 'now',
  title: 'now',
  group: 'workspace',
  icon: '◆',
  meta: (
    <>
      {personal.title} · {personal.location} ·{' '}
      <span className="text-violet">attention to detail</span>
    </>
  ),
  excerpt:
    'Software engineer in Chennai writing modular, clean code with speed and cost in mind.',
  links: ['careerbytecode', 'writing', 'projects', 'killed', 'connect'],
  Body: () => (
    <>
      <p>
        Hey, I'm Gokhul, a software engineer based in Chennai. I write modular, reusable, clean code
        with speed and cost in mind. When I'm not coding you'll find me poking at new tech, tinkering
        on side projects, or writing up what I learn.
      </p>
      <p>
        These days I'm a Software Development Engineer III at Synkcode, building features end to end.
        On the side I'm shipping a few things of my own. More on those in{' '}
        <Wl to="careerbytecode">what i'm building</Wl>, and I write up what I learn in{' '}
        <Wl to="writing">writing</Wl>.
      </p>
      <h2>the path</h2>
      <div>
        {experience.map((e) => (
          <Row key={e.company + e.duration} label={e.duration}>
            <h3 className="text-[15px] font-medium text-fg">{e.company}</h3>
            <div className="font-mono text-xs text-violet">{e.role}</div>
            <p className="mt-1 text-[13.5px] text-muted">{e.description}</p>
          </Row>
        ))}
      </div>
      <h2>also</h2>
      <p>
        I keep my problem solving sharp on <Ext href={dsa.profile}>{dsa.platform}</Ext> ({dsa.challenge}).
        The rest of the trail: <Wl to="projects">projects</Wl> ·{' '}
        <Wl to="killed">killed by me</Wl> · <Wl to="connect">connect</Wl>.
      </p>
    </>
  ),
}

const careerbytecode: Note = {
  id: 'careerbytecode',
  title: "what i'm building",
  group: 'workspace',
  icon: '▸',
  meta: (
    <>
      things I ship on the side ·{' '}
      <span className="text-violet">live &amp; maintained</span>
    </>
  ),
  excerpt:
    'The side work worth showing: shipped, live, and still maintained.',
  links: ['projects'],
  Body: () => (
    <>
      <p>
        This is where the work worth showing lives. A freelance build I can share, a small app I put
        on a store for fun, a niche site I shipped because I wanted it to exist. The bar is simple: if
        it's here, it's live and I still maintain it.
      </p>
      <h2>live</h2>
      <div className="mt-1 flex flex-col gap-4">
        {building.map((p) => (
          <BuildCard key={p.name} p={p} />
        ))}
      </div>
      <h2>see also</h2>
      <p>
        Smaller things I built to learn along the way: <Wl to="projects">projects</Wl>.
      </p>
    </>
  ),
}

const writing: Note = {
  id: 'writing',
  title: 'writing',
  group: 'workspace',
  icon: '▸',
  meta: (
    <>
      I write in public · <span className="text-violet">substack, x, linkedin</span>
    </>
  ),
  excerpt: 'I write on the internet to think clearly. Longer pieces on Substack, lighter notes on X and LinkedIn.',
  links: [],
  Body: () => (
    <>
      <p>
        I write on the internet to think clearly and to keep myself honest. The longer pieces go on
        Substack. X and LinkedIn are the two lighter lanes.
      </p>
      <h2>from substack</h2>
      <SubstackFeed />
      <p className="text-[12px]">
        <Ext href={url('Substack')}>everything on substack ↗</Ext>
      </p>
      <h2>elsewhere</h2>
      <div>
        <Row label="x">
          <Ext href={url('X')}>quick thoughts, then and there ↗</Ext>
          <p className="mt-1 text-[13px] text-muted">
            unfiltered ideas, things I'm chewing on in the moment
          </p>
        </Row>
        <Row label="linkedin">
          <Ext href="https://www.linkedin.com/in/g0khul/recent-activity/all/">the curated lane ↗</Ext>
          <p className="mt-1 text-[13px] text-muted">
            worthwhile things I've built or shipped, written up properly
          </p>
        </Row>
      </div>
    </>
  ),
}

const projectsNote: Note = {
  id: 'projects',
  title: 'projects',
  group: 'workspace',
  icon: '▸',
  meta: <>things I shipped</>,
  excerpt: 'A few things I built end to end. Small, but each one taught me something.',
  links: ['careerbytecode'],
  Body: () => (
    <>
      <p>A few things I built end to end. Small, but each one taught me something.</p>
      <div>
        {projects.map((p) => (
          <Row key={p.title} label={p.tags[0]?.toLowerCase() ?? ''}>
            <h3 className="text-[15px] font-medium text-fg">{p.title}</h3>
            <p className="mt-0.5 text-[13.5px] text-muted">{p.description}</p>
            <Tags items={p.tags} />
            <div className="mt-2 flex gap-4">
              {p.github && <Ext href={p.github}>code ↗</Ext>}
              {p.live && <Ext href={p.live}>live ↗</Ext>}
            </div>
          </Row>
        ))}
      </div>
      <h2>see also</h2>
      <p>
        These were for learning. The live, maintained work lives in{' '}
        <Wl to="careerbytecode">what i'm building</Wl>.
      </p>
    </>
  ),
}

const killedNote: Note = {
  id: 'killed',
  title: 'killed by me',
  group: 'archive',
  icon: '✕',
  meta: <>things I started and stopped</>,
  excerpt: 'Things I started and stopped, kept around because the dead ends are part of figuring it out.',
  links: [],
  Body: () => (
    <>
      <p>
        Things I started and stopped. I keep them around because the dead ends are part of how I
        figure things out, and leaving them off the page wouldn't be the full picture.
      </p>
      <div>
        {killed.map((k) => (
          <Row key={k.name} label="killed">
            <h3 className="text-[15px] font-medium text-muted line-through">{k.name}</h3>
            <p className="mt-0.5 text-[13.5px] text-dim">reason: {k.reason}</p>
            <div className="mt-1.5">
              <Ext href={k.url}>see the remains ↗</Ext>
            </div>
          </Row>
        ))}
      </div>
    </>
  ),
}

const connect: Note = {
  id: 'connect',
  title: 'connect',
  group: 'reach',
  icon: '→',
  meta: <>the best way to reach me</>,
  excerpt: 'Open to full time roles and the occasional project worth building. Reach out.',
  links: [],
  Body: () => (
    <>
      <div className="flex items-center gap-4">
        <img
          src="/avatar.webp"
          alt={personal.name}
          width={80}
          height={80}
          loading="lazy"
          className="h-[80px] w-[80px] shrink-0 rounded-lg border border-line2 object-cover grayscale transition-[filter] duration-500 ease-out hover:grayscale-0"
        />
        <div className="min-w-0">
          <div className="text-[16px] font-semibold text-fg">{personal.name}</div>
          <div className="font-mono text-xs text-muted">
            {personal.title} · {personal.location}
          </div>
        </div>
      </div>
      <p>
        I'm open to full time roles, and the occasional project worth building on the side. If you've
        got something in that direction, the fastest way to reach me is email.
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2.5">
        <CopyEmail />
        <a
          href={personal.resumeUrl}
          download
          className="inline-flex items-center gap-2 rounded-md border border-line2 px-3 py-2 font-mono text-[13px] text-muted transition-colors hover:border-violet hover:text-fg"
        >
          résumé <span className="text-dim">↓</span>
        </a>
      </div>
      <h2>elsewhere</h2>
      <div>
        {social
          .filter((s) => s.icon !== 'email')
          .map((s) => (
            <Row key={s.name} label={s.name.toLowerCase()}>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                title={s.url}
                className="block max-w-full truncate font-mono text-[13px] text-muted underline decoration-line2 underline-offset-[3px] transition-colors hover:text-fg hover:decoration-violet"
              >
                {s.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
              </a>
            </Row>
          ))}
      </div>
    </>
  ),
}

/* ---------- registry + derived graph ---------- */

export const NOTES: Note[] = [now, careerbytecode, writing, projectsNote, killedNote, connect]
export const NOTE_MAP: Record<string, Note> = Object.fromEntries(NOTES.map((n) => [n.id, n]))
export const ORDER: string[] = NOTES.map((n) => n.id)
export const DEFAULT_NOTE = 'now'

/** unique undirected edges derived from note links */
export const EDGES: [string, string][] = (() => {
  const seen = new Set<string>()
  const out: [string, string][] = []
  for (const n of NOTES) {
    for (const to of n.links) {
      if (!NOTE_MAP[to]) continue
      const key = [n.id, to].sort().join('|')
      if (seen.has(key)) continue
      seen.add(key)
      out.push([n.id, to])
    }
  }
  return out
})()

export const outlinksOf = (id: string): string[] =>
  (NOTE_MAP[id]?.links ?? []).filter((l) => NOTE_MAP[l])

export const backlinksOf = (id: string): string[] =>
  NOTES.filter((n) => n.links.includes(id)).map((n) => n.id)
