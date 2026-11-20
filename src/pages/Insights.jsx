import { Link } from 'react-router-dom'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import Header from '../components/Header'
import Doodle from '../components/Doodle'
import { useStore } from '../lib/store'
import { META } from '../lib/exercises'
import { weeklyVolume, muscleSplit } from '../lib/stats'
import { kgTo, fmt, unitLabel } from '../lib/units'

export default function Insights() {
  const { history, settings } = useStore()
  const u = settings.units
  const data = weeklyVolume(history, 12).map((w) => ({ label: new Date(w.start).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), volume: Math.round(kgTo(w.volume, u)), workouts: w.workouts }))
  const muscles = muscleSplit(history, (n) => META[n]?.[0])
  const records = history.flatMap((h) => (h.prs || []).map((p) => ({ ...p, date: h.finishedAt })))
  const axis = { fill: 'currentColor', fontWeight: 700 }

  return (
    <div>
      <Header />
      <main className="max-w-5xl mx-auto px-5 py-8">
        <h1 className="display text-[clamp(4rem,14vw,9rem)]">Insights</h1>
        {!history.length ? (
          <div className="card p-10 mt-8 text-center"><div className="w-40 mx-auto"><Doodle move="hinge" /></div><p className="display text-4xl">Nothing to analyse yet</p><p className="mt-2" style={{ color: 'var(--muted)' }}>Finish a few workouts and your trends appear here.</p><Link to="/programs" className="btn mt-6">Pick a workout</Link></div>
        ) : (
          <>
            <section className="mt-10">
              <h2 className="display text-4xl mb-4">Weekly volume</h2>
              <div className="card p-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ top: 10, right: 12, bottom: 0, left: -6 }}>
                    <CartesianGrid stroke="currentColor" strokeOpacity={0.15} vertical={false} />
                    <XAxis dataKey="label" tick={axis} stroke="currentColor" interval="preserveStartEnd" />
                    <YAxis tick={axis} stroke="currentColor" />
                    <Tooltip contentStyle={{ background: '#0d0d0d', color: '#fff', border: '3px solid #ff4a1c', borderRadius: 0, fontWeight: 700 }} formatter={(v, _n, p) => [`${v.toLocaleString()} ${unitLabel(u)} in ${p.payload.workouts} ${p.payload.workouts === 1 ? 'workout' : 'workouts'}`, 'Volume']} cursor={{ fill: 'rgba(255,74,28,.15)' }} />
                    <Bar dataKey="volume" fill="#ff4a1c" stroke="#0d0d0d" strokeWidth={3} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="mt-12">
              <h2 className="display text-4xl mb-4">Where your sets go</h2>
              <ul className="space-y-3">
                {muscles.map((m, i) => (
                  <li key={m.muscle} className="flex items-center gap-4">
                    <b className="w-24 shrink-0">{m.muscle}</b>
                    <span className="flex-1 h-8 border-[3px] border-[var(--ink)]"><span className="block h-full" style={{ width: `${(m.sets / muscles[0].sets) * 100}%`, background: i % 2 ? 'var(--b)' : 'var(--o)' }} /></span>
                    <b className="w-16 text-right tabular-nums">{m.sets} sets</b>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-12">
              <h2 className="display text-4xl mb-6">Record timeline</h2>
              {!records.length ? <p style={{ color: 'var(--muted)' }}>Break a personal record and it lands here.</p> : (
                <ol className="border-l-[6px] border-[var(--ink)] ml-3 space-y-6">
                  {records.map((r, i) => (
                    <li key={i} className="pl-7 relative">
                      <span className="absolute -left-[15px] top-1 size-6 border-[3px] border-[var(--ink)]" style={{ background: 'var(--o)' }} />
                      <b className="display text-3xl block">{r.exercise}</b>
                      <span className="font-semibold" style={{ color: 'var(--muted)' }}>{r.type}: {fmt(r.value, u)}, {new Date(r.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  )
}
