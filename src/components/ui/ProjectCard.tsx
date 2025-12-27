import { FaGithub } from 'react-icons/fa6'
import { FiExternalLink } from 'react-icons/fi'
import type { Project } from '../../data/projects'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="card p-6 flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
      <p className="text-muted text-sm mb-4 flex-grow">{project.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-1 rounded-md bg-secondary text-muted"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-3">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-accent transition-colors"
            aria-label="View on GitHub"
          >
            <FaGithub size={18} />
          </a>
        )}
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-accent transition-colors"
            aria-label="View live demo"
          >
            <FiExternalLink size={18} />
          </a>
        )}
      </div>
    </div>
  )
}
