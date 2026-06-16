import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { useWorkspace } from './context'
import { NOTES, EDGES } from '../notes'
import { graphNodes, stepGraph } from './graphStore'

const SETTLE = 0.0014

// static adjacency + degree (positions are dynamic; topology is not)
const ADJ: Record<string, Set<string>> = {}
NOTES.forEach((n) => (ADJ[n.id] = new Set()))
EDGES.forEach(([a, b]) => {
  ADJ[a]?.add(b)
  ADJ[b]?.add(a)
})
const DEGREE: Record<string, number> = {}
NOTES.forEach((n) => (DEGREE[n.id] = ADJ[n.id].size))

/** A view onto the shared graph layout. `big` = fullscreen (adds zoom/pan). */
export function Graph({ big = false, paused = false }: { big?: boolean; paused?: boolean }) {
  const { activeId, navigate, showPreview, hidePreview } = useWorkspace()
  const wrapRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const sizeRef = useRef(size)
  const dragRef = useRef<{ id: string; moved: boolean } | null>(null)
  const panRef = useRef<{ sx: number; sy: number; tx0: number; ty0: number } | null>(null)
  const zoomRef = useRef({ k: 1, tx: 0, ty: 0 })
  const rafRef = useRef<number | null>(null)
  const pausedRef = useRef(paused)
  const [hover, setHover] = useState<string | null>(null)
  const [, tick] = useReducer((x) => x + 1, 0)
  const reduced = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  const loop = useCallback(() => {
    const v = stepGraph(dragRef.current?.id ?? null)
    tick()
    // perpetual gentle drift keeps v above SETTLE; stop only when paused/hidden
    if (!pausedRef.current && !document.hidden && (dragRef.current || v > SETTLE)) {
      rafRef.current = requestAnimationFrame(loop)
    } else {
      rafRef.current = null
    }
  }, [])

  const kick = useCallback(() => {
    if (pausedRef.current) return
    if (reduced.current) {
      for (let i = 0; i < 140; i++) stepGraph(dragRef.current?.id ?? null)
      tick()
      return
    }
    if (rafRef.current == null) rafRef.current = requestAnimationFrame(loop)
  }, [loop])

  // measure
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect
      const w = Math.round(r.width)
      const h = Math.round(r.height)
      if (w < 40 || h < 40) return
      sizeRef.current = { w, h }
      setSize({ w, h })
      kick()
    })
    ro.observe(el)
    return () => {
      ro.disconnect()
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [kick])

  // pause + active-note changes
  useEffect(() => {
    pausedRef.current = paused
    if (paused) {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    } else {
      kick()
    }
  }, [paused, activeId, kick])

  // dragging nodes + panning canvas (window-level)
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const rect = wrapRef.current?.getBoundingClientRect()
      if (!rect) return
      if (dragRef.current) {
        const { w, h } = sizeRef.current
        const z = zoomRef.current
        const p = graphNodes()[dragRef.current.id]
        if (p) {
          const lx = (e.clientX - rect.left - z.tx) / z.k
          const ly = (e.clientY - rect.top - z.ty) / z.k
          p.nx = Math.max(0.02, Math.min(0.98, lx / w))
          p.ny = Math.max(0.02, Math.min(0.98, ly / h))
          p.vx = 0
          p.vy = 0
        }
        dragRef.current.moved = true
        kick()
      } else if (panRef.current) {
        const pan = panRef.current
        zoomRef.current.tx = pan.tx0 + (e.clientX - pan.sx)
        zoomRef.current.ty = pan.ty0 + (e.clientY - pan.sy)
        tick()
      }
    }
    const up = () => {
      const d = dragRef.current
      dragRef.current = null
      panRef.current = null
      if (d && !d.moved) navigate(d.id)
      kick()
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [kick, navigate])

  // resume drift when the tab becomes visible again (we pause it while hidden)
  useEffect(() => {
    const onVis = () => {
      if (!document.hidden) kick()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [kick])

  // wheel zoom (fullscreen only) — native non-passive so we can preventDefault
  useEffect(() => {
    const el = svgRef.current
    if (!el || !big) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const rect = el.getBoundingClientRect()
      const px = e.clientX - rect.left
      const py = e.clientY - rect.top
      const z = zoomRef.current
      const k = Math.max(0.5, Math.min(3, z.k * (e.deltaY < 0 ? 1.12 : 1 / 1.12)))
      zoomRef.current = {
        k,
        tx: px - ((px - z.tx) * k) / z.k,
        ty: py - ((py - z.ty) * k) / z.k,
      }
      tick()
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
    // re-run once the svg actually exists (size measured) so the listener attaches,
    // and so trackpad pinch (ctrl+wheel) is captured instead of zooming the whole page
  }, [big, size.w, size.h])

  const { w, h } = size
  const P = graphNodes()
  const z = zoomRef.current

  // focus = hovered node, else the active note → dim everything not connected to it
  const focus = hover ?? (NOTES.some((n) => n.id === activeId) ? activeId : null)
  const related = focus ? new Set<string>([focus, ...ADJ[focus]]) : null

  const m = Math.min(w, h)
  const R0 = Math.max(big ? 5 : 3.5, Math.min(big ? 11 : 6.5, m * 0.015))
  const radius = (id: string) =>
    R0 + DEGREE[id] * (big ? 1.5 : 0.9) + (id === activeId ? (big ? 3 : 2) : 0) + (id === hover ? 1.5 : 0)
  const fontSize = big ? 12 : 8
  const at = (id: string) => ({ x: P[id].nx * w, y: P[id].ny * h })

  const onBgDown = big
    ? (e: React.PointerEvent) => {
        const zc = zoomRef.current
        panRef.current = { sx: e.clientX, sy: e.clientY, tx0: zc.tx, ty0: zc.ty }
      }
    : undefined

  return (
    <div ref={wrapRef} className="h-full w-full">
      {w >= 40 && h >= 40 && (
        <svg
          ref={svgRef}
          width={w}
          height={h}
          onPointerDown={onBgDown}
          onDoubleClick={big ? () => { zoomRef.current = { k: 1, tx: 0, ty: 0 }; tick() } : undefined}
          role="group"
          aria-label={`Notes graph — ${NOTES.length} notes${big ? '; scroll or pinch to zoom, drag to pan, double-click to reset' : ''}`}
          className={`block touch-none select-none ${big ? 'cursor-grab active:cursor-grabbing' : ''}`}
        >
          <g transform={`translate(${z.tx} ${z.ty}) scale(${z.k})`}>
            {EDGES.map(([a, b]) => {
              const pa = at(a)
              const pb = at(b)
              const touchesFocus = a === focus || b === focus
              const dim = focus && !touchesFocus
              return (
                <line
                  key={`${a}-${b}`}
                  x1={pa.x}
                  y1={pa.y}
                  x2={pb.x}
                  y2={pb.y}
                  stroke={touchesFocus ? 'var(--color-violet)' : 'var(--color-gedge)'}
                  strokeWidth={touchesFocus ? (big ? 1.8 : 1.4) : 1}
                  style={{ opacity: dim ? 0.4 : 1, transition: 'opacity .2s' }}
                />
              )
            })}
            {NOTES.map((n) => {
              const p = at(n.id)
              const on = n.id === activeId
              const hv = n.id === hover
              const dim = related && !related.has(n.id)
              return (
                <g
                  key={n.id}
                  className="cursor-pointer"
                  tabIndex={0}
                  role="button"
                  aria-label={`Open note: ${n.title}`}
                  style={{ opacity: dim ? 0.3 : 1, transition: 'opacity .2s' }}
                  onPointerDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    hidePreview()
                    dragRef.current = { id: n.id, moved: false }
                    kick()
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      navigate(n.id)
                    }
                  }}
                  onFocus={() => setHover(n.id)}
                  onBlur={() => setHover(null)}
                  onMouseEnter={(e) => {
                    setHover(n.id)
                    // anchor preview to the cursor — the node drifts, the cursor doesn't
                    if (!dragRef.current && !panRef.current) {
                      showPreview(n.id, new DOMRect(e.clientX, e.clientY, 0, 0))
                    }
                  }}
                  onMouseLeave={() => {
                    setHover(null)
                    hidePreview()
                  }}
                >
                  <circle cx={p.x} cy={p.y} r={(big ? 24 : 15) / z.k} fill="transparent" style={{ pointerEvents: 'all' }} />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={radius(n.id)}
                    fill={on ? 'var(--color-violet)' : hv ? 'var(--color-muted)' : 'var(--color-gnode)'}
                    style={{ pointerEvents: 'none', transition: 'fill .15s' }}
                  />
                  <text
                    x={p.x}
                    y={p.y - radius(n.id) - 5}
                    textAnchor="middle"
                    className="font-mono"
                    style={{
                      fontSize,
                      fill: on || hv ? 'var(--color-fg)' : 'var(--color-dim)',
                      pointerEvents: 'none',
                    }}
                  >
                    {n.title}
                  </text>
                </g>
              )
            })}
          </g>
        </svg>
      )}
    </div>
  )
}
