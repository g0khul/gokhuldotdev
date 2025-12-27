import { building } from '../../data/building'

export function Building() {
  return (
    <section id="building" className="py-20">
      <div className="max-w-screen-2xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8">What I'm Building</h2>

        <div className="bg-surface border border-default rounded-xl p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <a
              href={building.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-bold hover:text-accent transition-colors"
            >
              {building.name} ↗
            </a>
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-accent/10 text-accent">
              {building.status}
            </span>
          </div>

          <p className="text-muted mb-2">{building.role}</p>
          <p className="text-muted mb-6">{building.description}</p>

          {/* Highlights */}
          <ul className="space-y-2 mb-6">
            {building.highlights.map((highlight) => (
              <li key={highlight} className="flex items-center gap-2 text-muted">
                <span className="text-accent">•</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2">
            {building.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 text-sm rounded-full bg-surface border border-default text-muted"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
