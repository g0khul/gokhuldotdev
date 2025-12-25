export interface BuildingProject {
  name: string
  role: string
  status: string
  description: string
  highlights: string[]
  technologies: string[]
}

export const building: BuildingProject = {
  name: 'CareerByteCode',
  role: 'Backend & Platform Engineer',
  status: 'Pre-launch',
  description: 'Designing and building a backend system from scratch — API design, database schemas, deployment pipelines, and infrastructure.',
  highlights: [
    'Node.js backend with modular monolithic architecture',
    'Kubernetes deployment on Civo (staging + production)',
    'CI/CD via GitHub Actions, PostgreSQL on Neon, Redis caching',
    'API latency < 300ms, infra costs < $100/month',
  ],
  technologies: ['Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Kubernetes', 'Docker', 'GitHub Actions', 'Cloudflare'],
}
