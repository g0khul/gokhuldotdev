import { useState, type FormEvent } from 'react'
import { personal } from '../../data/personal'
import { Button } from '../ui/Button'
import { Input, Textarea } from '../ui/Input'

export function Contact() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // For static site, open mailto link with form data
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const name = formData.get('name')
    const email = formData.get('email')
    const message = formData.get('message')

    const subject = `Portfolio Contact from ${name}`
    const body = `From: ${name}\nEmail: ${email}\n\n${message}`

    window.location.href = `mailto:${personal.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSubmitted(true)
  }

  return (
    <section id="contact" className="py-20">
      <div className="max-w-xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
        <p className="text-muted mb-8">
          Have a project in mind? Let's work together.
        </p>

        {submitted ? (
          <div className="card p-8 text-center">
            <p className="text-lg mb-2">Thanks for reaching out!</p>
            <p className="text-muted">Your email client should have opened. If not, email me directly at{' '}
              <a href={`mailto:${personal.email}`} className="text-accent hover:underline">
                {personal.email}
              </a>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
        )}
      </div>
    </section>
  )
}
