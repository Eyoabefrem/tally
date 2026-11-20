import { Link } from 'react-router-dom'
import Header from '../components/Header'
import { useAuth } from '../lib/auth'
import { configured } from '../lib/supabase'
import { useStore } from '../lib/store'
import { PROGRAMS } from '../lib/programs'
import { toCSV } from '../lib/csv'

export default function Settings() {
  const { settings, update, history, erase, sync, clearLocal, active } = useStore()
  const { user, logout } = useAuth()
  const row = 'card p-5 flex flex-wrap items-center justify-between gap-3'
  const exportCsv = () => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([toCSV(history)], { type: 'text/csv' }))
    a.download = 'tally-workouts.csv'; a.click(); URL.revokeObjectURL(a.href)
  }
  const exportData = () => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), workouts: history }, null, 2)], { type: 'application/json' }))
    a.download = 'tally-workouts.json'; a.click(); URL.revokeObjectURL(a.href)
  }
  return (
    <div>
      <Header />
      <main className="max-w-3xl mx-auto px-5 py-8">
        <h1 className="display text-[clamp(4rem,14vw,9rem)]">Settings</h1>
        <div className="space-y-4 mt-8">
          {configured && (user ? (
            <div className={row}>
              <span><b className="block">Signed in as {user.email}</b><span style={{ color: 'var(--muted)' }}>{sync === 'ok' ? 'All workouts synced' : sync === 'syncing' ? 'Syncing' : `Sync problem: ${sync}`}</span></span>
              <button onClick={() => { if (sync === 'ok') clearLocal(); logout() }} className="btn btn-plain border-[3px] !py-2">Log out</button>
            </div>
          ) : <div className={row}><b>Sync across devices</b><Link to="/login" className="btn !py-2">Log in</Link></div>)}
          <label className={row}><b>Weekly goal</b><select className="input !w-auto" value={settings.goal} onChange={(e) => update({ goal: +e.target.value })}>{[1, 2, 3, 4, 5, 6, 7].map((n) => <option key={n} value={n} style={{ color: '#0d0d0d' }}>{n} {n === 1 ? 'workout' : 'workouts'} a week</option>)}</select></label>
          <label className={row}><span><b className="block">Units</b>{active && <span className="text-sm" style={{ color: 'var(--muted)' }}>Finish your current workout to change units</span>}</span><select className="input !w-auto" value={settings.units} disabled={!!active} onChange={(e) => update({ units: e.target.value })}>{[['kg', 'Kilograms'], ['lb', 'Pounds']].map(([k, l]) => <option key={k} value={k} style={{ color: '#0d0d0d' }}>{l}</option>)}</select></label>
          <label className={row}><b>Rest between sets</b><select className="input !w-auto" value={settings.rest} onChange={(e) => update({ rest: +e.target.value })}>{[45, 60, 90, 120, 180].map((n) => <option key={n} value={n} style={{ color: '#0d0d0d' }}>{n} seconds</option>)}</select></label>
          <label className={row}><b>Your program</b><select className="input !w-auto" value={settings.program} onChange={(e) => update({ program: e.target.value })}>{PROGRAMS.map((p) => <option key={p.id} value={p.id} style={{ color: '#0d0d0d' }}>{p.name}</option>)}</select></label>
          <label className={row}><b>Beep when rest ends</b><input type="checkbox" className="size-7 accent-[var(--o)]" checked={settings.sound} onChange={(e) => update({ sound: e.target.checked })} /></label>
          <div className={row}><b>Your data</b><span className="flex gap-3"><button onClick={exportCsv} disabled={!history.length} className="btn btn-plain border-[3px] !py-2 disabled:opacity-40">Export CSV</button><button onClick={exportData} disabled={!history.length} className="btn btn-plain border-[3px] !py-2 disabled:opacity-40">Export JSON</button><button onClick={() => confirm('Erase all workouts? This cannot be undone.') && erase()} className="btn btn-plain border-[3px] !py-2">Erase all</button></span></div>
        </div>
      </main>
    </div>
  )
}
