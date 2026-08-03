import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// Değişken fontlar yerel olarak paketlenir — dış istek yok, FOUT kontrollü.
import '@fontsource-variable/sora'
import '@fontsource-variable/inter'
import './styles/index.css'

import App from './App'
import { ErrorBoundary } from './components/common/ErrorBoundary'

const container = document.getElementById('root')

if (!container) {
  throw new Error('#root elemanı bulunamadı.')
}

createRoot(container).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
