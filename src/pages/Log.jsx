import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Plus, X } from 'lucide-react'
import Header from '../components/Header'
import RestTimer from '../components/RestTimer'
import { useStore, newSet, newExercise } from '../lib/store'
import { PRESETS } from '../lib/exercises'
import { exerciseNames, lastSets, volume, setCount } from '../lib/stats'
import { kgTo, fmt, unitLabel } from '../lib/units'

export default function Log() {
  const { history, active, setActive, start, discard, finish, settings } = useStore()
  const u = settings.units
  const [name, setName] = useState('')
  const [restEnd, setRestEnd] = useState(null)
  const [summary, setSummary] = useState(null)
  const [msg, setMsg] = useState('')
  const known = [...new Set([...exerciseNames(history), ...PRESETS])]

  const patch = (fn) => setActive({ ...active, exercises: fn(active.exercises) })
  const patchSet = (ei, si, p) => patch((ex) => ex.map((e, i) => (i !== ei ? e : { ...e, sets: e.sets.map((s, j) => (j === si ? { ...s, ...p } : s)) })))
  const addExercise = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    const prev = lastSets(history, name)[0] // pre-fill from last time
    patch((ex) => [...ex, newExercise(name.trim(), prev && [newSet(String(kgTo(prev.weight, u)), String(prev.reps))])])
    setName('')
  }
  const toggleDone = (ei, si) => {
    const s = active.exercises[ei].sets[si]
    if (!s.done && !(+s.reps > 0)) return setMsg('Enter the reps first.')
    setMsg(''); patchSet(ei, si, { done: !s.done })
    if (!s.done) setRestEnd(Date.now() + 90000)
  }
  const onFinish = () => {
    const r = finish()
    if (!r) return setMsg('Complete at least one set before finishing.')
    setRestEnd(null); setMsg(''); setSummary(r)
  }

  let body
  if (summary) {
    const { workout, prs } = summary
    body = (
      <div>
        <div className="p-8" style={{ background: 'var(--o)', color: '#0d0d0d' }}>
          <h1 className="display text-[clamp(3.5rem,14vw,9rem)]">{prs.length ? 'New record' : 'Done'}</h1>
          <p className="text-xl font-bold mt-4">{setCount(workout)} sets, {Math.round(kgTo(volume(workout), u)).toLocaleString()} {unitLabel(u)} total</p>
        </div>
        {prs.length > 0 && <ul className="mt-6 space-y-3">{prs.map((p) => <li key={p.exercise} className="card p-4 flex justify-between font-bold text-lg"><span>{p.exercise}</span><span style={{ color: 'var(--o)' }}>{p.type}: {fmt(p.value, u)}</span></li>)}</ul>}
        <div className="flex gap-4 mt-8"><button onClick={() => setSummary(null)} className="btn">Back to the log</button><Link to="/progress" className="btn btn-plain border-[3px]">See progress</Link></div>
      </div>
    )
  } else if (!active) {
    const last = history[0]
    body = (
      <div>
        <h1 className="display text-[clamp(4rem,16vw,11rem)]">Ready?</h1>
        <p className="text-lg mt-4" style={{ color: 'var(--muted)' }}>{last ? `Last session: ${last.name || 'Workout'}, ${new Date(last.finishedAt).toLocaleDateString()}.` : 'Your first workout starts here.'}</p>
        <div className="flex flex-wrap gap-4 mt-8"><button onClick={() => start()} className="btn text-xl">Empty workout</button><Link to="/programs" className="btn btn-plain border-[3px] text-xl">Pick a program</Link></div>
      </div>
    )
  } else {
    body = (
      <div>
        <input className="input display !text-4xl !font-black" placeholder="Workout name" value={active.name} onChange={(e) => setActive({ ...active, name: e.target.value })} aria-label="Workout name" />
        <div className="space-y-6 mt-6">
          {active.exercises.map((ex, ei) => (
            <section key={ex.id} className="card">
              <div className="flex items-center justify-between px-4 py-3 border-b-[3px] border-[var(--ink)]" style={{ background: 'var(--b)', color: '#fff' }}>
                <h2 className="display text-3xl">{ex.name}</h2>
                <button onClick={() => patch((x) => x.filter((_, i) => i !== ei))} aria-label={`Remove ${ex.name}`}><X size={22} /></button>
              </div>
              <div className="p-4 space-y-2">
                <div className="grid grid-cols-[2rem_1fr_1fr_3.2rem] gap-2 text-sm font-bold" style={{ color: 'var(--muted)' }}><span>Set</span><span>{unitLabel(u)}</span><span>Reps</span><span /></div>
                {ex.sets.map((s, si) => (
                  <div key={s.id} className="grid grid-cols-[2rem_1fr_1fr_3.2rem] gap-2 items-center" style={s.done ? { opacity: 0.6 } : {}}>
                    <b className="display text-2xl">{si + 1}</b>
                    <input className="input" inputMode="decimal" value={s.weight} onChange={(e) => patchSet(ei, si, { weight: e.target.value })} aria-label={`Set ${si + 1} weight`} />
                    <input className="input" inputMode="numeric" value={s.reps} onChange={(e) => patchSet(ei, si, { reps: e.target.value })} aria-label={`Set ${si + 1} reps`} />
                    <button onClick={() => toggleDone(ei, si)} aria-pressed={s.done} aria-label={`Complete set ${si + 1}`} className="h-12 border-[3px] border-[var(--ink)] grid place-items-center" style={s.done ? { background: 'var(--o)', color: '#0d0d0d' } : {}}>{s.done && <Check size={24} strokeWidth={4} />}</button>
                  </div>
                ))}
                <button onClick={() => patch((x) => x.map((e, i) => { if (i !== ei) return e; const l = e.sets[e.sets.length - 1]; return { ...e, sets: [...e.sets, newSet(l?.weight ?? '', l?.reps ?? '')] } }))} className="font-bold underline underline-offset-4 pt-2">Add set</button>
              </div>
            </section>
          ))}
        </div>
        <form onSubmit={addExercise} className="flex gap-3 mt-6">
          <input className="input" list="lifts" placeholder="Add an exercise" value={name} onChange={(e) => setName(e.target.value)} aria-label="Exercise name" />
          <datalist id="lifts">{known.map((n) => <option key={n} value={n} />)}</datalist>
          <button className="btn !px-4" aria-label="Add exercise"><Plus size={22} /></button>
        </form>
        <div className="flex flex-wrap gap-4 mt-10">
          <Link to="/session" className="btn">Focus mode</Link>
          <button onClick={onFinish} className="btn btn-ink text-lg">Finish workout</button>
          <button onClick={() => confirm('Discard this workout?') && (discard(), setRestEnd(null))} className="btn btn-plain border-[3px]">Discard</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header />
      <main className={`max-w-5xl mx-auto px-5 py-8 ${restEnd ? 'pb-28' : 'pb-16'}`}>
        {body}
        <p role="status" className="mt-4 font-bold min-h-6" style={{ color: 'var(--o)' }}>{msg}</p>
      </main>
      {restEnd && <RestTimer end={restEnd} onAdjust={(d) => setRestEnd(restEnd + d * 1000)} onClose={() => setRestEnd(null)} />}
    </div>
  )
}
