import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { Hero } from './components/sections/Hero'
import { About } from './components/sections/About'
import { Timeline } from './components/sections/Timeline'
import { Projects } from './components/sections/Projects'
import { Contact } from './components/sections/Contact'

function App() {
  return (
    <div className="min-h-screen bg-primary">
      <Header />
      <main>
        <Hero />
        <About />
        <Timeline />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
