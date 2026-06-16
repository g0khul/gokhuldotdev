import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Easter egg for curious developers
console.log(
  `%cgokhul`,
  'font-size: 22px; font-weight: 700; color: #6d28d9;',
)
console.log(
  `%cif you've poked around in here, we'd probably get along. let's connect.`,
  'font-size: 14px; font-weight: 600; color: #f4f4f2;',
)
console.log(
  `%c→ hello@gokhul.dev   ·   type gokhul() to say hi`,
  'font-size: 12px; color: #8a8a85;',
)

// a tiny reward for the truly curious
;(window as unknown as { gokhul?: () => string }).gokhul = () => {
  console.log(
    '%clet\'s build something. → hello@gokhul.dev',
    'font-size: 13px; color: #6d28d9;',
  )
  return 'hello@gokhul.dev'
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
