# Gokhul.dev My Personal Portfolio

A modern, Obsidian inspired personal website and knowledge management workspace built with React, TypeScript, and Vite.

## About

Gokhul.dev is a personal portfolio and digital workspace that combines the power of modern web technologies with the intuitive, graph based note taking experience inspired by [Obsidian](https://obsidian.md). It serves as both a showcase of work and a functional knowledge management system for exploring ideas, projects, and connections.

**Design Philosophy:** This project draws inspiration from [Obsidian's](https://obsidian.md) elegant interface and powerful linking capabilities, reimagined as a web first experience with interactive graph visualizations, command palette navigation, and a responsive workspace interface.

## Features

- 📝 **Note-based workspace**: Create, organize, and view notes in a clean, distraction-free environment
- 🕸️ **Graph visualization**: See connections between notes and explore relationships visually
- ⌨️ **Command palette**: Quick navigation and actions using keyboard shortcuts (Obsidian-style)
- 🎨 **Responsive design**: Seamless experience across desktop and mobile devices
- 📊 **Analytics**: Integrated with Vercel Analytics for performance monitoring
- ⚡ **Fast & optimized**: Built with Vite for instant HMR and lightning-fast builds

## Tech Stack

- **Frontend:** React 19 + TypeScript
- **Build tool:** Vite 8
- **Styling:** Tailwind CSS 4
- **Deployment:** Vercel
- **Monitoring:** Vercel Analytics & Speed Insights
- **Icons:** React Icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/gokhuldotdev.git
cd gokhuldotdev
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:5173`

## Available Commands

```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Run ESLint to check code quality
npm run lint

# Preview production build locally
npm run preview
```

## Project Structure

```
src/
├── workspace/          # Core workspace components
│   ├── WorkspaceShell.tsx    # Main workspace container
│   ├── Sidebar.tsx           # Navigation sidebar
│   ├── NoteView.tsx          # Note rendering component
│   ├── Graph.tsx             # Graph visualization
│   ├── CommandPalette.tsx    # Command palette/search
│   └── ...
├── App.tsx            # Main application component
└── main.tsx           # Entry point
```

## Performance

The site includes:
- **Vercel Analytics** for tracking user behavior
- **Speed Insights** for monitoring Core Web Vitals
- Optimized builds with TypeScript strict mode
- Fast refresh during development with Vite

## Deployment

This project is deployed on [Vercel](https://vercel.com). Simply connect your GitHub repository to Vercel for automatic deployments on every push.

## License

This project is open source and available under the MIT License.

## Connect

- Portfolio: [gokhul.dev](https://gokhul.dev)
- GitHub: [@gokhul](https://github.com/g0khul)
- X: [@gokhul](https://x.com/g0khul)

---

Built with ❤️ using [React](https://react.dev) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev), inspired by [Obsidian](https://obsidian.md)
