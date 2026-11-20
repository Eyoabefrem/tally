import { useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  const toggle = () => {
    const next = !dark
    document.documentElement.classList.toggle('dark', next)
    try { localStorage.setItem('theme', next ? 'dark' : 'light') } catch {}
    setDark(next)
  }
  return (
    <button onClick={toggle} aria-label="Switch theme" className="border-[3px] border-[var(--ink)] p-1.5 hover:bg-[var(--o)] hover:text-[#0d0d0d] transition">
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
