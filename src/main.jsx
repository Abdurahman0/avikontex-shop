import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'
import './i18n'
import App from './App.jsx'
import ScrollToTop from './components/common/ScrollToTop.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <App />
      <ToastContainer position='top-right' autoClose={2200} hideProgressBar theme='light' />
    </BrowserRouter>
  </StrictMode>
)
