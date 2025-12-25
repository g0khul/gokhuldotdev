export interface Social {
  name: string
  url: string
  icon: 'github' | 'linkedin' | 'twitter' | 'email' | 'substack' | 'signal'
}

export const social: Social[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/g0khul',
    icon: 'github',
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/g0khul/',
    icon: 'linkedin',
  },
  {
    name: 'X',
    url: 'https://x.com/g0khul',
    icon: 'twitter',
  },
  {
    name: 'Substack',
    url: 'https://substack.com/@gokhul',
    icon: 'substack',
  },
  {
    name: 'Signal',
    url: 'https://signal.me/#eu/DOlN-aQBAPF1udxWMg15HBFS_emaFCTWryMB9OQayH3LNFA0fdVIfbRBUMLLCrvm',
    icon: 'signal',
  },
  {
    name: 'Email',
    url: 'mailto:hello@gokhul.dev',
    icon: 'email',
  },
]
