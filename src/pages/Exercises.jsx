import { useState } from 'react'
import Header from '../components/Header'
import { useStore } from '../lib/store'
import { META } from '../lib/exercises'
import { series } from '../lib/stats'
import { ExerciseMedia, watchUrl } from '../components/Doodle'
import { fmt } from '../lib/units'

const MUSCLES = ['All', ...new Set(Object.values(META).map((m) => m[0]))]

export default function Exercises() {
  const { history, settings } = useStore()
  const [q, setQ] = useState('')
  const [muscle, setMuscle] = useState('All')
  const rows = Object.entries(META).filter(([n, m]) => n.toLowerCase().includes(q.toLowerCase()) && (muscle === 'All' || m[0] === muscle))
  return (
    <div>
      <Header />
      <main className="max-w-5xl mx-auto px-5 py-8">
        <h1 className="display text-[clamp(4rem,14vw,9rem)]">Exercises</h1>
        <input className="input mt-6" placeholder="Search exercises" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search exercises" />
        <div className="flex flex-wrap gap-2 mt-4">
          {MUSCLES.map((m) => <button key={m} onClick={() => setMuscle(m)} className="border-[3px] border-[var(--ink)] px-3 py-1.5 font-bold" style={muscle === m ? { background: 'var(--o)', color: '#0d0d0d' } : {}}>{m}</button>)}
        </div>
        <ul className="grid sm:grid-cols-2 gap-5 mt-8">
          {rows.map(([name, [m, eq, cue]]) => {
            const best = Math.max(0, ...series(history, name, 'weight').map((p) => p.value))
            return (
              <li key={name} className="card">
                <div className="px-4 py-2 flex items-center justify-between border-b-[3px] border-[var(--ink)]" style={{ background: 'var(--b)', color: '#fff' }}><b className="display text-3xl">{name}</b><span className="font-bold text-sm">{m}, {eq}</span></div>
                <div className="h-44 border-b-[3px] border-[var(--ink)] overflow-hidden grid place-items-center"><ExerciseMedia name={name} /></div>
                <p className="p-4">{cue}</p>
                <a href={watchUrl(name)} target="_blank" rel="noreferrer" className="px-4 pb-4 block font-bold underline underline-offset-4">Watch technique</a>
                {best > 0 && <p className="px-4 pb-4 font-bold" style={{ color: 'var(--o)' }}>Your best: {fmt(best, settings.units)}</p>}
              </li>
            )
          })}
        </ul>
        {!rows.length && <p className="mt-8" style={{ color: 'var(--muted)' }}>Nothing matches. You can still type any exercise name when you log a workout.</p>}
      </main>
    </div>
  )
}
