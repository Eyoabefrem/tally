import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { useStore } from '../lib/store'
import { PROGRAMS } from '../lib/programs'
import Doodle, { moveFor } from '../components/Doodle'
import { fmt } from '../lib/units'
import { workoutsThisWeek, weekStreak, calendarCells } from '../lib/stats'

export default function Today() {
  const { history, active, settings, start } = useStore()
  const nav = useNavigate()
  const hour = new Date().getHours()
  const program = PROGRAMS.find((p) => p.id === settings.program) || PROGRAMS[0]
  const done = history.filter((h) => h.programId === program.id).length
  const next = program.workouts[done % program.workouts.length]
  const week = workoutsThisWeek(history), streak = weekStreak(history, settings.goal)
  const cells = calendarCells(history, 12)
  const prs = history.flatMap((h) => (h.prs || []).map((p) => ({ ...p, date: h.finishedAt }))).slice(0, 4)
  const go = (plan) => { if (active && !confirm('Replace your workout in progress?')) return; start(plan); nav('/session') }

  return (
    <div>
      <Header />
      <main className="max-w-5xl mx-auto px-5 py-8">
        <p className="font-bold text-lg" style={{ color: 'var(--muted)' }}>{hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'}</p>
        <h1 className="display text-[clamp(4rem,14vw,9rem)]">Today</h1>

        <div className="grid md:grid-cols-[1.4fr_1fr] gap-6 mt-8">
          <section className="p-6 relative overflow-hidden" style={{ background: 'var(--o)', color: '#0d0d0d' }}>
            <div className="absolute right-3 bottom-2 w-32 sm:w-40 opacity-25 pointer-events-none hidden sm:block" aria-hidden="true"><Doodle move={moveFor((active?.exercises?.[0] || next.exercises[0]).name)} /></div>
            {active ? <>
              <p className="font-bold">In progress</p>
              <h2 className="display text-5xl mt-1">{active.name || 'Workout'}</h2>
              <Link to="/session" className="btn btn-ink mt-6">Resume in focus mode</Link>
            </> : <>
              <p className="font-bold">Up next in {program.name}</p>
              <h2 className="display text-5xl sm:text-6xl mt-1">{next.name}</h2>
              <p className="font-semibold mt-3">{next.exercises.map((e) => `${e.name} ${e.sets}x${e.reps}`).join(', ')}</p>
              <button onClick={() => go({ ...next, programId: program.id })} className="btn btn-ink mt-6">Start this workout</button>
            </>}
          </section>
          <section className="p-6" style={{ background: 'var(--b)', color: '#fff' }}>
            <p className="font-bold">This week</p>
            <p className="display text-7xl mt-1">{week}<span className="text-3xl"> of {settings.goal}</span></p>
            <div className="flex gap-1.5 mt-4" aria-hidden="true">{Array.from({ length: settings.goal }, (_, i) => <span key={i} className="flex-1 h-3 border-2 border-white" style={{ background: i < week ? '#fff' : 'transparent' }} />)}</div>
            <p className="font-bold mt-4">{streak > 0 ? `${streak} ${streak === 1 ? 'week' : 'weeks'} in a row` : 'Hit your goal to start a streak'}</p>
          </section>
        </div>

        <section className="mt-10">
          <h2 className="display text-4xl mb-4">Last 12 weeks</h2>
          <div className="grid grid-flow-col grid-rows-7 gap-1.5 w-fit" role="img" aria-label="Training calendar for the last 12 weeks">
            {cells.map((c) => <span key={c.t} title={new Date(c.t).toLocaleDateString()} className="size-5 sm:size-6 border-2 border-[var(--ink)]" style={{ background: c.n ? 'var(--o)' : 'transparent', opacity: c.future ? 0.2 : 1 }} />)}
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-8 mt-10">
          <section>
            <h2 className="display text-4xl mb-4">Recent records</h2>
            {prs.length ? <ul className="space-y-2">{prs.map((p, i) => <li key={i} className="card p-3 flex justify-between font-bold"><span>{p.exercise}</span><span style={{ color: 'var(--o)' }}>{fmt(p.value, settings.units)}</span></li>)}</ul> : <p style={{ color: 'var(--muted)' }}>Records you break show up here.</p>}
          </section>
          <section>
            <h2 className="display text-4xl mb-4">Quick start</h2>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => go()} className="btn btn-plain border-[3px]">Empty workout</button>
              <Link to="/programs" className="btn btn-plain border-[3px]">Browse programs</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
