import { projects } from '../../data/projects'
import { ProjectCard } from '../ui/ProjectCard'

export function Projects() {
  return (
    <section id="projects" className="py-20 bg-secondary">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-12">Projects</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
