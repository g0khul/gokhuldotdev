import { useState, useEffect, useRef, type ReactNode } from 'react'
import { useWorkspace } from './context'
import { usePresence } from './usePresence'
import { NOTES } from '../notes'
import { social } from '../data/social'
import { personal } from '../data/personal'

type Kind = 'note' | 'action' | 'link'
interface Item {
  id: string
  label: string
  kind: Kind
  icon: string
  hint?: string
  run: () => void
}

/** subsequence fuzzy match → highlighted segments, or null if no match */
function fuzzy(text: string, q: string): ReactNode[] | null {
  if (!q) return [text]
  const lower = text.toLowerCase()
  const ql = q.toLowerCase()
  const hits = new Set<number>()
  let qi = 0
  for (let i = 0; i < text.length && qi < ql.length; i++) {
    if (lower[i] === ql[qi]) {
      hits.add(i)
      qi++
    }
  }
  if (qi < ql.length) return null
  const out: ReactNode[] = []
  let cur = ''
  let curHit = false
  const flush = (i: number) => {
    if (cur) out.push(curHit ? <span key={i} className="fz">{cur}</span> : <span key={i}>{cur}</span>)
    cur = ''
  }
  for (let i = 0; i < text.length; i++) {
    const hit = hits.has(i)
    if (hit !== curHit) {
      flush(i)
      curHit = hit
    }
    cur += text[i]
  }
  flush(text.length)
  return out
}

export function CommandPalette() {
  const ws = useWorkspace()
  const { palOpen, setPalOpen, navigate, recent } = ws
  const [q, setQ] = useState('')
  const [cur, setCur] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const prevFocus = useRef<HTMLElement | null>(null)

  // all available commands
  const notes: Item[] = NOTES.map((n) => ({
    id: `note:${n.id}`,
    label: n.title,
    kind: 'note',
    icon: n.icon,
    run: () => navigate(n.id),
  }))

  const actions: Item[] = [
    { id: 'a:graph', label: 'Open fullscreen graph', kind: 'action', icon: '⤢', run: () => ws.setGraphOpen(true) },
    { id: 'a:theme', label: `Switch to ${ws.theme === 'dark' ? 'light' : 'dark'} theme`, kind: 'action', icon: '◐', run: ws.toggleTheme },
    { id: 'a:side', label: 'Toggle sidebar', kind: 'action', icon: '◧', run: ws.toggleSide },
    { id: 'a:rail', label: 'Toggle graph panel', kind: 'action', icon: '◨', run: ws.toggleRail },
    { id: 'a:help', label: 'Keyboard shortcuts', kind: 'action', icon: '⌨', run: () => ws.setHelpOpen(true) },
    {
      id: 'a:copy',
      label: 'Copy link to this note',
      kind: 'action',
      icon: '⎘',
      run: () => {
        try {
          navigator.clipboard?.writeText(`${window.location.origin}/#${ws.activeId}`)
          ws.notify('link copied')
        } catch (e) { /* ignore */ }
      },
    },
  ]

  const links: Item[] = social.map((s) => ({
    id: `link:${s.name}`,
    label: s.name === 'Email' ? `Email — ${personal.email}` : `Open ${s.name}`,
    kind: 'link',
    icon: '↗',
    run: () => window.open(s.url, s.icon === 'email' ? '_self' : '_blank'),
  }))

  const all = [...notes, ...actions, ...links]

  // build the visible list (with fuzzy highlight)
  let results: { item: Item; nodes: ReactNode[] }[]
  if (!q.trim()) {
    const recents = recent
      .map((id) => notes.find((n) => n.id === `note:${id}`))
      .filter(Boolean) as Item[]
    const seen = new Set(recents.map((r) => r.id))
    const rest = all.filter((i) => !seen.has(i.id))
    results = [...recents, ...rest].map((item) => ({ item, nodes: [item.label] }))
  } else {
    results = all
      .map((item) => ({ item, nodes: fuzzy(item.label, q.trim()) }))
      .filter((r): r is { item: Item; nodes: ReactNode[] } => r.nodes !== null)
  }

  useEffect(() => {
    if (palOpen) {
      prevFocus.current = document.activeElement as HTMLElement
      setQ('')
      setCur(0)
      const t = setTimeout(() => inputRef.current?.focus(), 10)
      return () => clearTimeout(t)
    } else {
      prevFocus.current?.focus?.()
    }
  }, [palOpen])

  useEffect(() => setCur(0), [q])

  const { mounted, show } = usePresence(palOpen, 180)
  if (!mounted) return null

  const activate = (i: number) => {
    const r = results[i]
    if (!r) return
    r.item.run()
    setPalOpen(false)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCur((c) => Math.min(c + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCur((c) => Math.max(c - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      activate(cur)
    } else if (e.key === 'Tab') {
      e.preventDefault() // trap focus on the input
    }
  }

  const kindTag: Record<Kind, string> = { note: 'note', action: 'action', link: 'link' }

  return (
    <div
      className={`fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[14vh] backdrop-blur-sm transition-opacity duration-200 ${
        show ? 'bg-black/60 opacity-100' : 'bg-black/0 opacity-0'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) setPalOpen(false)
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className={`w-full max-w-[540px] overflow-hidden rounded-xl border border-line2 bg-elev shadow-2xl shadow-black/60 transition duration-200 ease-out ${
          show ? 'translate-y-0 scale-100 opacity-100' : '-translate-y-2 scale-[0.97] opacity-0'
        }`}
      >
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search notes, actions, links…"
          autoComplete="off"
          spellCheck={false}
          className="w-full border-b border-line bg-transparent px-[18px] py-4 font-mono text-[15px] text-fg outline-none placeholder:text-dim"
        />
        <div className="max-h-[340px] overflow-y-auto p-2">
          {results.length === 0 && (
            <div className="px-3 py-3 font-mono text-[13px] text-dim">no matches</div>
          )}
          {!q.trim() && recent.length > 0 && (
            <div className="px-3 pb-1 pt-2 font-mono text-[9.5px] uppercase tracking-[0.16em] text-dim">
              recent
            </div>
          )}
          {results.map((r, i) => (
            <button
              key={r.item.id}
              onClick={() => activate(i)}
              onMouseEnter={() => setCur(i)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[14px] transition-colors ${
                i === cur ? 'bg-violet-soft text-fg' : 'text-muted'
              }`}
            >
              <span className={`w-3.5 font-mono text-xs ${i === cur ? 'text-violet' : 'text-dim'}`}>
                {r.item.icon}
              </span>
              <span className="truncate">{r.nodes}</span>
              <span className="ml-auto font-mono text-[10px] text-dim">{kindTag[r.item.kind]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
