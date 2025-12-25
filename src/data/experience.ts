export interface Experience {
  company: string
  role: string
  duration: string
  description: string
  technologies?: string[]
}

export const experience: Experience[] = [
  {
    company: 'Galvanize Global Education',
    role: 'Software Development Engineer I',
    duration: 'Nov 2023 - Present',
    description: 'Building an assessment platform for 2K+ learners (GRE, SAT, TOEFL, IELTS). Owned ~50% of features, built IELTS module end-to-end (~20% enrollment increase), led PHP→Django migration (~40% cost reduction, ~60% fewer defects).',
    technologies: ['Django', 'Angular', 'PostgreSQL', 'Celery', 'Redis'],
  },
  {
    company: 'Self Employed',
    role: 'Freelance Technical Trainer',
    duration: 'Jun 2023 - Sep 2023',
    description: 'Delivered training on Java, Spring Boot, C, Python, and Computer Networks to 100+ students. Designed real-world coding exercises tailored to various skill levels.',
    technologies: ['Java', 'Spring Boot', 'C', 'Python'],
  },
  {
    company: 'Six Phrase Edutech',
    role: 'Technical Trainer Intern',
    duration: 'Feb 2023 - Apr 2023',
    description: 'Taught DSA and Competitive Programming to 3rd and 4th-year students. Mentored 100+ students through live coding sessions and weekly assessments.',
    technologies: ['DSA', 'Competitive Programming', 'Java'],
  },
]
