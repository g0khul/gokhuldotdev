import ticTacToeMobile from '../assets/projects/tic-tac-toe/tic-tac-toe-mobile.png'
import ticTacToeDesktop from '../assets/projects/tic-tac-toe/tic-tac-toe-desktop.png'
import noteAppMobile from '../assets/projects/note-app/note-app-mobile.png'
import noteAppDesktop from '../assets/projects/note-app/note-app-desktop.png'
import evoteDesktop from '../assets/projects/evote/evote-desktop.png'
import evoteMobile from '../assets/projects/evote/evote-mobile.png'
import brailleTranslatorDesktop from '../assets/projects/braille-translator/braille-translator-desktop.png'
import brailleTranslatorMobile from '../assets/projects/braille-translator/braille-translator-mobile.png'

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
    image: ticTacToeDesktop,
    imageMobile: ticTacToeMobile,
  },
  {
    title: 'Note App',
    description: 'Full-stack note-taking app with CRUD, reusable components, and responsive design.',
    tags: ['React', 'TypeScript', 'Tailwind', 'REST API'],
    github: 'https://github.com/g0khul/note-app',
    live: 'https://note-app-mu-indol.vercel.app/',
    image: noteAppDesktop,
    imageMobile: noteAppMobile,
  },
  {
    title: 'Braille Translator',
    description: 'Converts text to Braille and vice versa.',
    tags: ['Flask', 'Python', 'HTML/CSS'],
    github: 'https://github.com/g0khul/BrailleTranslator',
    image: brailleTranslatorDesktop,
    imageMobile: brailleTranslatorMobile,
  },
  {
    title: 'eVote System',
    description: 'Electronic voting system with secure ballot handling.',
    tags: ['Flask', 'Python', 'HTML/CSS'],
    github: 'https://github.com/g0khul/Evote',
    image: evoteDesktop,
    imageMobile: evoteMobile,
  },
]
