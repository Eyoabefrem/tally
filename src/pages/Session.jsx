import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, Check } from 'lucide-react'
import Header from '../components/Header'
import Doodle, { moveFor, watchUrl } from '../components/Doodle'
import { kgTo, fmt, unitLabel, stepFor, PLATES } from '../lib/units'
import { useStore } from '../lib/store'
import { lastSets, plates, volume, setCount } from '../lib/stats'

const Stepper = ({ label, value, step, onChange }) => (
  <div>
    <p className="font-bold mb-2">{label}</p>
    <div className="flex border-[3px] border-[var(--ink)]">
      <button onClick={() => onChange(String(Math.max(0, +((+value || 0) - step).toFixed(2))))} aria-label={`Decrease ${label}`} className="w-14 sm:w-16 grid place-items-center hover:bg-[var(--o)] hover:text-[#0d0d0d]"><Minus size={24} /></button>
      <input value={value} onChange={(e) => onChange(e.target.value)} inputMode="decimal" aria-label={label} className="flex-1 min-w-0 text-center display text-6xl bg-[var(--card)] outline-none py-2" />
      <button onClick={() => onChange(String(+((+value || 0) + step).toFixed(2)))} aria-label={`Increase ${label}`} className="w-14 sm:w-16 grid place-items-center hover:bg-[var(--o)] hover:text-[#0d0d0d]"><Plus size={24} /></button>
    </div>
  </div>
)

function Rest({ rest, setRest, beep }) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 200); return () => clearInterval(t) }, [])
  const left = Math.max(0, Math.ceil((rest.end - now) / 1000))
  useEffect(() => { if (left === 0) { beep(); setRest(null) } }, [left])
  const C = 2 * Math.PI * 54
  return (
    <div className="p-6 text-center" style={{ background: 'var(--b)', color: '#fff' }}>
      <p className="font-bold text-lg">Rest</p>
      <div className="relative w-60 mx-auto my-4">
        <svg viewBox="0 0 120 120" className="-rotate-90" aria-hidden="true">
          <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="10" />
          <circle cx="60" cy="60" r="54" fill="none" stroke="#ff4a1c" strokeWidth="10" strokeDasharray={C} strokeDashoffset={C * (1 - left / rest.total)} />
        </svg>
        <span role="timer" className="absolute inset-0 grid place-items-center display text-7xl tabular-nums">{Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}</span>
      </div>
      <p className="font-semibold">Next: {rest.next.name}, set {rest.next.si + 1}</p>
      <div className="flex justify-center gap-3 mt-5 font-bold">
        <button onClick={() => setRest({ ...rest, end: rest.end - 15000 })} className="border-[3px] border-white px-4 py-2">-15s</button>
        <button onClick={() => setRest({ ...rest, end: rest.end + 15000, total: rest.total + 15 })} className="border-[3px] border-white px-4 py-2">+15s</button>
        <button onClick={() => setRest(null)} className="border-[3px] border-[#0d0d0d] bg-[#0d0d0d] px-4 py-2">Skip</button>
      </div>
    </div>
  )
}

export default function Session() {
  const { active, setActive, finish, history, settings, saveRoutine } = useStore()
  const u = settings.units
  const audio = useRef(null)
  const [focus, setFocus] = useState(null)
  const [rest, setRest] = useState(null)
  const [result, setResult] = useState(null)
  const [showPlates, setShowPlates] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => { let lock; navigator.wakeLock?.request('screen').then((l) => { lock = l }).catch(() => {}); return () => lock?.release?.() }, [])
  const beep = () => {
    try {
      if (settings.sound && audio.current) {
        const c = audio.current, o = c.createOscillator(), g = c.createGain()
        o.connect(g); g.connect(c.destination); o.frequency.value = 880; g.gain.value = 0.15; o.start(); o.stop(c.currentTime + 0.25)
      }
      navigator.vibrate?.(250)
    } catch {}
  }

  if (result) {
    return (
      <div><Header /><main className="max-w-5xl mx-auto px-5 py-8">
        <div className="p-8" style={{ background: 'var(--o)', color: '#0d0d0d' }}>
          <h1 className="display text-[clamp(3.5rem,14vw,9rem)]">{result.prs.length ? 'New record' : 'Done'}</h1>
          <p className="text-xl font-bold mt-4">{setCount(result.workout)} sets, {Math.round(kgTo(volume(result.workout), u)).toLocaleString()} {unitLabel(u)} total</p>
        </div>
        {result.prs.length > 0 && <ul className="mt-6 space-y-3">{result.prs.map((p) => <li key={p.exercise} className="card p-4 flex justify-between font-bold text-lg"><span>{p.exercise}</span><span style={{ color: 'var(--o)' }}>{p.type}: {fmt(p.value, u)}</span></li>)}</ul>}
        <div className="flex gap-4 mt-8"><Link to="/today" className="btn">Back to today</Link><button onClick={() => { const n = prompt('Name this routine', result.workout.name || 'My routine'); if (n) saveRoutine(n, result.workout) }} className="btn btn-plain border-[3px]">Save as routine</button><Link to="/progress" className="btn btn-plain border-[3px]">See progress</Link></div>
      </main></div>
    )
  }
  if (!active) return <div><Header /><main className="max-w-5xl mx-auto px-5 py-16"><h1 className="display text-6xl">No workout running</h1><Link to="/programs" className="btn mt-8">Pick a workout</Link></main></div>

  const flat = active.exercises.flatMap((e, ei) => e.sets.map((s, si) => ({ ei, si, s })))
  const cur = (focus && active.exercises[focus.ei]?.sets[focus.si] && { ...focus, s: active.exercises[focus.ei].sets[focus.si] }) || flat.find((x) => !x.s.done)
  const doneN = flat.filter((x) => x.s.done).length
  const patchSet = (ei, si, p) => setActive({ ...active, exercises: active.exercises.map((e, i) => (i !== ei ? e : { ...e, sets: e.sets.map((s, j) => (j === si ? { ...s, ...p } : s)) })) })
  const complete = () => {
    const { ei, si, s } = cur
    if (!(+s.reps > 0)) return setMsg('Enter the reps first.')
    setMsg(''); audio.current ||= new (window.AudioContext || window.webkitAudioContext)(); audio.current.resume?.()
    patchSet(ei, si, { done: true }); setFocus(null)
    const left = flat.filter((x) => !x.s.done && !(x.ei === ei && x.si === si))
    if (left.length) setRest({ end: Date.now() + settings.rest * 1000, total: settings.rest, next: { name: active.exercises[left[0].ei].name, si: left[0].si } })
  }
  const onFinish = () => { const r = finish(); if (!r) return setMsg('Complete at least one set first.'); setRest(null); setResult(r) }
  const ex = cur && active.exercises[cur.ei]
  const prev = ex && lastSets(history, ex.name)[cur.si]
  const plate = cur && plates(+cur.s.weight || 0, PLATES[u].bar, PLATES[u].avail)

  return (
    <div>
      <Header />
      <main className="max-w-3xl mx-auto px-5 py-6">
        <div className="flex items-center justify-between font-bold mb-2"><span>{active.name || 'Workout'}</span><span>{doneN} of {flat.length} sets</span></div>
        <div className="h-4 border-[3px] border-[var(--ink)]" role="progressbar" aria-valuenow={doneN} aria-valuemax={flat.length}><div className="h-full transition-all duration-500" style={{ width: `${flat.length ? (doneN / flat.length) * 100 : 0}%`, background: 'var(--o)' }} /></div>

        {rest ? <div className="mt-6"><Rest rest={rest} setRest={setRest} beep={beep} /></div> : cur ? (
          <div className="mt-6">
            <div className="flex items-center justify-between gap-4"><h1 className="display text-[clamp(3.5rem,13vw,7rem)]">{ex.name}</h1><div className="hidden sm:block w-36 shrink-0"><Doodle move={moveFor(ex.name)} /></div></div>
            <p className="font-bold text-lg mt-2">Set {cur.si + 1} of {ex.sets.length}{ex.target ? `, target ${ex.target} reps` : ''}</p>
            {prev && <p style={{ color: 'var(--muted)' }}>Last time: {fmt(prev.weight, u)} x {prev.reps}</p>}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Stepper label={`Weight (${unitLabel(u)})`} value={cur.s.weight} step={stepFor(u)} onChange={(v) => patchSet(cur.ei, cur.si, { weight: v })} />
              <Stepper label="Reps" value={cur.s.reps} step={1} onChange={(v) => patchSet(cur.ei, cur.si, { reps: v })} />
            </div>
            <button onClick={complete} className="btn w-full mt-6 !py-5 text-2xl flex items-center justify-center gap-3"><Check size={30} strokeWidth={4} />Complete set</button>
            <button onClick={() => setShowPlates(!showPlates)} className="font-bold underline underline-offset-4 mt-4">{showPlates ? 'Hide plates' : 'Plate calculator'}</button>
            <a href={watchUrl(ex.name)} target="_blank" rel="noreferrer" className="font-bold underline underline-offset-4 mt-4 ml-6 inline-block">Watch technique</a>
            {showPlates && <p className="card p-4 mt-2 font-bold">{plate.perSide.length ? `Each side of a ${PLATES[u].bar} ${unitLabel(u)} bar: ${plate.perSide.join(' + ')} ${unitLabel(u)}${plate.remainder ? ` (${plate.remainder} ${unitLabel(u)} per side left over)` : ''}` : `At or under the ${PLATES[u].bar} ${unitLabel(u)} bar. Just the bar.`}</p>}
          </div>
        ) : (
          <div className="mt-6 p-8" style={{ background: 'var(--o)', color: '#0d0d0d' }}>
            <h1 className="display text-7xl">All sets done</h1>
            <button onClick={onFinish} className="btn btn-ink mt-6 text-xl">Finish workout</button>
          </div>
        )}

        <p role="status" className="mt-3 font-bold min-h-6" style={{ color: 'var(--o)' }}>{msg}</p>
        <div className="mt-6">
          <p className="font-bold mb-2">Jump to</p>
          <div className="flex flex-wrap gap-2">
            {active.exercises.map((e, ei) => {
              const next = e.sets.findIndex((s) => !s.done), all = next === -1
              return <button key={e.id} onClick={() => { setRest(null); setFocus(all ? { ei, si: e.sets.length - 1 } : { ei, si: next }) }} className="border-[3px] border-[var(--ink)] px-3 py-1.5 font-bold" style={all ? { background: 'var(--o)', color: '#0d0d0d' } : cur?.ei === ei ? { background: 'var(--ink)', color: 'var(--paper)' } : {}}>{e.name}</button>
            })}
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mt-10">
          {cur && <button onClick={onFinish} className="btn btn-plain border-[3px]">Finish early</button>}
          <Link to="/log" className="btn btn-plain border-[3px]">List view</Link>
        </div>
      </main>
    </div>
  )
}
