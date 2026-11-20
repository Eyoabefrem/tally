import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import Header from '../components/Header'
import { useStore } from '../lib/store'
import { exerciseNames, series, volume, setCount } from '../lib/stats'
import { kgTo, unitLabel } from '../lib/units'
import Doodle from '../components/Doodle'

const METRICS = [['weight', 'Heaviest set'], ['e1rm', 'Estimated 1RM'], ['volume', 'Volume']]

export default function Progress() {
  const { history, settings } = useStore()
  const u = settings.units
  const names = exerciseNames(history)
  const [pick, setPick] = useState('')
  const [metric, setMetric] = useState('weight')
  const name = names.includes(pick) ? pick : names[0]
  const data = name ? series(history, name, metric).map((p) => ({ ...p, value: kgTo(p.value, u), label: new Date(p.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) })) : []
  const totals = [['Workouts', history.length], ['Sets', history.reduce((t, h) => t + setCount(h), 0)], [`Total ${unitLabel(u)} lifted`, Math.round(kgTo(history.reduce((t, h) => t + volume(h), 0), u)).toLocaleString()]]
  const tab = (on) => `px-4 py-2 font-bold border-[3px] border-[var(--ink)] ${on ? 'bg-[var(--o)] text-[#0d0d0d]' : ''}`

  return (
    <div>
      <Header />
      <main className="max-w-5xl mx-auto px-5 py-8">
        <h1 className="display text-[clamp(4rem,14vw,9rem)]">Progress</h1>
        {!history.length ? (
          <div className="card p-10 mt-8 text-center"><div className="w-40 mx-auto"><Doodle move="row" /></div><p className="display text-4xl">Nothing to chart yet</p><p className="mt-2" style={{ color: 'var(--muted)' }}>Finish a workout and your charts appear here.</p><Link to="/log" className="btn mt-6">Start a workout</Link></div>
        ) : (
          <>
            <div className="grid grid-cols-3 mt-8 border-[3px] border-[var(--ink)]">
              {totals.map(([k, v], i) => <div key={k} className="p-4" style={{ background: ['var(--o)', 'var(--b)', 'var(--card)'][i], color: ['#0d0d0d', '#fff', 'var(--ink)'][i] }}><b className="display text-4xl sm:text-6xl block">{v}</b><span className="font-bold text-sm sm:text-base">{k}</span></div>)}
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <select value={name} onChange={(e) => setPick(e.target.value)} className="input !w-auto" aria-label="Exercise">{names.map((n) => <option key={n} style={{ color: '#0d0d0d' }}>{n}</option>)}</select>
              {METRICS.map(([k, l]) => <button key={k} onClick={() => setMetric(k)} className={tab(metric === k)}>{l}</button>)}
            </div>
            <div className="card mt-6 p-4 h-80">
              {data.length < 2 && <p className="font-bold mb-2" style={{ color: 'var(--muted)' }}>Log this lift in two workouts to see a trend.</p>}
              <ResponsiveContainer width="100%" height={data.length < 2 ? '85%' : '100%'}>
                <LineChart data={data} margin={{ top: 10, right: 16, bottom: 0, left: -10 }}>
                  <CartesianGrid stroke="currentColor" strokeOpacity={0.15} vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: 'currentColor', fontWeight: 700 }} stroke="currentColor" />
                  <YAxis tick={{ fill: 'currentColor', fontWeight: 700 }} stroke="currentColor" domain={['auto', 'auto']} />
                  <Tooltip contentStyle={{ background: '#0d0d0d', color: '#fff', border: '3px solid #ff4a1c', borderRadius: 0, fontWeight: 700 }} formatter={(v) => [`${v} ${unitLabel(u)}`, METRICS.find((m) => m[0] === metric)[1]]} />
                  <Line type="linear" dataKey="value" stroke="#ff4a1c" strokeWidth={5} dot={{ r: 6, fill: '#ff4a1c', stroke: '#0d0d0d', strokeWidth: 3 }} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
