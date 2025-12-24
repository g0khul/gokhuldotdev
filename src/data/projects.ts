export interface Project {
  title: string
  description: string
  tags: string[]
  github?: string
  live?: string
  image?: string          // Landscape image for desktop (1280x720 - 16:9)
  imageMobile?: string    // Portrait image for mobile (720x1280 - 9:16)
}

export const projects: Project[] = [
  {
    title: 'Project One',
    description: 'A full-stack web application with real-time features and modern UI.',
    tags: ['React', 'Node.js', 'WebSocket', 'MongoDB'],
    github: 'https://github.com/username/project-one',
    live: 'https://project-one.vercel.app',
  },
  {
    title: 'Project Two',
    description: 'Mobile-first e-commerce platform with payment integration.',
    tags: ['Next.js', 'Stripe', 'Tailwind', 'PostgreSQL'],
    github: 'https://github.com/username/project-two',
    live: 'https://project-two.vercel.app',
  },
  {
    title: 'Project Three',
    description: 'CLI tool for automating development workflows.',
    tags: ['TypeScript', 'Node.js', 'CLI'],
    github: 'https://github.com/username/project-three',
  },
  {
    title: 'Project Four',
    description: 'Open source library for handling complex state management.',
    tags: ['TypeScript', 'React', 'State Management'],
    github: 'https://github.com/username/project-four',
  },
]
