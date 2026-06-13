import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initLenis } from './lib/lenis'

initLenis();

createRoot(document.getElementById('root')).render(<App />)
