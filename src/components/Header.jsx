import { Link, NavLink } from 'react-router-dom'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import { useStore } from '../lib/store'
import { useAuth } from '../lib/auth'
import { configured } from '../lib/supabase'

const tabs = [['/today', 'Today'], ['/programs', 'Programs'], ['/log', 'Workout'], ['/history', 'History'], ['/progress', 'Progress'], ['/body', 'Body'], ['/insights', 'Insights'], ['/exercises', 'Exercises'], ['/settings', 'Settings']]
const tab = ({ isActive }) => `shrink-0 px-4 py-3 font-bold border-b-4 ${isActive ? 'border-[var(--o)]' : 'border-transparent hover:border-[var(--ink)]'}`

export default function Header() {
  const { active } = useStore()
  const { user } = useAuth()
  return (
    <header className="border-b-[3px] border-[var(--ink)]">
      <div className="max-w-5xl mx-auto px-5 pt-4 flex items-center justify-between gap-3">
        <Link to="/"><Logo /></Link>
        <span className="flex items-center gap-3">
          {active && <Link to="/session" className="btn !py-1.5 !px-3 text-sm !shadow-none">Resume</Link>}
          {configured && !user && <Link to="/login" className="font-bold underline underline-offset-4">Log in</Link>}
          <ThemeToggle />
        </span>
      </div>
      <nav className="max-w-5xl mx-auto px-2 mt-2 flex overflow-x-auto" aria-label="Main">
        {tabs.map(([to, label]) => <NavLink key={to} to={to} className={tab}>{label}</NavLink>)}
      </nav>
    </header>
  )
}
