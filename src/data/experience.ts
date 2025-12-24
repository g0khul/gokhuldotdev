export interface Experience {
  company: string
  role: string
  duration: string
  description: string
  technologies?: string[]
}

export const experience: Experience[] = [
  {
    company: 'Company Name',
    role: 'Senior Developer',
    duration: '2023 - Present',
    description: 'Led development of core platform features, mentored junior developers, and improved system performance by 40%.',
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
  },
  {
    company: 'Previous Company',
    role: 'Full Stack Developer',
    duration: '2021 - 2023',
    description: 'Built and maintained multiple client-facing applications, implemented CI/CD pipelines, and collaborated with cross-functional teams.',
    technologies: ['Vue.js', 'Python', 'Docker', 'AWS'],
  },
  {
    company: 'Startup Inc',
    role: 'Junior Developer',
    duration: '2020 - 2021',
    description: 'Developed responsive web interfaces, integrated third-party APIs, and contributed to mobile app development.',
    technologies: ['JavaScript', 'React Native', 'Firebase'],
  },
]
