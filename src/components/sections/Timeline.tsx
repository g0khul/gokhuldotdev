import { experience } from '../../data/experience'
import { TimelineItem } from '../ui/TimelineItem'

export function Timeline() {
  return (
    <section id="experience" className="py-20">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-12">Experience</h2>

        <div>
          {experience.map((exp, index) => (
            <TimelineItem
              key={`${exp.company}-${exp.role}`}
              experience={exp}
              isLast={index === experience.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
