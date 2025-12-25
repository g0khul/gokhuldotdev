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
    title: 'Tic Tac Toe',
    description: 'Classic game with clean UI and game logic.',
    tags: ['React', 'JavaScript', 'CSS'],
    github: 'https://github.com/g0khul/tic-tac-toe',
    live: 'https://tic-tac-toe-henna-ten-77.vercel.app/',
  },
  {
    title: 'Note App',
    description: 'Full-stack note-taking app with CRUD, reusable components, and responsive design.',
    tags: ['React', 'TypeScript', 'Tailwind', 'REST API'],
    github: 'https://github.com/g0khul/note-app',
    live: 'https://note-app-mu-indol.vercel.app/',
  },
  {
    title: 'Subnet Manager',
    description: 'Avalanche hackathon project — simplifies blockchain subnet creation and management.',
    tags: ['Flask', 'React', 'Web3'],
    github: 'https://github.com/g0khul/avalanche-subnet-launcher',
  },
  {
    title: 'Braille Translator',
    description: 'Converts text to Braille and vice versa.',
    tags: ['Flask', 'Python', 'HTML/CSS'],
    github: 'https://github.com/g0khul/BrailleTranslator',
  },
  {
    title: 'eVote System',
    description: 'Electronic voting system with secure ballot handling.',
    tags: ['Flask', 'Python', 'HTML/CSS'],
    github: 'https://github.com/g0khul/Evote',
  },
]
