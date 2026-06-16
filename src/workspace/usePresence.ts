import { useEffect, useState } from 'react'

/**
 * Keeps a component mounted through its exit animation.
 * `mounted` → render the element; `show` → drives the open/closed CSS state.
 *
 *   const { mounted, show } = usePresence(open)
 *   if (!mounted) return null
 *   <div className={show ? 'opacity-100' : 'opacity-0'} />
 */
export function usePresence(open: boolean, ms = 200) {
  const [mounted, setMounted] = useState(open)
  const [show, setShow] = useState(open)

  useEffect(() => {
    if (open) {
      setMounted(true)
      // mount in the closed state, then flip to open next frame so it transitions
      let r2 = 0
      const r1 = requestAnimationFrame(() => {
        r2 = requestAnimationFrame(() => setShow(true))
      })
      return () => {
        cancelAnimationFrame(r1)
        cancelAnimationFrame(r2)
      }
    } else {
      setShow(false)
      const t = setTimeout(() => setMounted(false), ms)
      return () => clearTimeout(t)
    }
  }, [open, ms])

  return { mounted, show }
}
