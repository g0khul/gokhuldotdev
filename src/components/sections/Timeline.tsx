import { useRef, useEffect, useState } from 'react'
import { experience } from '../../data/experience'
import { TimelineItem } from '../ui/TimelineItem'

export function Timeline() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return

      const rect = sectionRef.current.getBoundingClientRect()
      const sectionTop = rect.top
      const sectionHeight = rect.height
      const windowHeight = window.innerHeight

      // Calculate progress: 0 when section enters viewport, 1 when it leaves
      const start = windowHeight * 0.8 // Start when section is 80% from top
      const end = -sectionHeight + windowHeight * 0.2 // End when section is 20% from leaving

      const progress = Math.min(Math.max((start - sectionTop) / (start - end), 0), 1)
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section id="experience" className="py-20">
      <div className="max-w-screen-2xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-12">Experience</h2>

        <div ref={sectionRef} className="max-w-screen-xl mx-auto">
          {experience.map((exp, index) => (
            <TimelineItem
              key={`${exp.company}-${exp.role}`}
              experience={exp}
              index={index}
              isLast={index === experience.length - 1}
              isFirst={index === 0}
              scrollProgress={scrollProgress}
              totalItems={experience.length}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
