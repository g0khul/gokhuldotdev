import { useEffect, useState } from 'react'
import { useWorkspace } from './context'
import { usePresence } from './usePresence'

const KEY = 'ws:hinted'

/** One-time, self-dismissing cue that this is an explorable workspace. */
export function Hint() {
  const { mode, palOpen, sideOpen } = useWorkspace()
  const [open, setOpen] = useState(false)
  const { mounted, show } = usePresence(open, 260)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.localStorage.getItem(KEY)) return
    const t = window.setTimeout(() => setOpen(true), 900)
    return () => window.clearTimeout(t)
  }, [])

  const dismiss = () => {
    setOpen(false)
    try {
      window.localStorage.setItem(KEY, '1')
    } catch (e) { /* ignore */ }
  }

  // dismiss on first interaction or after a while
  useEffect(() => {
    if (!open) return
    if (palOpen || sideOpen) {
      dismiss()
      return
    }
    const t = window.setTimeout(dismiss, 6500)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, palOpen, sideOpen])

  if (!mounted) return null

  return (
    <button
      onClick={dismiss}
      className={`fixed bottom-5 left-1/2 z-[60] rounded-full border border-line2 bg-elev/95 px-4 py-2 font-mono text-[11px] text-muted shadow-xl shadow-black/40 backdrop-blur transition-opacity duration-200 ease-out hover:text-fg ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ transform: 'translateX(-50%)' }}
    >
      <span className="text-violet">{mode === 'mobile' ? 'tap' : 'click'}</span> a note or{' '}
      {mode === 'mobile' ? (
        <>use the menu</>
      ) : (
        <>
          press <span className="text-fg">⌘K</span>
        </>
      )}{' '}
      to explore · this is a workspace, not a page
    </button>
  )
}
