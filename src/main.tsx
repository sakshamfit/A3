import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'iconify-icon'
import { registerIcons } from './lib/icons'
import App from './App'
import './index.css'

/* Register the Solar icon data locally before first paint. */
registerIcons()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
