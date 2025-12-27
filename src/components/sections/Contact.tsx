import { social } from '../../data/social'
import { FaGithub, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'
import { SiSubstack, SiSignal } from 'react-icons/si'
import { HiOutlineMail } from 'react-icons/hi'
import type { IconType } from 'react-icons'

const icons: Record<string, IconType> = {
  github: FaGithub,
  linkedin: FaLinkedinIn,
  twitter: FaXTwitter,
  email: HiOutlineMail,
  substack: SiSubstack,
  signal: SiSignal,
}

export function Contact() {
  // Filter out email from social links (we'll show it separately)
  const socialLinks = social.filter((item) => item.icon !== 'email')

  return (
    <section id="contact" className="py-20">
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Get in Touch</h2>
          <p className="text-muted text-lg mb-6">
            Open for opportunities. Whether you're hiring, have a project idea, or want to build something together, let's talk.
          </p>

          {/* Email */}
          <p className="text-lg mb-8">
            Say hello to{' '}
            <a
              href="mailto:hello@gokhul.dev"
              className="text-accent hover:underline font-medium"
            >
              hello@gokhul.dev
            </a>
          </p>

          {/* Social Links */}
          <div className="flex flex-wrap justify-center gap-4">
            {socialLinks.map((item) => {
              const Icon = icons[item.icon]
              return (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-default text-muted hover:text-accent hover:border-accent transition-colors"
                >
                  {Icon && <Icon size={18} />}
                  <span className="text-sm font-medium">{item.name}</span>
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
