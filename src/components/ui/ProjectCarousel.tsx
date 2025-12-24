import { useRef, useEffect, useCallback } from 'react'
import type { Project } from '../../data/projects'

interface ProjectCarouselProps {
  projects: Project[]
}

const DEFAULT_IMAGE_DESKTOP = '/1280x720.svg'
const DEFAULT_IMAGE_MOBILE = '/720x1280.svg'

export function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isCheckingRef = useRef(false)

  // Triple the projects for infinite scroll
  const extendedProjects = [...projects, ...projects, ...projects]
  const totalOriginal = projects.length

  // Initialize to middle set
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const timer = setTimeout(() => {
      const cards = container.querySelectorAll('[data-card]')
      if (cards.length > totalOriginal) {
        const firstMiddleCard = cards[totalOriginal] as HTMLElement
        if (firstMiddleCard) {
          container.scrollLeft = firstMiddleCard.offsetLeft - 4
        }
      }
    }, 50)

    return () => clearTimeout(timer)
  }, [totalOriginal])

  // Check and reposition for infinite scroll
  const checkInfiniteLoop = useCallback(() => {
    if (isCheckingRef.current) return
    const container = containerRef.current
    if (!container) return

    isCheckingRef.current = true

    const cards = container.querySelectorAll('[data-card]')
    if (cards.length === 0) {
      isCheckingRef.current = false
      return
    }

    const firstCard = cards[0] as HTMLElement
    const cardWidth = firstCard.offsetWidth + 4 // include gap

    const scrollLeft = container.scrollLeft
    const maxScroll = container.scrollWidth - container.clientWidth

    // If scrolled to the start (first set), jump to middle set
    if (scrollLeft < cardWidth * totalOriginal * 0.5) {
      container.scrollLeft = scrollLeft + (cardWidth * totalOriginal)
    }
    // If scrolled to the end (last set), jump to middle set
    else if (scrollLeft > maxScroll - (cardWidth * totalOriginal * 0.5)) {
      container.scrollLeft = scrollLeft - (cardWidth * totalOriginal)
    }

    isCheckingRef.current = false
  }, [totalOriginal])

  // Check on scroll
  const handleScroll = useCallback(() => {
    checkInfiniteLoop()
  }, [checkInfiniteLoop])

  return (
    <div
      ref={containerRef}
      className="flex gap-1 md:gap-2 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing select-none"
      style={{ paddingLeft: '4px', paddingRight: '4px' }}
      onScroll={handleScroll}
    >
      {extendedProjects.map((project, index) => (
        <div
          key={`${project.title}-${index}`}
          data-card
          className="flex-shrink-0 w-[75vw] sm:w-[70vw] md:w-[60vw] lg:w-[50vw] xl:w-[45vw] 2xl:w-[40vw] max-w-[1000px]"
        >
          {/* Image Container - Responsive aspect ratio */}
          <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-2xl aspect-[9/16] md:aspect-[16/9]">
            {/* Responsive Picture Element */}
            <picture>
              <source
                media="(max-width: 767px)"
                srcSet={project.imageMobile || DEFAULT_IMAGE_MOBILE}
              />
              <source
                media="(min-width: 768px)"
                srcSet={project.image || DEFAULT_IMAGE_DESKTOP}
              />
              <img
                src={project.image || DEFAULT_IMAGE_DESKTOP}
                alt={project.title}
                className="w-full h-full object-cover pointer-events-none"
                draggable={false}
              />
            </picture>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            {/* Content Overlay - Title & Links on image */}
            <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5">
              {/* Tags - Mobile only */}
              <div className="flex flex-wrap gap-1.5 mb-2 md:hidden">
                {project.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-sm text-white/90"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-white mb-1 tracking-tight leading-tight">
                {project.title}
              </h3>

              {/* Description - Mobile only */}
              <p className="text-white/70 text-xs mb-3 line-clamp-2 leading-relaxed md:hidden">
                {project.description}
              </p>

              {/* Links */}
              <div className="flex items-center gap-2">
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 transition-all"
                  >
                    View Live
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs font-semibold hover:bg-white/25 transition-all flex items-center gap-1.5"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                    Code
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Content Below Image - Desktop only (description & tags) */}
          <div className="hidden md:block pt-3 px-1">
            {/* Description */}
            <p className="text-muted text-sm mb-2 line-clamp-2 leading-relaxed">
              {project.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium px-2.5 py-1 rounded-full bg-surface text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
