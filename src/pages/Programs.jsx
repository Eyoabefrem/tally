import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { useStore } from '../lib/store'
import { PROGRAMS } from '../lib/programs'
import Doodle, { moveFor } from '../components/Doodle'

const blocks = [['var(--o)', '#0d0d0d'], ['var(--b)', '#fff'], ['var(--ink)', 'var(--paper)'], ['var(--card)', 'var(--ink)'], ['var(--o)', '#0d0d0d']]

export default function Programs() {
  const { active, start, settings, update, routines, deleteRoutine } = useStore()
  const nav = useNavigate()
  const go = (w, programId) => { if (active && !confirm('Replace your workout in progress?')) return; start({ ...w, programId }); nav('/session') }
  return (
    <div>
      <Header />
      <main className="max-w-5xl mx-auto px-5 py-8">
        <h1 className="display text-[clamp(4rem,14vw,9rem)]">Programs</h1>
        <p className="text-lg mt-3 max-w-xl" style={{ color: 'var(--muted)' }}>Pick a plan and Tally serves up the next workout on Today. Start any workout by itself, too.</p>
        {routines.length > 0 && (
          <section className="mt-10 border-[3px] border-[var(--ink)]">
            <h2 className="display text-4xl p-5" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>My routines</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: 'var(--ink)' }}>
              {routines.map((r) => (
                <article key={r.id} className="p-5" style={{ background: 'var(--card)' }}>
                  <h3 className="display text-3xl">{r.name}</h3>
                  <ul className="mt-3 space-y-1">{r.exercises.map((e) => <li key={e.name} className="flex justify-between"><span>{e.name}</span><b>{e.sets} x {e.reps}</b></li>)}</ul>
                  <div className="flex items-center gap-4 mt-5"><button onClick={() => go(r)} className="btn btn-ink !py-2">Start</button><button onClick={() => confirm('Delete this routine?') && deleteRoutine(r.id)} className="font-bold underline underline-offset-4">Delete</button></div>
                </article>
              ))}
            </div>
          </section>
        )}
        <div className="space-y-8 mt-10">
          {PROGRAMS.map((p, i) => (
            <section key={p.id} className="border-[3px] border-[var(--ink)]">
              <div className="p-6 flex flex-wrap items-start justify-between gap-4" style={{ background: blocks[i][0], color: blocks[i][1] }}>
                <div><h2 className="display text-5xl">{p.name}</h2><p className="font-semibold mt-2">{p.level}, {p.days}</p><p className="mt-2 max-w-md">{p.blurb}</p></div>
                <div className="w-28 shrink-0 hidden sm:block" aria-hidden="true"><Doodle move={moveFor(p.workouts[0].exercises[0].name)} /></div>
                <button onClick={() => update({ program: p.id })} className="font-bold border-[3px] border-current px-4 py-2" style={settings.program === p.id ? { background: '#0d0d0d', color: '#fff', borderColor: '#0d0d0d' } : {}}>{settings.program === p.id ? 'Your program' : 'Follow this'}</button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: 'var(--ink)' }}>
                {p.workouts.map((w) => (
                  <article key={w.id} className="p-5" style={{ background: 'var(--card)' }}>
                    <h3 className="display text-3xl">{w.name}</h3>
                    <p className="font-semibold text-sm" style={{ color: 'var(--muted)' }}>About {w.minutes} minutes</p>
                    <ul className="mt-3 space-y-1">{w.exercises.map((e) => <li key={e.name} className="flex justify-between"><span>{e.name}</span><b>{e.sets} x {e.reps}</b></li>)}</ul>
                    <button onClick={() => go(w, p.id)} className="btn btn-ink mt-5 !py-2">Start</button>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  )
}
