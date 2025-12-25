export interface KilledProject {
  name: string
  url: string
  reason: string
}

export const killed: KilledProject[] = [
  {
    name: 'Hashnode Blog',
    url: 'https://gokhul.hashnode.dev/',
    reason: 'Skill issue',
  },
  {
    name: 'Greathack Substack',
    url: 'https://greathack.substack.com/',
    reason: 'Consistency issue',
  },
]
