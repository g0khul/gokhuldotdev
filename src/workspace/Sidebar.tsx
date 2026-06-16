import { useWorkspace, SIDE_MIN, SIDE_MAX, SIDE_DEFAULT } from './context'
import { Resizer } from './Resizer'
import { NOTES } from '../notes'
import { social } from '../data/social'
import { personal } from '../data/personal'
import type { NoteGroup } from './types'

const GROUPS: { key: NoteGroup; label: string }[] = [
  { key: 'workspace', label: 'workspace' },
  { key: 'archive', label: 'archive' },
  { key: 'reach', label: 'reach' },
]

const FOOT = ['GitHub', 'LinkedIn', 'X', 'Substack']

export function Sidebar() {
  const { activeId, navigate, sideOpen, setSideOpen, setSideW } = useWorkspace()

  return (
    <>
      <div
        onClick={() => setSideOpen(false)}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-[1px] transition-opacity duration-200 md:hidden ${
          sideOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        className={`enter fixed inset-y-0 left-0 z-50 flex w-[82vw] max-w-[300px] min-w-0 flex-col overflow-hidden border-r border-line bg-panel transition-transform duration-200 ease-out md:static md:z-auto md:w-auto md:max-w-none md:translate-x-0 ${
          sideOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ animationDelay: '40ms' }}
      >
        {/* vault header */}
        <div className="flex shrink-0 items-center border-b border-line px-4 py-4">
          <span className="flex items-center gap-2 whitespace-nowrap text-[13px] font-semibold tracking-[0.01em]">
            <span className="h-1.5 w-1.5 rounded-full bg-violet animate-pulse-dot" />
            gokhul
          </span>
        </div>

        {/* note tree */}
        <nav
          className="min-h-0 flex-1 overflow-y-auto px-2 py-3"
          role="tree"
          aria-label="Notes"
        >
          {GROUPS.map((g) => {
            const notes = NOTES.filter((n) => n.group === g.key)
            if (!notes.length) return null
            return (
              <div key={g.key} className="mb-1" role="group" aria-label={g.label}>
                <div className="px-2.5 pb-1.5 pt-2.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-dim">
                  {g.label}
                </div>
                {notes.map((n) => {
                  const on = n.id === activeId
                  return (
                    <button
                      key={n.id}
                      role="treeitem"
                      aria-selected={on}
                      onClick={() => navigate(n.id)}
                      className={`flex w-full items-center gap-2.5 whitespace-nowrap rounded-md border-l-2 px-2.5 py-[7px] text-left text-[13.5px] transition-colors ${
                        on
                          ? 'border-violet bg-violet-soft text-fg'
                          : 'border-transparent text-muted hover:bg-elev hover:text-fg'
                      }`}
                    >
                      <span className={`w-3 font-mono text-[11px] ${on ? 'text-violet' : 'text-dim'}`}>
                        {n.icon}
                      </span>
                      {n.title}
                    </button>
                  )
                })}
              </div>
            )
          })}
        </nav>

        {/* availability signal */}
        {personal.available && (
          <a
            href="#connect"
            onClick={(e) => {
              e.preventDefault()
              navigate('connect')
            }}
            className="flex shrink-0 items-center gap-2 border-t border-line px-4 py-2.5 transition-colors hover:bg-elev"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet animate-live" />
            <span className="truncate font-mono text-[10.5px] text-muted">{personal.availability}</span>
          </a>
        )}

        {/* social footer — wraps so links are never clipped */}
        <div className="flex shrink-0 flex-wrap gap-x-3.5 gap-y-1.5 border-t border-line px-4 py-3">
          {FOOT.map((name) => {
            const s = social.find((x) => x.name === name)
            if (!s) return null
            return (
              <a
                key={name}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[11px] lowercase text-dim transition-colors hover:text-fg"
              >
                {name}
              </a>
            )
          })}
        </div>

        <Resizer
          edge="right"
          onReset={() => setSideW(SIDE_DEFAULT)}
          onDelta={(dx) => setSideW((w) => Math.max(SIDE_MIN, Math.min(SIDE_MAX, w + dx)))}
        />
      </aside>
    </>
  )
}
