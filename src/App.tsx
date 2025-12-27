import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { Hero } from './components/sections/Hero'
import { About } from './components/sections/About'
import { Timeline } from './components/sections/Timeline'
import { Building } from './components/sections/Building'
import { DSA } from './components/sections/DSA'
import { Projects } from './components/sections/Projects'
import { Killed } from './components/sections/Killed'
import { Contact } from './components/sections/Contact'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

function App() {
  return (
    <div className="min-h-screen bg-primary">
      <Analytics />
      <SpeedInsights />
      <Header />
      <main>
        <Hero />
        <About />
        <Timeline />
        <Building />
        <Projects />
        <DSA />
        <Killed />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
