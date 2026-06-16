import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import type { WorkspaceCtx, LayoutMode, Theme, OutlineItem, PreviewState } from './context'
import { SIDE_DEFAULT, RAIL_DEFAULT } from './context'
import { NOTE_MAP, ORDER, DEFAULT_NOTE } from '../notes'

function readHash(): string {
  if (typeof window === 'undefined') return DEFAULT_NOTE
  const h = decodeURIComponent(window.location.hash.replace('#', ''))
  if (!h) return DEFAULT_NOTE
  return h
}

function load(key: string, fallback: number): number {
  if (typeof window === 'undefined') return fallback
  const v = Number(window.localStorage.getItem(key))
  return Number.isFinite(v) && v > 0 ? v : fallback
}

function initialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  const stored = window.localStorage.getItem('ws:theme')
  if (stored === 'light' || stored === 'dark') return stored
  // respect the OS preference on first visit; dark is our default otherwise
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

const modeOf = (w: number): LayoutMode => (w < 768 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop')

export function useWorkspaceController(): WorkspaceCtx {
  const [activeId, setActiveId] = useState<string>(readHash)
  const [sideOpen, setSideOpen] = useState(false)
  const [railOpen, setRailOpen] = useState(false)
  const [palOpen, setPalOpen] = useState(false)
  const [graphOpen, setGraphOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)

  const [sideW, setSideW] = useState(() => load('ws:sideW', SIDE_DEFAULT))
  const [railW, setRailW] = useState(() => load('ws:railW', RAIL_DEFAULT))
  const [sideCollapsed, setSideCollapsed] = useState(false)
  const [railCollapsed, setRailCollapsed] = useState(false)
  const [resizing, setResizing] = useState(false)

  const [theme, setTheme] = useState<Theme>(initialTheme)
  const [recent, setRecent] = useState<string[]>([])
  const [outline, setOutline] = useState<OutlineItem[]>([])
  const [activeHeading, setActiveHeading] = useState('')
  const [preview, setPreview] = useState<PreviewState | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const [vw, setVw] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1280))

  const unknown = !NOTE_MAP[activeId]

  const navigate = useCallback((id: string) => {
    if (!NOTE_MAP[id]) return
    setActiveId((prev) => {
      if (prev !== id && typeof window !== 'undefined') {
        window.history.pushState(null, '', `#${id}`)
      }
      return id
    })
    setSideOpen(false)
    setRailOpen(false)
    setPalOpen(false)
    setHelpOpen(false)
  }, [])

  const toastTimer = useRef<number | null>(null)
  const notify = useCallback((msg: string) => {
    setToast(msg)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 1800)
  }, [])

  // recent notes
  const prevId = useRef(activeId)
  useEffect(() => {
    const prev = prevId.current
    if (prev !== activeId && NOTE_MAP[prev]) {
      setRecent((r) => [prev, ...r.filter((x) => x !== prev)].slice(0, 5))
    }
    prevId.current = activeId
  }, [activeId])

  // theme
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
    window.localStorage.setItem('ws:theme', theme)
  }, [theme])
  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])

  // persist widths
  useEffect(() => {
    window.localStorage.setItem('ws:sideW', String(Math.round(sideW)))
  }, [sideW])
  useEffect(() => {
    window.localStorage.setItem('ws:railW', String(Math.round(railW)))
  }, [railW])

  // viewport
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // back / forward
  useEffect(() => {
    const onHash = () => setActiveId(readHash())
    window.addEventListener('hashchange', onHash)
    window.addEventListener('popstate', onHash)
    return () => {
      window.removeEventListener('hashchange', onHash)
      window.removeEventListener('popstate', onHash)
    }
  }, [])

  const toggleSide = useCallback(() => setSideCollapsed((c) => !c), [])
  const toggleRail = useCallback(() => setRailCollapsed((c) => !c), [])
  const showPreview = useCallback((id: string, rect: DOMRect) => setPreview({ id, rect }), [])
  const hidePreview = useCallback(() => setPreview(null), [])

  // live refs for the keyboard handler (so Esc can close only the topmost overlay)
  const activeRef = useRef(activeId)
  activeRef.current = activeId
  const modeRef = useRef<LayoutMode>(modeOf(vw))
  modeRef.current = modeOf(vw)
  const o = useRef({ pal: palOpen, help: helpOpen, graph: graphOpen, side: sideOpen, rail: railOpen })
  o.current = { pal: palOpen, help: helpOpen, graph: graphOpen, side: sideOpen, rail: railOpen }

  useEffect(() => {
    const step = (dir: number) => {
      const i = ORDER.indexOf(activeRef.current)
      const base = i < 0 ? 0 : i
      navigate(ORDER[(base + dir + ORDER.length) % ORDER.length])
    }
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      const typing =
        !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPalOpen((p) => !p)
        return
      }
      if (e.key === 'Escape') {
        // close only the topmost overlay
        const s = o.current
        if (s.pal) setPalOpen(false)
        else if (s.help) setHelpOpen(false)
        else if (s.graph) setGraphOpen(false)
        else if (s.side) setSideOpen(false)
        else if (s.rail) setRailOpen(false)
        return
      }
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return

      switch (e.key) {
        case 'j': step(1); break
        case 'k': step(-1); break
        case '[': setSideCollapsed((c) => !c); break
        case ']': setRailCollapsed((c) => !c); break
        case '\\': setGraphOpen((g) => !g); break
        case 't': setTheme((th) => (th === 'dark' ? 'light' : 'dark')); break
        case '?': setHelpOpen((h) => !h); break
        default:
          if (/^[1-9]$/.test(e.key)) {
            const idx = Number(e.key) - 1
            if (ORDER[idx]) navigate(ORDER[idx])
          }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])

  const mode = useMemo(() => modeOf(vw), [vw])

  return {
    activeId,
    unknown,
    navigate,
    sideOpen,
    setSideOpen,
    railOpen,
    setRailOpen,
    palOpen,
    setPalOpen,
    graphOpen,
    setGraphOpen,
    helpOpen,
    setHelpOpen,
    sideW,
    setSideW,
    railW,
    setRailW,
    sideCollapsed,
    toggleSide,
    railCollapsed,
    toggleRail,
    resizing,
    setResizing,
    theme,
    toggleTheme,
    recent,
    outline,
    setOutline,
    activeHeading,
    setActiveHeading,
    preview,
    showPreview,
    hidePreview,
    toast,
    notify,
    vw,
    mode,
  }
}
