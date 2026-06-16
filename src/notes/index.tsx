import { useState, type ReactNode } from 'react'
import type { Note } from '../workspace/types'
import { Wl, Ext } from '../lib/wikilink'
import { personal } from '../data/personal'
import { experience } from '../data/experience'
import { building } from '../data/building'
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

/* ---------- notes ---------- */

const now: Note = {
  id: 'now',
  title: 'now',
  group: 'workspace',
  icon: '◆',
  meta: (
    <>
      {personal.title} · {personal.location} ·{' '}
      <span className="text-violet">truth over hype</span>
    </>
  ),
  excerpt:
    'A software engineer who likes the actual engineering — solving the problem, not re-skinning the login page.',
  links: ['careerbytecode', 'writing', 'projects', 'killed', 'connect'],
  Body: () => (
    <>
      <p>
        I'm a software engineer who likes the actual <em>engineering</em> — solving the problem, not
        re-skinning the login page. Give me a lever and somewhere to stand.
      </p>
      <p>
        Right now I'm building features end-to-end at Synkcode, where I grew from SDE I to SDE III in
        months. On the side I'm shipping <Wl to="careerbytecode">CareerByteCode</Wl> and writing down
        what I learn → <Wl to="writing">writing</Wl>.
      </p>
      <h2>what I'm about</h2>
      <p>
        Trustworthy, with a bias for facts over noise. I figure things out fast — and I'd rather do a
        few things genuinely well than many things adequately. The trail below is the proof, not the
        pitch.
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
        I keep the problem-solving sharp on <Ext href={dsa.profile}>{dsa.platform}</Ext> ({dsa.challenge}).
        The rest of the trail: <Wl to="projects">projects</Wl> ·{' '}
        <Wl to="killed">killed by me</Wl> · <Wl to="connect">connect</Wl>.
      </p>
    </>
  ),
}

const careerbytecode: Note = {
  id: 'careerbytecode',
  title: 'careerbytecode',
  group: 'workspace',
  icon: '▸',
  meta: (
    <>
      {building.role} · <span className="text-violet">{building.status}</span>
    </>
  ),
  excerpt:
    'A backend built from scratch — API design, schemas, deploy pipelines, infra. The kind of work I want more of.',
  links: ['projects'],
  Body: () => (
    <>
      <p>{building.description}</p>
      <h2>highlights</h2>
      <ul className="flex flex-col gap-2">
        {building.highlights.map((h) => (
          <li key={h} className="flex gap-2.5 text-[14px] text-fg/90">
            <span className="mt-[2px] font-mono text-xs text-violet">→</span>
            <span>{h}</span>
          </li>
        ))}
      </ul>
      <h2>stack</h2>
      <Tags items={building.technologies} />
      <h2>live</h2>
      <p>
        <Ext href={building.url}>{building.url.replace(/^https?:\/\//, '')}</Ext>
      </p>
      <h2>see also</h2>
      <p>
        <Wl to="projects">projects</Wl>
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
      essays &amp; short articles · <span className="text-violet">in progress</span>
    </>
  ),
  excerpt: 'Where my opinions live — the contrarian-but-defensible kind. On Substack and LinkedIn.',
  links: [],
  Body: () => (
    <>
      <p>
        Where my opinions live — the contrarian-but-defensible kind. For instance: the AGI hype is
        overblown. Today's models are extraordinary pattern-recognition over history — and we don't
        even understand the brain we keep claiming to surpass.
      </p>
      <p>I write to think clearly and to be held to my facts. Read along:</p>
      <h2>find it</h2>
      <div>
        <Row label="substack">
          <Ext href={url('Substack')}>gokhul on Substack →</Ext>
          <p className="mt-1 text-[13px] text-muted">short articles</p>
        </Row>
        <Row label="linkedin">
          <Ext href={url('LinkedIn')}>posts &amp; takes →</Ext>
          <p className="mt-1 text-[13px] text-muted">quick thoughts in public</p>
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
  excerpt: 'A few things I built end-to-end. Small, but each one taught me something.',
  links: [],
  Body: () => (
    <>
      <p>A few things I built end-to-end. Small, but each one taught me something.</p>
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
    </>
  ),
}

const killedNote: Note = {
  id: 'killed',
  title: 'killed by me',
  group: 'archive',
  icon: '✕',
  meta: <>a graveyard, honestly kept</>,
  excerpt: 'Things I started and stopped — kept on purpose, because the failures are part of figuring it out.',
  links: [],
  Body: () => (
    <>
      <p>
        Things I started and stopped. Kept on purpose — the abandoned attempts are part of figuring it
        out, and pretending they didn't happen would be the opposite of truthful.
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
  excerpt: 'Got engineering work worth doing — a role worth switching for, or a project worth building? Reach out.',
  links: [],
  Body: () => (
    <>
      <p>
        If you've got engineering work worth doing — a full-time role worth switching for, or a project
        worth building — I'd like to hear about it. Fastest way is email.
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
              <Ext href={s.url}>{s.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</Ext>
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
