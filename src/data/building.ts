export interface BuildingProject {
  name: string
  url: string
  role: string
  status: string
  description: string
  highlights: string[]
  technologies: string[]
}

/** Only worthy, live, actively maintained work belongs here. */
export const building: BuildingProject[] = [
  {
    name: 'CareerByteCode',
    url: 'https://careerbytecode.com',
    role: 'Backend & Platform Engineer',
    status: 'Live',
    description:
      'I built and run the backend, taking it from zero to one solo. API design, database schemas, deployment pipelines, and the infrastructure underneath it all.',
    highlights: [
      'Node.js backend on a modular monolithic architecture, with modular APIs, schemas, and core platform services',
      'Running on Kubernetes (Civo) with separate production and staging environments, load balancing, and fault tolerance',
      'CI/CD via GitHub Actions, PostgreSQL on Neon, Redis caching, and CDN based delivery',
      'Holds sub 300ms API latency at under $100 a month in infrastructure cost',
    ],
    technologies: ['Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Kubernetes', 'Docker', 'GitHub Actions', 'Cloudflare'],
  },
]
