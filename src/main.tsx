import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Easter egg for curious developers
console.log(
  `%c👀 I see you looking at my code...`,
  'font-size: 15px; font-weight: bold; color: #8b5cf6;'
)
console.log(
  `%cLike what you see? Let's chat: hello@gokhul.dev`,
  'font-size: 14px; color: #a3a3a3;'
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
