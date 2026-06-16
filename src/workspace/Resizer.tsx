import { useCallback } from 'react'
import { useWorkspace } from './context'

/**
 * A thin drag handle pinned to a pane edge.
 * `edge` = which side of the parent pane it sits on.
 * `onDelta` receives the incremental pointer dx each move.
 */
export function Resizer({
  edge,
  onDelta,
  onReset,
  bp = 'md',
}: {
  edge: 'right' | 'left'
  onDelta: (dx: number) => void
  onReset?: () => void
  bp?: 'md' | 'lg'
}) {
  const { setResizing } = useWorkspace()
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      let last = e.clientX
      setResizing(true)
      const move = (ev: PointerEvent) => {
        onDelta(ev.clientX - last)
        last = ev.clientX
      }
      const up = () => {
        window.removeEventListener('pointermove', move)
        window.removeEventListener('pointerup', up)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
        setResizing(false)
      }
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', up)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    },
    [onDelta, setResizing],
  )

  return (
    <div
      onPointerDown={onPointerDown}
      onDoubleClick={onReset}
      title="Drag to resize · double-click to reset"
      className={`group absolute inset-y-0 z-30 w-[7px] cursor-col-resize ${
        edge === 'right' ? '-right-[3px]' : '-left-[3px]'
      } ${bp === 'lg' ? 'hidden lg:block' : 'hidden md:block'}`}
    >
      <div className="mx-auto h-full w-px bg-transparent transition-colors group-hover:bg-violet" />
    </div>
  )
}
