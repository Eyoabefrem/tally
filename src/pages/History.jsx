import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import Header from '../components/Header'
import { useStore } from '../lib/store'
import { volume, setCount } from '../lib/stats'
import { kgTo, unitLabel } from '../lib/units'
import Doodle from '../components/Doodle'

export default function History() {
  const { history, remove, settings } = useStore()
  const u = settings.units
  return (
    <div>
      <Header />
      <main className="max-w-5xl mx-auto px-5 py-8">
        <h1 className="display text-[clamp(4rem,14vw,9rem)]">History</h1>
        {!history.length ? (
          <div className="card p-10 mt-8 text-center"><div className="w-40 mx-auto"><Doodle move="squat" /></div><p className="display text-4xl">No workouts yet</p><Link to="/log" className="btn mt-6">Start one</Link></div>
        ) : (
          <ul className="mt-8 space-y-4">
            {history.map((h) => (
              <li key={h.id} className="card">
                <details>
                  <summary className="p-4 cursor-pointer list-none flex flex-wrap items-center justify-between gap-2">
                    <span><b className="display text-3xl block">{h.name || 'Workout'}</b><span style={{ color: 'var(--muted)' }}>{new Date(h.finishedAt).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span></span>
                    <b>{setCount(h)} sets, {Math.round(kgTo(volume(h), u)).toLocaleString()} {unitLabel(u)}</b>
                  </summary>
                  <div className="px-4 pb-4 border-t-[3px] border-[var(--ink)] pt-4 space-y-3">
                    {h.exercises.map((e) => <p key={e.id}><b>{e.name}</b><span className="block" style={{ color: 'var(--muted)' }}>{e.sets.map((s) => `${kgTo(s.weight, u)} x ${s.reps}`).join('   ')}</span></p>)}
                    <button onClick={() => confirm('Delete this workout?') && remove(h.id)} className="flex items-center gap-1.5 font-bold underline underline-offset-4"><Trash2 size={16} />Delete workout</button>
                  </div>
                </details>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
