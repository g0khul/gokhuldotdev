import { createContext, useContext } from 'react'
import type { Dispatch, SetStateAction } from 'react'

export type LayoutMode = 'mobile' | 'tablet' | 'desktop'
export type Theme = 'dark' | 'light'

export interface OutlineItem {
  id: string
  text: string
}

export interface PreviewState {
  id: string
  rect: DOMRect
}

export interface WorkspaceCtx {
  activeId: string
  /** true when the hash points at a note that doesn't exist */
  unknown: boolean
  navigate: (id: string) => void

  // overlays
  sideOpen: boolean
  setSideOpen: (open: boolean) => void
  railOpen: boolean
  setRailOpen: (open: boolean) => void
  palOpen: boolean
  setPalOpen: (open: boolean) => void
  graphOpen: boolean
  setGraphOpen: (open: boolean) => void
  helpOpen: boolean
  setHelpOpen: (open: boolean) => void

  // resizable / collapsible layout
  sideW: number
  setSideW: Dispatch<SetStateAction<number>>
  railW: number
  setRailW: Dispatch<SetStateAction<number>>
  sideCollapsed: boolean
  toggleSide: () => void
  railCollapsed: boolean
  toggleRail: () => void
  /** true while a pane is being drag-resized (disables the collapse transition) */
  resizing: boolean
  setResizing: (v: boolean) => void

  // theme
  theme: Theme
  toggleTheme: () => void

  // navigation memory + reading aids
  recent: string[]
  outline: OutlineItem[]
  setOutline: (items: OutlineItem[]) => void
  activeHeading: string
  setActiveHeading: (id: string) => void

  // transient toast (copy confirmations, etc.)
  toast: string | null
  notify: (msg: string) => void

  // hover preview
  preview: PreviewState | null
  showPreview: (id: string, rect: DOMRect) => void
  hidePreview: () => void

  // viewport
  vw: number
  mode: LayoutMode
}

export const WorkspaceContext = createContext<WorkspaceCtx | null>(null)

export function useWorkspace(): WorkspaceCtx {
  const ctx = useContext(WorkspaceContext)
  if (!ctx) throw new Error('useWorkspace must be used inside <WorkspaceContext>')
  return ctx
}

/* shared layout constants */
export const SIDE_MIN = 200
export const SIDE_MAX = 380
export const RAIL_MIN = 240
export const RAIL_MAX = 460
export const SIDE_DEFAULT = 248
export const RAIL_DEFAULT = 300
