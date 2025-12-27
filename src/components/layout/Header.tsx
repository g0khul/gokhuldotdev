import { useState, useEffect } from 'react'
import { ThemeToggle } from '../ui/ThemeToggle'

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
]

function Logo() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="group"
    >
      <defs>
        <linearGradient id="mobius-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-accent-dark)" />
          <stop offset="50%" stopColor="var(--color-accent)" />
          <stop offset="100%" stopColor="var(--color-accent-light)" />
        </linearGradient>
      </defs>
      {/* Möbius strip - twisted infinity shape */}
      <g className="animate-mobius" style={{ transformOrigin: 'center' }}>
        {/* Back part of the strip */}
        <path
          d="M20 50 C20 35, 35 25, 50 35 C65 45, 80 35, 80 50 C80 65, 65 75, 50 65 C35 55, 20 65, 20 50"
          stroke="var(--color-border)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        {/* Front part of the strip with gradient */}
        <path
          d="M20 50 C20 35, 35 25, 50 35 C65 45, 80 35, 80 50"
          stroke="url(#mobius-gradient)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M80 50 C80 65, 65 75, 50 65 C35 55, 20 65, 20 50"
          stroke="url(#mobius-gradient)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="80"
          strokeDashoffset="0"
          className="animate-mobius-flow"
        />
      </g>
    </svg>
  )
}

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Track active section with Intersection Observer
  useEffect(() => {
    const sectionIds = navLinks.map(link => link.href.replace('#', ''))
    const observers: IntersectionObserver[] = []

    sectionIds.forEach(id => {
      const element = document.getElementById(id)
      if (!element) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setActiveSection(id)
            }
          })
        },
        { rootMargin: '-50% 0px -50% 0px' }
      )

      observer.observe(element)
      observers.push(observer)
    })

    return () => observers.forEach(obs => obs.disconnect())
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-primary/80 backdrop-blur-md border-b border-default'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <Logo />
        </a>

        <div className="flex items-center gap-8">
          <ul className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '')
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`text-sm transition-colors ${
                      isActive
                        ? 'text-accent font-medium'
                        : 'text-muted hover:text-primary'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>

          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
