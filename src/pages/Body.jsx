import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import Header from '../components/Header'
import { useStore } from '../lib/store'
import { kgTo, toKg, fmt, unitLabel } from '../lib/units'

export default function Body() {
  const { body, addBody, deleteBody, settings } = useStore()
  const u = settings.units
  const [day, setDay] = useState(() => new Date().toLocaleDateString('en-CA')) // yyyy-mm-dd in local time
  const [kg, setKg] = useState('')
  const [err, setErr] = useState('')
  const add = (e) => {
    e.preventDefault()
    const n = toKg(parseFloat(kg), u)
    if (!day || !(n > 20 && n < 400)) return setErr('Enter a weight between 20 and 400 kg.')
    setErr(''); addBody(day, Math.round(n * 10) / 10); setKg('')
  }
  const data = [...body].reverse().map((e) => ({ label: new Date(e.day + 'T12:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), value: kgTo(e.kg, u) }))
  const change = body.length > 1 ? kgTo(body[0].kg - body[body.length - 1].kg, u) : null

  return (
    <div>
      <Header />
      <main className="max-w-5xl mx-auto px-5 py-8">
        <h1 className="display text-[clamp(4rem,14vw,9rem)]">Body</h1>
        <form onSubmit={add} className="flex flex-wrap gap-3 mt-6 items-end">
          <label className="font-bold">Date<input type="date" className="input mt-1" value={day} onChange={(e) => setDay(e.target.value)} /></label>
          <label className="font-bold">Weight ({unitLabel(u)})<input className="input mt-1" inputMode="decimal" value={kg} onChange={(e) => setKg(e.target.value)} /></label>
          <button className="btn">Add</button>
        </form>
        {err && <p role="alert" className="mt-3 font-bold" style={{ color: 'var(--o)' }}>{err}</p>}
        {!body.length ? <div className="card p-10 mt-8 text-center"><p className="display text-4xl">No entries yet</p><p className="mt-2" style={{ color: 'var(--muted)' }}>Weigh in and add your first entry.</p></div> : (
          <>
            <div className="grid grid-cols-2 mt-8 border-[3px] border-[var(--ink)]">
              <div className="p-4" style={{ background: 'var(--o)', color: '#0d0d0d' }}><b className="display text-5xl block">{fmt(body[0].kg, u)}</b><span className="font-bold">Latest</span></div>
              <div className="p-4" style={{ background: 'var(--b)', color: '#fff' }}><b className="display text-5xl block">{change === null ? '-' : `${change > 0 ? '+' : ''}${change} ${unitLabel(u)}`}</b><span className="font-bold">Since your first entry</span></div>
            </div>
            {data.length > 1 && (
              <div className="card mt-6 p-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 10, right: 16, bottom: 0, left: -10 }}>
                    <CartesianGrid stroke="currentColor" strokeOpacity={0.15} vertical={false} />
                    <XAxis dataKey="label" tick={{ fill: 'currentColor', fontWeight: 700 }} stroke="currentColor" />
                    <YAxis tick={{ fill: 'currentColor', fontWeight: 700 }} stroke="currentColor" domain={['auto', 'auto']} />
                    <Tooltip contentStyle={{ background: '#0d0d0d', color: '#fff', border: '3px solid #ff4a1c', borderRadius: 0, fontWeight: 700 }} formatter={(v) => [`${v} ${unitLabel(u)}`, 'Bodyweight']} />
                    <Line type="linear" dataKey="value" stroke="#2237ff" strokeWidth={5} dot={{ r: 6, fill: '#2237ff', stroke: '#0d0d0d', strokeWidth: 3 }} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
            <ul className="mt-6 space-y-2">
              {body.map((e) => <li key={e.id} className="card p-3 flex items-center justify-between font-bold"><span>{new Date(e.day + 'T12:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span><span className="flex items-center gap-4">{fmt(e.kg, u)}<button onClick={() => deleteBody(e.id)} aria-label={`Delete entry for ${e.day}`}><Trash2 size={18} /></button></span></li>)}
            </ul>
          </>
        )}
      </main>
    </div>
  )
}
