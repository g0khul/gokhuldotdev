import { useRef, type ReactNode } from 'react'
import { useWorkspace } from '../workspace/context'
import { NOTE_MAP } from '../notes'

/** Inline [[wiki-link]] that navigates to another note, with hover preview. */
export function Wl({ to, children }: { to: string; children: ReactNode }) {
  const { navigate, showPreview, hidePreview } = useWorkspace()
  const timer = useRef<number | null>(null)
  const known = !!NOTE_MAP[to]

  const clear = () => {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }
  }

  return (
    <span
      role="link"
      tabIndex={0}
      onClick={() => {
        clear()
        hidePreview()
        navigate(to)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          navigate(to)
        }
      }}
      onMouseEnter={(e) => {
        if (!known) return
        const rect = e.currentTarget.getBoundingClientRect()
        clear()
        timer.current = window.setTimeout(() => showPreview(to, rect), 320)
      }}
      onMouseLeave={() => {
        clear()
        hidePreview()
      }}
      className="cursor-pointer text-fg underline decoration-dashed decoration-line2 underline-offset-[3px] transition-colors hover:text-fg hover:decoration-violet"
    >
      {children}
    </span>
  )
}

/** Outbound link — opens in a new tab. */
export function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-mono text-[13px] text-muted underline decoration-line2 underline-offset-[3px] transition-colors hover:text-fg hover:decoration-violet"
    >
      {children}
    </a>
  )
}
