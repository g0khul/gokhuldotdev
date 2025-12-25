export interface SkillCategory {
  name: string
  skills: string[]
}

export const skillCategories: SkillCategory[] = [
  {
    name: 'Languages',
    skills: ['Python', 'TypeScript', 'JavaScript'],
  },
  {
    name: 'Backend',
    skills: ['Django', 'Node.js', 'REST APIs', 'Celery'],
  },
  {
    name: 'Frontend',
    skills: ['Angular', 'React'],
  },
  {
    name: 'Databases',
    skills: ['PostgreSQL', 'MySQL', 'Redis'],
  },
  {
    name: 'DevOps',
    skills: ['Docker', 'Kubernetes', 'GitHub Actions', 'AWS', 'Linux'],
  },
]
