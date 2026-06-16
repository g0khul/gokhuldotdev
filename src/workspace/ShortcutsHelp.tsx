import { useRef } from 'react'
import { LuKeyboard, LuX } from 'react-icons/lu'
import { useWorkspace } from './context'
import { usePresence } from './usePresence'
import { useFocusTrap } from './useFocusTrap'

const SHORTCUTS: { keys: string[]; label: string }[] = [
  { keys: ['⌘', 'K'], label: 'Open command palette' },
  { keys: ['j'], label: 'Next note' },
  { keys: ['k'], label: 'Previous note' },
  { keys: ['1', '–', '6'], label: 'Jump to a note' },
  { keys: ['['], label: 'Toggle sidebar' },
  { keys: [']'], label: 'Toggle graph panel' },
  { keys: ['\\'], label: 'Open fullscreen graph' },
  { keys: ['t'], label: 'Toggle light / dark' },
  { keys: ['?'], label: 'Show this help' },
  { keys: ['Esc'], label: 'Close any overlay' },
]

function Key({ children }: { children: string }) {
  return (
    <kbd className="inline-flex min-w-[22px] items-center justify-center rounded-[5px] border border-line2 bg-bg px-1.5 py-0.5 font-mono text-[11px] text-fg">
      {children}
    </kbd>
  )
}

export function ShortcutsHelp() {
  const { helpOpen, setHelpOpen } = useWorkspace()
  const cardRef = useRef<HTMLDivElement>(null)
  useFocusTrap(cardRef, helpOpen)
  const { mounted, show } = usePresence(helpOpen, 180)
  if (!mounted) return null
  return (
    <div
      className={`fixed inset-0 z-[80] flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-200 ${
        show ? 'bg-black/60 opacity-100' : 'bg-black/0 opacity-0'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) setHelpOpen(false)
      }}
    >
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
        className={`w-full max-w-[420px] overflow-hidden rounded-xl border border-line2 bg-elev shadow-2xl shadow-black/60 transition duration-200 ease-out ${
          show ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-[0.97] opacity-0'
        }`}
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-dim">
            <LuKeyboard size={14} /> keyboard
          </span>
          <button
            onClick={() => setHelpOpen(false)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-bg hover:text-fg"
            aria-label="Close help"
          >
            <LuX size={16} />
          </button>
        </header>
        <div className="flex flex-col p-2">
          {SHORTCUTS.map((s) => (
            <div
              key={s.label}
              className="flex items-center justify-between rounded-md px-3 py-2 text-[13px] text-read"
            >
              <span>{s.label}</span>
              <span className="flex items-center gap-1">
                {s.keys.map((k, i) =>
                  k === '–' ? (
                    <span key={i} className="text-dim">–</span>
                  ) : (
                    <Key key={i}>{k}</Key>
                  ),
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** quiet, always-available help affordance, bottom-right of the note column */
export function HelpButton() {
  const { setHelpOpen, mode, railW, railCollapsed } = useWorkspace()
  if (mode === 'mobile') return null // keyboard shortcuts are desktop-only
  // sit just left of the graph rail when it's open, so it never overlaps it
  const right = mode === 'desktop' && !railCollapsed ? railW + 16 : 16
  return (
    <button
      onClick={() => setHelpOpen(true)}
      title="Keyboard shortcuts (?)"
      aria-label="Keyboard shortcuts"
      style={{ right }}
      className="fixed bottom-4 z-[55] flex h-8 w-8 items-center justify-center rounded-full border border-line2 bg-elev/90 font-mono text-sm text-muted shadow-lg shadow-black/30 backdrop-blur transition-colors hover:border-violet hover:text-fg"
    >
      ?
    </button>
  )
}
