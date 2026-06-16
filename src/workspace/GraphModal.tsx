import { useRef } from 'react'
import { LuX } from 'react-icons/lu'
import { useWorkspace } from './context'
import { usePresence } from './usePresence'
import { useFocusTrap } from './useFocusTrap'
import { Graph } from './Graph'
import { NOTE_MAP } from '../notes'

export function GraphModal() {
  const { graphOpen, setGraphOpen, activeId } = useWorkspace()
  const cardRef = useRef<HTMLDivElement>(null)
  useFocusTrap(cardRef, graphOpen)

  const { mounted, show } = usePresence(graphOpen, 200)
  if (!mounted) return null
  return (
    <div
      className={`fixed inset-0 z-[70] flex flex-col backdrop-blur-sm transition-opacity duration-200 md:p-8 ${
        show ? 'bg-black/90 opacity-100' : 'bg-black/0 opacity-0'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) setGraphOpen(false)
      }}
    >
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-label="Graph view"
        className={`mx-auto flex h-full w-full flex-col overflow-hidden bg-panel transition duration-200 ease-out md:max-w-[1100px] md:rounded-xl md:border md:border-line2 ${
          show ? 'scale-100 opacity-100' : 'scale-[0.98] opacity-0'
        }`}
      >
        <header className="flex shrink-0 items-center justify-between border-b border-line px-4 py-3 md:px-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-dim">
            graph · <span className="text-violet">{NOTE_MAP[activeId]?.title ?? 'not found'}</span>
            <span className="ml-3 hidden text-dim sm:inline">scroll to zoom · drag to pan</span>
          </span>
          <button
            onClick={() => setGraphOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-elev hover:text-fg"
            aria-label="Close graph"
          >
            <LuX size={18} />
          </button>
        </header>
        <div className="min-h-0 flex-1 bg-canvas">
          <Graph big />
        </div>
      </div>
    </div>
  )
}
