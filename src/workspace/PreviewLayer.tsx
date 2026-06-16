import { useRef } from 'react'
import { useWorkspace } from './context'
import { usePresence } from './usePresence'
import { NOTE_MAP, outlinksOf, backlinksOf } from '../notes'

const W = 280

/** Floating hover-preview of a note (triggered by wiki-links and graph nodes). */
export function PreviewLayer() {
  const { preview } = useWorkspace()
  const { mounted, show } = usePresence(!!preview, 140)
  const last = useRef(preview)
  if (preview) last.current = preview

  const p = preview ?? last.current
  if (!mounted || !p) return null
  const note = NOTE_MAP[p.id]
  if (!note) return null

  const r = p.rect
  const flipUp = r.bottom > window.innerHeight * 0.62
  const left = Math.max(12, Math.min(window.innerWidth - W - 12, r.left))
  const top = flipUp ? undefined : r.bottom + 8
  const bottom = flipUp ? window.innerHeight - r.top + 8 : undefined
  const linkCount = outlinksOf(note.id).length + backlinksOf(note.id).length

  return (
    <div
      className={`pointer-events-none fixed z-[95] rounded-lg border border-line2 bg-elev p-3.5 shadow-2xl shadow-black/50 transition duration-150 ease-out ${
        show ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
      }`}
      style={{ left, top, bottom, width: W }}
    >
      <div className="flex items-center gap-2">
        <span className="font-mono text-[11px] text-violet">{note.icon}</span>
        <span className="text-[13px] font-semibold text-fg">{note.title}</span>
      </div>
      <div className="mt-0.5 font-mono text-[10px] text-dim">{note.meta}</div>
      <p className="mt-2 text-[12.5px] leading-relaxed text-read">{note.excerpt}</p>
      <div className="mt-2.5 border-t border-line pt-2 font-mono text-[10px] text-dim">
        {linkCount} {linkCount === 1 ? 'connection' : 'connections'}
      </div>
    </div>
  )
}
