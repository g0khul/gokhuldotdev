import { projects } from '../../data/projects'
import { ProjectCarousel } from '../ui/ProjectCarousel'

export function Projects() {
  return (
    <section id="projects" className="py-10 md:py-14 overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-6 mb-8">
        <h2 className="text-3xl font-bold">Things I've built</h2>
      </div>
      <ProjectCarousel projects={projects} />
    </section>
  )
}
