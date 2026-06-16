import { LuMaximize2 } from 'react-icons/lu'
import { useWorkspace, RAIL_MIN, RAIL_MAX, RAIL_DEFAULT } from './context'
import { Resizer } from './Resizer'
import { Graph } from './Graph'
import { NOTE_MAP, outlinksOf, backlinksOf } from '../notes'

function LinkList({ ids, dir }: { ids: string[]; dir: 'out' | 'back' }) {
  const { navigate } = useWorkspace()
  if (!ids.length) {
    return (
      <div className="px-2 py-1.5 text-[12px] italic text-dim">
        {dir === 'out' ? 'no outgoing links' : 'no backlinks yet'}
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-0.5">
      {ids.map((id) => (
        <button
          key={id}
          onClick={() => navigate(id)}
          className="flex items-center gap-2 truncate rounded-md px-2 py-1.5 text-left text-[12.5px] text-muted transition-colors hover:bg-elev hover:text-fg"
        >
          <span className="font-mono text-[10px] text-dim">{dir === 'out' ? '→' : '←'}</span>
          {NOTE_MAP[id]?.title ?? id}
        </button>
      ))}
    </div>
  )
}

function Label({ children }: { children: string }) {
  return (
    <div className="pb-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-dim">
      {children}
    </div>
  )
}

export function ContextRail() {
  const {
    activeId,
    setGraphOpen,
    setRailW,
    railOpen,
    setRailOpen,
    graphOpen,
    outline,
    activeHeading,
    mode,
    railCollapsed,
  } = useWorkspace()
  const railVisible = mode === 'desktop' ? !railCollapsed : railOpen
  return (
    <>
      <div
        onClick={() => setRailOpen(false)}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-[1px] transition-opacity duration-200 lg:hidden ${
          railOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        className={`enter fixed inset-y-0 right-0 z-50 flex w-[82vw] max-w-[340px] min-h-0 flex-col overflow-hidden border-l border-line bg-panel transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-auto lg:max-w-none lg:translate-x-0 ${
          railOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ animationDelay: '200ms' }}
      >
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-[18px]">
          <div className="flex items-center justify-between">
            <Label>graph</Label>
            <button
              onClick={() => setGraphOpen(true)}
              title="Expand graph"
              className="-mt-1.5 flex h-6 w-6 items-center justify-center rounded-md text-dim transition-colors hover:bg-elev hover:text-fg"
              aria-label="Expand graph to fullscreen"
            >
              <LuMaximize2 size={13} />
            </button>
          </div>

          {/* square box → grows in BOTH dimensions as the rail widens */}
          <div className="mb-4 aspect-square w-full overflow-hidden rounded-[10px] border border-line bg-canvas">
            <Graph paused={graphOpen || !railVisible} />
          </div>

          {outline.length > 0 && (
            <div className="mb-4">
              <Label>on this page</Label>
              <div className="flex flex-col gap-0.5">
                {outline.map((o) => {
                  const on = o.id === activeHeading
                  return (
                    <button
                      key={o.id}
                      onClick={() =>
                        document.getElementById(o.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }
                      className={`flex items-center gap-2 truncate rounded-md px-2 py-1.5 text-left text-[12.5px] lowercase transition-colors hover:bg-elev hover:text-fg ${
                        on ? 'text-fg' : 'text-muted'
                      }`}
                    >
                      <span className={`font-mono text-[10px] ${on ? 'text-violet' : 'text-transparent'}`}>
                        ▸
                      </span>
                      {o.text}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div className="mb-4">
            <Label>linked from here</Label>
            <LinkList ids={outlinksOf(activeId)} dir="out" />
          </div>
          <div>
            <Label>backlinks</Label>
            <LinkList ids={backlinksOf(activeId)} dir="back" />
          </div>
        </div>

        <Resizer
          edge="left"
          bp="lg"
          onReset={() => setRailW(RAIL_DEFAULT)}
          onDelta={(dx) => setRailW((w) => Math.max(RAIL_MIN, Math.min(RAIL_MAX, w - dx)))}
        />
      </aside>
    </>
  )
}
