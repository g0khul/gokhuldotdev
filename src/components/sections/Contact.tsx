import { useState, useEffect, type FormEvent } from 'react'
import { personal } from '../../data/personal'
import { Button } from '../ui/Button'
import { Input, Textarea } from '../ui/Input'

const COOLDOWN_MS = 30 * 60 * 1000 // 30 minutes

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function Contact() {
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)

  useEffect(() => {
    const checkCooldown = () => {
      const lastSubmit = localStorage.getItem('contact-submitted')
      if (lastSubmit) {
        const elapsed = Date.now() - parseInt(lastSubmit, 10)
        if (elapsed < COOLDOWN_MS) {
          setTimeLeft(COOLDOWN_MS - elapsed)
          setShowThankYou(true)
        } else {
          if (showThankYou) {
            setIsTransitioning(true)
            setTimeout(() => {
              setShowThankYou(false)
              setTimeLeft(null)
              localStorage.removeItem('contact-submitted')
              setTimeout(() => setIsTransitioning(false), 50)
            }, 500)
          } else {
            setTimeLeft(null)
            localStorage.removeItem('contact-submitted')
          }
        }
      }
    }

    checkCooldown()
    const interval = setInterval(checkCooldown, 1000)
    return () => clearInterval(interval)
  }, [showThankYou])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const name = formData.get('name')
    const email = formData.get('email')
    const message = formData.get('message')

    const subject = `Portfolio Contact from ${name}`
    const body = `From: ${name}\nEmail: ${email}\n\n${message}`

    window.location.href = `mailto:${personal.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    localStorage.setItem('contact-submitted', Date.now().toString())

    setIsTransitioning(true)
    setTimeout(() => {
      setTimeLeft(COOLDOWN_MS)
      setShowThankYou(true)
      setTimeout(() => setIsTransitioning(false), 50)
    }, 500)
  }

  return (
    <section id="contact" className="py-20">
      <div className="max-w-screen-2xl mx-auto px-6 relative min-h-[400px]">
        {/* Thank You View */}
        <div
          className={`max-w-xl mx-auto text-center transition-all duration-500 ${
            showThankYou && !isTransitioning
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4 pointer-events-none absolute inset-x-0'
          }`}
        >
          <div className="bg-surface border border-default rounded-xl p-12">
            <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
            <p className="text-muted text-lg mb-6">
              I've received your message and will get back to you as soon as possible.
            </p>
            <div className="mb-4">
              <p className="text-sm text-muted mb-2">You can send another message in</p>
              <p className="text-4xl font-mono font-bold text-accent">
                {timeLeft ? formatTime(timeLeft) : '0:00'}
              </p>
            </div>
          </div>
        </div>

        {/* Form View */}
        <div
          className={`max-w-5xl mx-auto transition-all duration-500 ${
            !showThankYou && !isTransitioning
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4 pointer-events-none absolute inset-x-0'
          }`}
        >
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Left side - Text */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Get in Touch</h2>
              <p className="text-muted text-lg mb-6">
                Open for opportunities.
              </p>
              <p className="text-muted">
                Whether you're hiring, have a project idea, or want to build something together, let's talk.
              </p>
            </div>

            {/* Right side - Form */}
            <div className="flex-1 w-full max-w-md">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <Input
                  label="Name"
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  required
                />

                <Input
                  label="Email"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                />

                <Textarea
                  label="Message"
                  id="message"
                  name="message"
                  placeholder="Tell me about your project..."
                  required
                />

                <Button type="submit" variant="primary">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
