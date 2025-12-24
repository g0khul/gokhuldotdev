export interface Social {
  name: string
  url: string
  icon: 'github' | 'linkedin' | 'twitter' | 'email' | 'instagram'
}

export const social: Social[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/username',
    icon: 'github',
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/username',
    icon: 'linkedin',
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/username',
    icon: 'twitter',
  },
  {
    name: 'Email',
    url: 'mailto:hello@gokhul.dev',
    icon: 'email',
  },
]
