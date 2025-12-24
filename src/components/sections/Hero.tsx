import { personal } from '../../data/personal'
import { Button } from '../ui/Button'

export function Hero() {
  return (
    <section id="about" className="min-h-screen flex items-center justify-center pt-16">
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold gradient-text mb-6">
          {personal.name}
        </h1>

        <p className="text-xl md:text-2xl text-muted mb-4">
          {personal.title}
        </p>

        <p className="text-lg text-muted max-w-2xl mx-auto mb-8">
          {personal.bio}
        </p>

        <div className="flex items-center justify-center gap-4">
          <Button variant="primary">
            <a href="#projects">View Projects</a>
          </Button>
          <Button variant="outline">
            <a href="#contact">Get in Touch</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
