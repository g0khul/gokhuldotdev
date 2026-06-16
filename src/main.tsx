import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Easter egg for curious developers
console.log(
  `%cgokhul.dev`,
  'font-size: 22px; font-weight: 700; color: #6d28d9;',
)
console.log(
  `%cyou opened the console. good — that's the kind of curiosity I'd hire for.`,
  'font-size: 14px; font-weight: 600; color: #f4f4f2;',
)
console.log(
  `%c· truth over hype  · figure it out  · do a few things genuinely well`,
  'font-size: 12px; color: #8a8a85;',
)
console.log(
  `%cpoke around: type \`gokhul\` … or just email me → hello@gokhul.dev`,
  'font-size: 12px; color: #8a8a85;',
)

// a tiny reward for the truly curious
;(window as unknown as { gokhul?: () => string }).gokhul = () => {
  console.log(
    '%cgive me a lever and a place to stand. — now let\'s build something.',
    'font-size: 13px; color: #6d28d9;',
  )
  return 'hello@gokhul.dev'
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
