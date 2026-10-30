export interface Role {
  title: string
  duration: string
  description: string
}

/** One entry per company; roles newest first, so promotions stack under one heading. */
export interface Experience {
  company: string
  roles: Role[]
}

export const experience: Experience[] = [
  {
    company: 'Synkcode',
    roles: [
      {
        title: 'Project Manager',
        duration: 'Sep 2026 - Present',
        description: 'Run technical delivery across 4 client projects spanning 3 codebases. Turn client specs and architecture meetings into Jira epics and tasks, coordinate backend and frontend developers through blockers and releases, and lead triage across dev, staging, and production. Still hands-on: implemented ~40% of 84 use cases for a Dubai Customs compliance platform in Django and REST APIs.',
      },
      {
        title: 'Python Developer',
        duration: 'Feb 2026 - Sep 2026',
        description: 'Built full Arabic localization (LTR to RTL) into an English-only enterprise app without breaking the existing UI. Integrated Kafka producers and consumers across upstream ingestion and downstream analytics services, and optimized declaration-to-risk-profile matching with candidate filtering, indexing, and hashing.',
      },
    ],
  },
  {
    company: 'Galvanize Global Education',
    roles: [
      {
        title: 'Software Development Engineer I',
        duration: 'Nov 2023 - Jan 2026',
        description: 'Built an assessment platform for 2K+ learners (GRE, SAT, TOEFL, IELTS). Owned ~50% of features, built IELTS module end-to-end (~20% enrollment increase), led PHP→Django migration (~40% cost reduction, ~60% fewer defects).',
      },
    ],
  },
  {
    company: 'Self Employed',
    roles: [
      {
        title: 'Freelance Technical Trainer',
        duration: 'Jun 2023 - Sep 2023',
        description: 'Delivered training on Java, Spring Boot, C, Python, and Computer Networks to 100+ students. Designed real-world coding exercises tailored to various skill levels.',
      },
    ],
  },
  {
    company: 'Six Phrase Edutech',
    roles: [
      {
        title: 'Technical Trainer Intern',
        duration: 'Feb 2023 - Apr 2023',
        description: 'Taught DSA and Competitive Programming to 3rd and 4th-year students. Mentored 100+ students through live coding sessions and weekly assessments.',
      },
    ],
  },
]

/** Overall tenure at a company: earliest role's start to latest role's end. */
export function tenure(e: Experience): string {
  const end = e.roles[0].duration.split(' - ')[1]
  const start = e.roles[e.roles.length - 1].duration.split(' - ')[0]
  return `${start} - ${end}`
}
