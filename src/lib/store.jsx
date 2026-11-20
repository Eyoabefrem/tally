import { createContext, useContext, useState, useEffect } from 'react'
import { detectPRs, lastSets } from './stats'
import { kgTo, toKg } from './units'
import { mergeById } from './merge'
import { useAuth } from './auth'
import * as cloud from './cloud'

// Local-first: everything is saved in this browser. When you are logged in, it is also synced to Supabase.
const Ctx = createContext(null)
const KEY = 'tally-v1'
const uid = () => Math.random().toString(36).slice(2, 9)
export const newSet = (weight = '', reps = '') => ({ id: uid(), weight, reps, done: false })
export const newExercise = (name, sets) => ({ id: uid(), name, sets: sets?.length ? sets : [newSet()] })
const DEFAULTS = { goal: 3, rest: 90, sound: true, program: 'fullbody', units: 'kg' }
const byDayDesc = (a, b) => (b.day > a.day ? 1 : -1)

export function StoreProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.id
  const [init] = useState(() => { try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} } })
  const [history, setHistory] = useState(init.history || [])
  const [active, setActive] = useState(init.active || null)
  const [settings, setSettings] = useState({ ...DEFAULTS, ...init.settings })
  const [routines, setRoutines] = useState(init.routines || [])
  const [body, setBody] = useState(init.body || [])
  const [sync, setSync] = useState('off') // 'off' | 'syncing' | 'ok' | an error message
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify({ history, active, settings, routines, body })) } catch {} }, [history, active, settings, routines, body])

  // Fire-and-forget cloud write; a failure shows up as the sync status.
  const push = (fn) => { if (userId) fn().catch((e) => setSync(e.message)) }

  // On login: download, merge with this browser's data, upload whatever the cloud did not have.
  useEffect(() => {
    if (!userId) { setSync('off'); return }
    let stale = false
    setSync('syncing')
    cloud.pullAll().then(async (c) => {
      if (stale) return
      const w = mergeById(c.workouts, history), r = mergeById(c.routines, routines), b = mergeById(c.body, body)
      setHistory(w.merged.sort((x, y) => y.finishedAt - x.finishedAt)); setRoutines(r.merged); setBody(b.merged.sort(byDayDesc))
      if (c.settings) setSettings({ ...DEFAULTS, ...c.settings })
      await Promise.all([cloud.pushWorkouts(w.localOnly), ...r.localOnly.map(cloud.pushRoutine), ...b.localOnly.map(cloud.pushBody), c.settings ? null : cloud.pushSettings(settings)])
      if (!stale) setSync('ok')
    }).catch((e) => { if (!stale) setSync(e.message) })
    return () => { stale = true }
  }, [userId])

  const start = (plan) => setActive({
    id: uid(), name: plan?.name || '', programId: plan?.programId, startedAt: Date.now(),
    exercises: (plan?.exercises || []).map((p) => {
      const last = lastSets(history, p.name)[0]?.weight
      const w = last == null ? '' : String(kgTo(last, settings.units))
      return { ...newExercise(p.name, Array.from({ length: p.sets }, () => newSet(w, String(p.reps)))), target: p.reps }
    }),
  })
  const discard = () => setActive(null)
  const finish = () => {
    const w = {
      ...active, finishedAt: Date.now(),
      exercises: active.exercises
        .map((e) => ({ ...e, sets: e.sets.filter((s) => s.done && +s.reps > 0).map((s) => ({ id: s.id, weight: toKg(+s.weight || 0, settings.units), reps: +s.reps })) }))
        .filter((e) => e.sets.length),
    }
    if (!w.exercises.length) return null
    w.prs = detectPRs(history, w)
    setHistory([w, ...history]); setActive(null)
    push(() => cloud.pushWorkouts([w]))
    return { workout: w, prs: w.prs }
  }
  const remove = (id) => { setHistory(history.filter((h) => h.id !== id)); push(() => cloud.dropWorkout(id)) }
  const erase = () => { setHistory([]); setActive(null); push(() => cloud.wipeWorkouts()) }
  const clearLocal = () => { setHistory([]); setActive(null); setRoutines([]); setBody([]); setSettings(DEFAULTS) } // after logging out of a synced account
  const update = (p) => { const n = { ...settings, ...p }; setSettings(n); push(() => cloud.pushSettings(n)) }
  const saveRoutine = (name, w) => {
    const r = { id: uid(), name: name.trim().slice(0, 60) || 'My routine', exercises: w.exercises.map((e) => ({ name: e.name, sets: e.sets.length, reps: e.sets[0].reps })) }
    setRoutines([...routines, r]); push(() => cloud.pushRoutine(r))
  }
  const deleteRoutine = (id) => { setRoutines(routines.filter((r) => r.id !== id)); push(() => cloud.dropRoutine(id)) }
  const addBody = (day, kg) => { const e = { id: uid(), day, kg }; setBody([e, ...body].sort(byDayDesc)); push(() => cloud.pushBody(e)) }
  const deleteBody = (id) => { setBody(body.filter((e) => e.id !== id)); push(() => cloud.dropBody(id)) }

  return <Ctx.Provider value={{ history, active, setActive, settings, update, start, discard, finish, remove, erase, clearLocal, routines, saveRoutine, deleteRoutine, body, addBody, deleteBody, sync }}>{children}</Ctx.Provider>
}
export const useStore = () => useContext(Ctx)
