import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { EvalProvider } from './context/EvalContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EvalProvider>
      <App />
    </EvalProvider>
  </StrictMode>,
)
