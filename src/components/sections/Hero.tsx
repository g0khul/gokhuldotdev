import { useState, useEffect } from 'react'
import { personal } from '../../data/personal'
import { Button } from '../ui/Button'

function useTypewriterCycle(lines: string[], typeSpeed = 80, deleteSpeed = 40, pauseAfterType = 1000) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const currentText = lines[currentIndex]
    const isLastLine = currentIndex === lines.length - 1

    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1))
        } else if (!isLastLine) {
          // Finished typing, pause then start deleting
          setTimeout(() => setIsDeleting(true), pauseAfterType)
        } else {
          // Last line complete
          setIsComplete(true)
        }
      } else {
        // Deleting
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1))
        } else {
          // Finished deleting, move to next line
          setIsDeleting(false)
          setCurrentIndex(prev => prev + 1)
        }
      }
    }, isDeleting ? deleteSpeed : typeSpeed)

    return () => clearTimeout(timer)
  }, [displayText, currentIndex, isDeleting, lines, typeSpeed, deleteSpeed, pauseAfterType])

  return { displayText, isComplete }
}

export function Hero() {
  const lines = [`Hi, I'm ${personal.name}`, `I'm a Software Engineer`]
  const { displayText, isComplete } = useTypewriterCycle(lines, 80, 40, 1000)

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-16">
      <div className="max-w-screen-2xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          <span className="gradient-text">{displayText}</span>
          <span className={`inline-block w-[3px] h-[1em] bg-accent ml-1 align-middle ${isComplete ? 'animate-blink' : ''}`} />
        </h1>

        <p className={`text-xl md:text-2xl text-muted mb-8 transition-opacity duration-500 ${isComplete ? 'opacity-100' : 'opacity-0'}`}>
          {personal.tagline}
        </p>

        <div className={`inline-grid grid-cols-2 gap-4 transition-opacity duration-500 delay-200 ${isComplete ? 'opacity-100' : 'opacity-0'}`}>
          <Button variant="primary" className="w-full">
            <a href="#about">Know more about me</a>
          </Button>
          <Button variant="outline" className="w-full">
            <a href="#contact">Get in Touch</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
