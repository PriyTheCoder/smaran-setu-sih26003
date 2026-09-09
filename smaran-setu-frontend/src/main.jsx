import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { AccessibilityProvider } from './context/AccessibilityContext'
import { LanguageProvider } from "./context/LanguageContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AccessibilityProvider>
        <AuthProvider>
          <LanguageProvider>
    <App />
  </LanguageProvider>
        </AuthProvider>
      </AccessibilityProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
