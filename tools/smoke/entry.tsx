import { createRoot } from 'react-dom/client'
import { registerIcons } from '../../src/lib/icons'
import { markGsapReady } from '../../src/lib/entrance'
import App from '../../src/App'

registerIcons()
markGsapReady()
const root = createRoot(document.getElementById('root')!)
root.render(<App />)
