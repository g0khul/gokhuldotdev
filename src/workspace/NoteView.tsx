import { useEffect, useRef } from 'react'
import { LuPanelLeft, LuPanelRight, LuMenu } from 'react-icons/lu'
import { useWorkspace } from './context'
import { NOTE_MAP } from '../notes'

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function NoteView() {
  const { activeId, setSideOpen, setRailOpen, setPalOpen, navigate, mode, toggleSide, toggleRail, setOutline, setActiveHeading } =
    useWorkspace()
  const note = NOTE_MAP[activeId]
  const scrollRef = useRef<HTMLDivElement>(null)

  // reset scroll on note change
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [activeId])

  // document title + meta description per note
  useEffect(() => {
    if (note) {
      document.title = `${note.title} · gokhul.dev`
      setMeta('description', note.excerpt)
    } else {
      document.title = 'not found · gokhul.dev'
    }
  }, [activeId, note])

  // publish "on this page" outline (assigns ids to headings) + track active section
  useEffect(() => {
    const root = scrollRef.current
    if (!root || !note) {
      setOutline([])
      setActiveHeading('')
      return
    }
    const hs = Array.from(root.querySelectorAll('h2')) as HTMLElement[]
    const items = hs.map((el, i) => {
      const text = el.textContent || `section ${i + 1}`
      const id = `h-${slug(text)}-${i}`
      el.id = id
      return { id, text }
    })
    setOutline(items)
    setActiveHeading(items[0]?.id ?? '')

    if (!items.length) return
    const visible = new Set<string>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id)
          else visible.delete(e.target.id)
        }
        const firstVisible = items.find((it) => visible.has(it.id))
        if (firstVisible) setActiveHeading(firstVisible.id)
      },
      { root, rootMargin: '0px 0px -65% 0px', threshold: 0 },
    )
    hs.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [activeId, note, setOutline, setActiveHeading])

  return (
    <div className="enter-rise flex min-h-0 min-w-0 flex-col overflow-hidden" style={{ animationDelay: '120ms' }}>
      {/* top bar */}
      <div className="flex shrink-0 items-center gap-2 border-b border-line px-3 py-3 md:px-4">
        <button
          onClick={() => (mode === 'mobile' ? setSideOpen(true) : toggleSide())}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-elev hover:text-fg"
          aria-label="Toggle sidebar"
        >
          {mode === 'mobile' ? <LuMenu size={16} /> : <LuPanelLeft size={15} />}
        </button>

        <span className="ml-1 font-mono text-xs text-muted" aria-live="polite">
          <span className="text-dim">me</span>
          <span className="mx-2 text-dim">/</span>
          <span className="text-fg">{note ? note.title : 'not found'}</span>
        </span>

        <span className="flex-1" />

        <button
          onClick={() => setPalOpen(true)}
          className="rounded-[5px] border border-line2 px-2 py-1 font-mono text-[10px] text-muted transition-colors hover:border-violet hover:text-fg"
        >
          ⌘K&nbsp; jump
        </button>

        <button
          onClick={() => (mode === 'desktop' ? toggleRail() : setRailOpen(true))}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-elev hover:text-fg"
          aria-label="Toggle graph panel"
        >
          <LuPanelRight size={15} />
        </button>
      </div>

      {/* scroll region */}
      <main ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto py-12 md:py-14">
        {note ? (
          <article key={activeId} className="animate-note-in mx-auto max-w-[660px] px-5 md:px-8">
            <h1 className="text-[28px] font-bold leading-tight tracking-[-0.01em] md:text-[30px]">
              {note.title}
            </h1>
            <div className="mb-8 mt-1.5 font-mono text-xs text-muted">{note.meta}</div>
            <div className="prose-note">
              <note.Body />
            </div>
          </article>
        ) : (
          <div className="animate-note-in mx-auto max-w-[660px] px-5 md:px-8">
            <div className="font-mono text-xs uppercase tracking-[0.16em] text-dim">404</div>
            <h1 className="mt-2 text-[28px] font-bold leading-tight tracking-[-0.01em]">
              wrong route, or i just haven't built it yet
            </h1>
            <p className="prose-note mt-4">
              Nothing lives at{' '}
              <code className="font-mono text-fg">#{activeId || '?'}</code>. Either the link's off,
              or it's still an idea in my head. Both happen.
            </p>
            <button
              onClick={() => navigate('now')}
              className="mt-5 rounded-md border border-line2 px-3 py-2 font-mono text-[13px] text-muted transition-colors hover:border-violet hover:text-fg"
            >
              ← back to now
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
