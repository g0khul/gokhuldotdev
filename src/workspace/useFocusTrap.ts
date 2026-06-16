import { useEffect, type RefObject } from 'react'

const SEL =
  'a[href],button:not([disabled]),input:not([disabled]),textarea,select,[tabindex]:not([tabindex="-1"])'

/** Traps Tab focus within `ref` while `active`, and restores focus on deactivate. */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active) return
    const el = ref.current
    if (!el) return
    const prev = document.activeElement as HTMLElement | null

    const focusables = () =>
      (Array.from(el.querySelectorAll(SEL)) as HTMLElement[]).filter((n) => n.offsetParent !== null)

    const first = focusables()[0]
    ;(first ?? el).focus?.()

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const items = focusables()
      if (!items.length) {
        e.preventDefault()
        return
      }
      const a = items[0]
      const b = items[items.length - 1]
      if (e.shiftKey && document.activeElement === a) {
        e.preventDefault()
        b.focus()
      } else if (!e.shiftKey && document.activeElement === b) {
        e.preventDefault()
        a.focus()
      }
    }
    el.addEventListener('keydown', onKey)
    return () => {
      el.removeEventListener('keydown', onKey)
      prev?.focus?.()
    }
  }, [active, ref])
}
