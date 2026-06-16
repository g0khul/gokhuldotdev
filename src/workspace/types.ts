import type { ReactNode, FC } from 'react'

export type NoteGroup = 'workspace' | 'archive' | 'reach'

export interface Note {
  /** stable id, also the URL hash */
  id: string
  /** display title in tree, breadcrumb, graph */
  title: string
  group: NoteGroup
  /** mono glyph shown in the tree */
  icon: string
  /** small mono subtitle under the title */
  meta: ReactNode
  /** one-line plain-text summary shown in hover previews */
  excerpt: string
  /** outgoing note ids — drives backlinks + graph edges */
  links: string[]
  /** the note's rendered content */
  Body: FC
}
