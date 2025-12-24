import type { Experience } from '../../data/experience'

interface TimelineItemProps {
  experience: Experience
  isLast?: boolean
}

export function TimelineItem({ experience, isLast = false }: TimelineItemProps) {
  return (
    <div className="relative pl-8 pb-8">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[7px] top-3 bottom-0 w-px bg-border" />
      )}

      {/* Timeline dot */}
      <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-accent bg-primary" />

      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 mb-2">
          <h3 className="font-semibold">{experience.role}</h3>
          <span className="text-sm text-muted">{experience.duration}</span>
        </div>

        <p className="text-accent text-sm mb-3">{experience.company}</p>

        <p className="text-muted text-sm mb-4">{experience.description}</p>

        {experience.technologies && (
          <div className="flex flex-wrap gap-2">
            {experience.technologies.map((tech) => (
              <span
                key={tech}
                className="text-xs px-2 py-1 rounded-md bg-secondary text-muted"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
