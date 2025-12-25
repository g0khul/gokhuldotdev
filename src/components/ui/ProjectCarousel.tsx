import { useRef, useState, useEffect, useCallback } from 'react'
import type { Project } from '../../data/projects'

interface ProjectCarouselProps {
  projects: Project[]
}

const DEFAULT_IMAGE_DESKTOP = '/1280x720.svg'
const DEFAULT_IMAGE_MOBILE = '/720x1280.svg'

export function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const isAnimating = useRef(false)
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null)
  const isPausedRef = useRef(false)
  const AUTO_PLAY_DELAY = 5000 // 5 seconds

  const totalProjects = projects.length

  // Reset auto-play timer
  const resetAutoPlay = useCallback(() => {
    if (autoPlayTimer.current) {
      clearTimeout(autoPlayTimer.current)
    }
    if (isPausedRef.current) return

    autoPlayTimer.current = setTimeout(() => {
      setCurrentIndex(prev => {
        const next = prev >= totalProjects - 1 ? 0 : prev + 1
        return next
      })
    }, AUTO_PLAY_DELAY)
  }, [totalProjects])

  // Pause on hover
  const handleMouseEnter = () => {
    isPausedRef.current = true
    if (autoPlayTimer.current) {
      clearTimeout(autoPlayTimer.current)
    }
  }

  const handleMouseLeave = () => {
    isPausedRef.current = false
    resetAutoPlay()
  }

  // Scroll to specific card index (with circular wrap)
  const scrollToIndex = useCallback((index: number) => {
    const container = containerRef.current
    if (!container || isAnimating.current) return

    const cards = container.querySelectorAll('[data-card]')
    if (cards.length === 0) return

    // Wrap around for circular scroll
    let wrappedIndex = index
    if (index < 0) {
      wrappedIndex = totalProjects - 1
    } else if (index >= totalProjects) {
      wrappedIndex = 0
    }

    const card = cards[wrappedIndex] as HTMLElement
    if (!card) return

    isAnimating.current = true

    const containerRect = container.getBoundingClientRect()
    const cardRect = card.getBoundingClientRect()

    // Calculate scroll position to center the card
    const scrollLeft = card.offsetLeft - (containerRect.width - cardRect.width) / 2

    container.scrollTo({
      left: scrollLeft,
      behavior: 'smooth'
    })

    setCurrentIndex(wrappedIndex)

    // Reset animation lock after scroll completes
    setTimeout(() => {
      isAnimating.current = false
    }, 500)

    // Reset auto-play timer on manual navigation
    resetAutoPlay()
  }, [totalProjects, resetAutoPlay])

  // Handle wheel scroll - only respond to horizontal scroll
  const handleWheel = useCallback((e: WheelEvent) => {
    // Only intercept if horizontal scroll is dominant (trackpad horizontal swipe)
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 30) {
      e.preventDefault()

      if (isAnimating.current) return

      if (e.deltaX > 0) {
        scrollToIndex(currentIndex + 1)
      } else {
        scrollToIndex(currentIndex - 1)
      }
    }
    // Let vertical scrolls pass through to the page
  }, [currentIndex, scrollToIndex])

  // Touch handling for mobile
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (isAnimating.current) return

    const deltaX = touchStartX.current - e.changedTouches[0].clientX
    const deltaY = touchStartY.current - e.changedTouches[0].clientY

    // Only trigger if horizontal swipe is dominant
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        scrollToIndex(currentIndex + 1)
      } else {
        scrollToIndex(currentIndex - 1)
      }
    }
  }, [currentIndex, scrollToIndex])

  // Add wheel listener
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  // Initialize to first card and start auto-play
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToIndex(0)
      resetAutoPlay()
    }, 100)
    return () => {
      clearTimeout(timer)
      if (autoPlayTimer.current) {
        clearTimeout(autoPlayTimer.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-scroll when currentIndex changes
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const cards = container.querySelectorAll('[data-card]')
    if (cards.length === 0) return

    const card = cards[currentIndex] as HTMLElement
    if (!card) return

    const containerRect = container.getBoundingClientRect()
    const cardRect = card.getBoundingClientRect()
    const scrollLeft = card.offsetLeft - (containerRect.width - cardRect.width) / 2

    container.scrollTo({
      left: scrollLeft,
      behavior: 'smooth'
    })

    resetAutoPlay()
  }, [currentIndex, resetAutoPlay])

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Carousel Container */}
      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-hidden px-6"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {projects.map((project, index) => (
          <div
            key={`${project.title}-${index}`}
            data-card
            className={`flex-shrink-0 w-[80vw] sm:w-[70vw] md:w-[60vw] lg:w-[50vw] xl:w-[45vw] 2xl:w-[40vw] max-w-[1000px] transition-all duration-500 ${
              index === currentIndex
                ? 'opacity-100 scale-100'
                : 'opacity-50 scale-95'
            }`}
          >
            {/* Image Container */}
            <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-2xl aspect-[9/16] md:aspect-[16/9]">
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

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5">
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

                <h3 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-white mb-1 tracking-tight leading-tight">
                  {project.title}
                </h3>

                <p className="text-white/70 text-xs mb-3 line-clamp-2 leading-relaxed md:hidden">
                  {project.description}
                </p>

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

            <div className="hidden md:block pt-3 px-1">
              <p className="text-muted text-sm mb-2 line-clamp-2 leading-relaxed">
                {project.description}
              </p>
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

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-accent w-6'
                : 'bg-zinc-300 dark:bg-zinc-600 hover:bg-zinc-400 dark:hover:bg-zinc-500'
            }`}
            aria-label={`Go to project ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
