import { NOTES, EDGES } from '../notes'

/**
 * One shared physics layout for ALL graph views (rail + fullscreen).
 * Positions live in NORMALIZED space (0..1) so the same layout maps cleanly
 * to any canvas size — centered, scalable, and preserved across views.
 *
 * The layout is randomized on each page load and gently drifts forever
 * (a slow per-node wander) so it never looks canned or frozen.
 */
export type GNode = { nx: number; ny: number; vx: number; vy: number; phase: number }

const nodes: Record<string, GNode> = {}
let inited = false
let T = 0

export function ensureGraphInit() {
  if (inited) return
  NOTES.forEach((n) => {
    const angle = Math.random() * Math.PI * 2 // random structure each load
    const rad = 0.18 + Math.random() * 0.22
    nodes[n.id] = {
      nx: 0.5 + Math.cos(angle) * rad,
      ny: 0.5 + Math.sin(angle) * rad,
      vx: (Math.random() - 0.5) * 0.01, // a little starting life
      vy: (Math.random() - 0.5) * 0.01,
      phase: Math.random() * Math.PI * 2,
    }
  })
  inited = true
}

export function graphNodes(): Record<string, GNode> {
  ensureGraphInit()
  return nodes
}

const REST = 0.34
const KSPRING = 0.035
const KREP = 0.0014
const KCENTER = 0.0085
const DAMP = 0.9
const WANDER = 0.00045 // perpetual gentle drift

export function stepGraph(dragId: string | null): number {
  ensureGraphInit()
  T += 1
  const ids = NOTES.map((n) => n.id)

  for (let i = 0; i < ids.length; i++) {
    const a = nodes[ids[i]]
    for (let j = i + 1; j < ids.length; j++) {
      const b = nodes[ids[j]]
      const dx = a.nx - b.nx
      const dy = a.ny - b.ny
      const d2 = dx * dx + dy * dy || 1e-4
      const d = Math.sqrt(d2)
      const f = KREP / d2
      a.vx += (dx / d) * f
      a.vy += (dy / d) * f
      b.vx -= (dx / d) * f
      b.vy -= (dy / d) * f
    }
  }

  for (const [u, v] of EDGES) {
    const a = nodes[u]
    const b = nodes[v]
    const dx = b.nx - a.nx
    const dy = b.ny - a.ny
    const d = Math.sqrt(dx * dx + dy * dy) || 1e-4
    const f = KSPRING * (d - REST)
    a.vx += (dx / d) * f
    a.vy += (dy / d) * f
    b.vx -= (dx / d) * f
    b.vy -= (dy / d) * f
  }

  let maxV = 0
  for (const id of ids) {
    const p = nodes[id]
    if (id === dragId) {
      p.vx = 0
      p.vy = 0
      continue
    }
    // pull to center + slow per-node wander (keeps it alive, never frozen)
    p.vx += (0.5 - p.nx) * KCENTER + Math.cos(T * 0.013 + p.phase) * WANDER
    p.vy += (0.5 - p.ny) * KCENTER + Math.sin(T * 0.011 + p.phase * 1.7) * WANDER
    p.vx *= DAMP
    p.vy *= DAMP
    p.nx += p.vx
    p.ny += p.vy
    p.nx = Math.max(0.07, Math.min(0.93, p.nx))
    p.ny = Math.max(0.1, Math.min(0.92, p.ny))
    maxV = Math.max(maxV, Math.abs(p.vx) + Math.abs(p.vy))
  }
  return maxV
}
