import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

;(function bootstrapTheme() {
  const storageKey = 'theme'
  const root = document.documentElement
  const saved = localStorage.getItem(storageKey)

  if (saved === 'dark') {
    root.classList.add('dark')
  } else if (saved === 'light') {
    root.classList.remove('dark')
  } else {
    const prefersDark = window.matchMedia?.(
      '(prefers-color-scheme: dark)'
    ).matches
    if (prefersDark) root.classList.add('dark')
    else root.classList.remove('dark')
  }
})()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
