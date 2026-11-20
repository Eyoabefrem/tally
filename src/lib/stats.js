// Training math. Pure functions, tested in stats.test.js.
// A workout = { id, name, finishedAt, exercises: [{ id, name, sets: [{ weight, reps }] }] }  (finished workouts hold only completed sets)
export const epley = (w, r) => (r <= 1 ? w : w * (1 + r / 30)) // estimated one-rep max
const key = (n) => n.trim().toLowerCase()
const best = (sets, f) => sets.reduce((m, s) => Math.max(m, f(s)), 0)
const setsOf = (history, name) => history.flatMap((h) => h.exercises.filter((e) => key(e.name) === key(name)).flatMap((e) => e.sets))
const round1 = (n) => Math.round(n * 10) / 10

export const volume = (w) => w.exercises.reduce((t, e) => t + e.sets.reduce((s, x) => s + x.weight * x.reps, 0), 0)
export const setCount = (w) => w.exercises.reduce((t, e) => t + e.sets.length, 0)

// Records broken by `workout`, compared with everything before it. A first-ever lift sets a baseline, not a record.
export function detectPRs(history, workout) {
  const prs = []
  for (const ex of workout.exercises) {
    const prior = setsOf(history, ex.name)
    if (!prior.length) continue
    const newW = best(ex.sets, (s) => s.weight), newE = best(ex.sets, (s) => epley(s.weight, s.reps))
    if (newW > best(prior, (s) => s.weight)) prs.push({ exercise: ex.name, type: 'Heaviest set', value: newW })
    else if (newE > best(prior, (s) => epley(s.weight, s.reps)) + 0.01) prs.push({ exercise: ex.name, type: 'Estimated 1RM', value: round1(newE) })
  }
  return prs
}

// One point per workout that included the exercise. metric: 'weight' | 'e1rm' | 'volume'
export function series(history, name, metric) {
  return history.map((h) => {
    const sets = h.exercises.filter((e) => key(e.name) === key(name)).flatMap((e) => e.sets)
    if (!sets.length) return null
    const v = metric === 'volume' ? sets.reduce((t, s) => t + s.weight * s.reps, 0) : metric === 'e1rm' ? best(sets, (s) => epley(s.weight, s.reps)) : best(sets, (s) => s.weight)
    return { date: h.finishedAt, value: round1(v) }
  }).filter(Boolean).sort((a, b) => a.date - b.date)
}

export const exerciseNames = (history) => [...new Map(history.flatMap((h) => h.exercises.map((e) => [key(e.name), e.name]))).values()]
// The sets from the most recent time you did this exercise, for pre-filling.
export const lastSets = (history, name) => history.find((h) => h.exercises.some((e) => key(e.name) === key(name)))?.exercises.find((e) => key(e.name) === key(name)).sets ?? []

// ---- Habits and tools ----
const shift = (t, n) => { const d = new Date(t); d.setDate(d.getDate() + n); return d.getTime() }
export const weekStart = (t) => { const d = new Date(t); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d.getTime() } // Monday
const between = (history, a, b) => history.filter((h) => h.finishedAt >= a && h.finishedAt < b).length
export const workoutsThisWeek = (history, now = Date.now()) => between(history, weekStart(now), shift(weekStart(now), 7))
// Consecutive weeks that hit the goal. The current week counts once it is hit, and never breaks the streak while in progress.
export function weekStreak(history, goal, now = Date.now()) {
  const s = weekStart(now)
  let streak = workoutsThisWeek(history, now) >= goal ? 1 : 0
  for (let i = 1; i < 520; i++) { const a = shift(s, -7 * i); if (between(history, a, shift(a, 7)) >= goal) streak++; else break }
  return streak
}
// A grid of days, Monday first, ending with the current week: [{ t, n, future }]
export function calendarCells(history, weeks = 12, now = Date.now()) {
  const start = shift(weekStart(now), -7 * (weeks - 1))
  return Array.from({ length: weeks * 7 }, (_, i) => {
    const t = shift(start, i)
    return { t, n: between(history, t, shift(t, 1)), future: t > now }
  })
}
// Plates to load on each side of the bar.
export function plates(target, bar = 20, avail = [25, 20, 15, 10, 5, 2.5, 1.25]) {
  let side = (target - bar) / 2
  const perSide = []
  if (side <= 0) return { perSide, remainder: 0 }
  for (const p of avail) while (side + 1e-9 >= p) { perSide.push(p); side -= p }
  return { perSide, remainder: Math.round(side * 100) / 100 }
}

// ---- Insights ----
// Volume and workout count for each of the last `weeks` weeks, oldest first.
export function weeklyVolume(history, weeks = 12, now = Date.now()) {
  return Array.from({ length: weeks }, (_, i) => {
    const start = shift(weekStart(now), -7 * (weeks - 1 - i)), end = shift(start, 7)
    const inWeek = history.filter((h) => h.finishedAt >= start && h.finishedAt < end)
    return { start, workouts: inWeek.length, volume: inWeek.reduce((t, h) => t + volume(h), 0) }
  })
}
// Completed sets per muscle group, biggest first. `muscleOf(name)` returns a group or undefined.
export function muscleSplit(history, muscleOf) {
  const m = new Map()
  for (const h of history) for (const e of h.exercises) { const g = muscleOf(e.name) || 'Other'; m.set(g, (m.get(g) || 0) + e.sets.length) }
  return [...m].map(([muscle, sets]) => ({ muscle, sets })).sort((a, b) => b.sets - a.sets)
}
