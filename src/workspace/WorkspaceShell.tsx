import { WorkspaceContext } from './context'
import { useWorkspaceController } from './useWorkspace'
import { Sidebar } from './Sidebar'
import { NoteView } from './NoteView'
import { ContextRail } from './ContextRail'
import { CommandPalette } from './CommandPalette'
import { GraphModal } from './GraphModal'
import { PreviewLayer } from './PreviewLayer'
import { Hint } from './Hint'
import { ShortcutsHelp, HelpButton } from './ShortcutsHelp'
import { Toast } from './Toast'

export function WorkspaceShell() {
  const ctx = useWorkspaceController()
  const { mode, sideW, railW, sideCollapsed, railCollapsed, resizing } = ctx

  let gridTemplateColumns = '1fr'
  if (mode === 'tablet') {
    gridTemplateColumns = `${sideCollapsed ? 0 : sideW}px minmax(0,1fr)`
  } else if (mode === 'desktop') {
    gridTemplateColumns = `${sideCollapsed ? 0 : sideW}px minmax(0,1fr) ${railCollapsed ? 0 : railW}px`
  }

  return (
    <WorkspaceContext.Provider value={ctx}>
      <div className="grain">
        <div
          className="grid h-screen bg-bg text-fg"
          style={{
            gridTemplateColumns,
            gridTemplateRows: 'minmax(0,1fr)',
            // animate collapse/expand, but never while dragging the resizer
            transition: resizing ? 'none' : 'grid-template-columns 240ms cubic-bezier(0.2, 0.7, 0.2, 1)',
          }}
        >
          <Sidebar />
          <NoteView />
          <ContextRail />
        </div>
        <CommandPalette />
        <GraphModal />
        <ShortcutsHelp />
        <PreviewLayer />
        <Hint />
        <HelpButton />
        <Toast />
      </div>
    </WorkspaceContext.Provider>
  )
}
