import { useRef } from 'react'
import { useWorkspace } from './context'
import { usePresence } from './usePresence'

/** Transient bottom-center confirmation (copy actions, etc.). */
export function Toast() {
  const { toast } = useWorkspace()
  const { mounted, show } = usePresence(!!toast, 200)
  const last = useRef('')
  if (toast) last.current = toast
  if (!mounted) return null
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-5 left-1/2 z-[85] rounded-full border border-line2 bg-elev px-4 py-2 font-mono text-[11px] text-fg shadow-xl shadow-black/40 transition-opacity duration-200 ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ transform: 'translateX(-50%)' }}
    >
      <span className="text-violet">✓</span> {toast ?? last.current}
    </div>
  )
}
