import type { Experience } from '../../data/experience'

interface TimelineItemProps {
  experience: Experience
  index: number
  isLast?: boolean
  isFirst?: boolean
  scrollProgress?: number
  totalItems?: number
}

export function TimelineItem({
  experience,
  index,
  isLast = false,
  isFirst = false,
  scrollProgress = 0,
  totalItems = 1
}: TimelineItemProps) {
  const isEven = index % 2 === 0

  // Calculate if this item's line segment should be filled
  const lineFillProgress = Math.min(Math.max((scrollProgress - (index / totalItems)) * totalItems, 0), 1)
  const dotActive = scrollProgress >= index / totalItems

  return (
    <div className="relative">
      {/* Mobile layout */}
      <div className="lg:hidden relative pl-8 pb-8">
        {/* Timeline line - mobile */}
        {!isLast && (
          <div className="absolute left-[7px] top-3 bottom-0 w-px bg-border overflow-hidden">
            <div
              className="w-full bg-accent transition-all duration-300 ease-out"
              style={{ height: `${lineFillProgress * 100}%` }}
            />
          </div>
        )}
        {/* Timeline dot - mobile */}
        <div
          className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 transition-all duration-300 ${
            dotActive ? 'border-accent bg-accent' : 'border-border bg-primary'
          }`}
        />

        <TimelineCard experience={experience} />
      </div>

      {/* Desktop layout - alternating left/right */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_48px_1fr] lg:gap-6">
        {/* Left side - shows odd items */}
        <div className="pb-12 flex justify-end">
          {!isEven && <TimelineCard experience={experience} align="right" />}
        </div>

        {/* Center timeline with dot and line */}
        <div className="relative flex justify-center">
          {/* Line above dot (except first item) */}
          {!isFirst && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-2 bg-accent" />
          )}
          {/* Dot */}
          <div
            className={`w-4 h-4 rounded-full border-2 z-10 mt-2 transition-all duration-300 ${
              dotActive ? 'border-accent bg-accent scale-125' : 'border-border bg-primary'
            }`}
          />
          {/* Line below dot (except last item) */}
          {!isLast && (
            <div className="absolute top-6 bottom-0 left-1/2 -translate-x-1/2 w-px bg-border overflow-hidden">
              <div
                className="w-full bg-accent transition-all duration-300 ease-out"
                style={{ height: `${lineFillProgress * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Right side - shows even items */}
        <div className="pb-12 flex justify-start">
          {isEven && <TimelineCard experience={experience} align="left" />}
        </div>
      </div>
    </div>
  )
}

function TimelineCard({
  experience,
  align = 'left'
}: {
  experience: Experience
  align?: 'left' | 'right'
}) {
  return (
    <div className={`bg-surface border border-default rounded-xl p-6 ${align === 'right' ? 'lg:text-right' : ''}`}>
      <div className={`flex flex-col gap-1 mb-2 ${align === 'right' ? 'lg:items-end' : ''}`}>
        <h3 className="font-semibold">{experience.role}</h3>
        <span className="text-sm text-muted">{experience.duration}</span>
      </div>

      <p className="text-accent text-sm mb-3">{experience.company}</p>

      <p className="text-muted text-sm">{experience.description}</p>
    </div>
  )
}
