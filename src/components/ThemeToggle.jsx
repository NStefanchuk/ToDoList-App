import { useEffect, useState } from 'react'
import { HiMoon, HiSun } from 'react-icons/hi2'

const STORAGE_KEY = 'theme'

export default function ThemeToggle({ className = '' }) {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  )

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
      localStorage.setItem(STORAGE_KEY, 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem(STORAGE_KEY, 'light')
    }
  }, [isDark])

  return (
    <button
      type="button"
      className={`btn-ghost border flex items-center gap-2 ${className}`}
      onClick={() => setIsDark((v) => !v)}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {isDark ? <HiMoon className="w-5 h-5" /> : <HiSun className="w-5 h-5" />}
      <span className="muted">{isDark ? 'Dark' : 'Light'}</span>
    </button>
  )
}
