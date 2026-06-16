import { WorkspaceShell } from './workspace/WorkspaceShell'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'

function App() {
  return (
    <>
      <Analytics />
      <SpeedInsights />
      <WorkspaceShell />
    </>
  )
}

export default App
