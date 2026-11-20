import assert from 'node:assert/strict'
import { epley, volume, setCount, detectPRs, series, exerciseNames, lastSets, weekStart, workoutsThisWeek, weekStreak, calendarCells, plates, weeklyVolume, muscleSplit } from './stats.js'

const w = (t, ...ex) => ({ id: String(t), name: 'x', finishedAt: t, exercises: ex.map(([name, ...sets]) => ({ id: name, name, sets: sets.map(([weight, reps]) => ({ weight, reps })) })) })
assert.equal(epley(100, 1), 100)
assert.ok(Math.abs(epley(100, 10) - 133.33) < 0.01)
assert.equal(volume(w(1, ['Squat', [100, 5], [100, 5]], ['Bench', [60, 10]])), 1600)
assert.equal(setCount(w(1, ['Squat', [100, 5], [100, 5]], ['Bench', [60, 10]])), 3)

const h1 = [w(1, ['Bench Press', [60, 10]])]
assert.deepEqual(detectPRs([], w(2, ['Bench Press', [100, 5]])), [], 'first time is a baseline')
assert.deepEqual(detectPRs(h1, w(2, ['bench press', [65, 5]])), [{ exercise: 'bench press', type: 'Heaviest set', value: 65 }], 'case-insensitive match, heavier set')
assert.equal(detectPRs(h1, w(2, ['Bench Press', [60, 12]]))[0].type, 'Estimated 1RM', 'more reps at same weight')
assert.deepEqual(detectPRs(h1, w(2, ['Bench Press', [50, 8]])), [], 'lighter is not a record')

const hist = [w(30, ['Squat', [120, 5]]), w(10, ['Squat', [100, 5]]), w(20, ['Bench', [60, 8]])]
assert.deepEqual(series(hist, 'Squat', 'weight'), [{ date: 10, value: 100 }, { date: 30, value: 120 }], 'sorted by date, skips other lifts')
assert.equal(series(hist, 'Squat', 'volume')[0].value, 500)
assert.deepEqual(exerciseNames(hist).sort(), ['Bench', 'Squat'])
assert.deepEqual(lastSets(hist, 'Squat'), [{ weight: 120, reps: 5 }], 'history is newest first')
assert.deepEqual(lastSets(hist, 'Deadlift'), [])
// habits (Wednesday 15 Jan 2025; weeks start Monday)
const now = new Date(2025, 0, 15, 12).getTime()
const at = (y, m, d) => ({ finishedAt: new Date(y, m, d, 10).getTime(), exercises: [] })
assert.equal(new Date(weekStart(now)).getDate(), 13, 'week starts Monday')
const hab = [at(2025, 0, 14), at(2025, 0, 8), at(2025, 0, 9), at(2025, 0, 10), at(2025, 0, 1), at(2025, 0, 2), at(2025, 0, 3)]
assert.equal(workoutsThisWeek(hab, now), 1)
assert.equal(weekStreak(hab, 3, now), 2, 'two full weeks hit the goal; the current week is still in progress')
assert.equal(weekStreak([...hab, at(2025, 0, 13), at(2025, 0, 15)], 3, now), 3, 'hitting the goal this week extends the streak')
assert.equal(weekStreak([], 3, now), 0)
assert.equal(weekStreak([at(2024, 11, 1)], 1, now), 0, 'a missed week breaks it')
const cells = calendarCells(hab, 12, now)
assert.equal(cells.length, 84)
assert.equal(cells.find((c) => new Date(c.t).getDate() === 14 && new Date(c.t).getMonth() === 0).n, 1)
assert.ok(cells.at(-1).future && !cells.find((c) => new Date(c.t).getDate() === 15 && new Date(c.t).getMonth() === 0).future)
assert.deepEqual(plates(100).perSide, [25, 15])
assert.deepEqual(plates(60).perSide, [20])
assert.deepEqual(plates(62.5).perSide, [20, 1.25])
assert.deepEqual(plates(15).perSide, [], 'lighter than the bar')
assert.equal(plates(61).remainder, 0.5, 'leftover that no plate can make')
const wk = [{ finishedAt: new Date(2025, 0, 14, 10).getTime(), exercises: [{ name: 'Bench Press', sets: [{ weight: 100, reps: 5 }, { weight: 100, reps: 5 }] }] },
  { finishedAt: new Date(2025, 0, 8, 10).getTime(), exercises: [{ name: 'Back Squat', sets: [{ weight: 50, reps: 10 }] }, { name: 'Mystery', sets: [{ weight: 1, reps: 1 }] }] }]
const wv = weeklyVolume(wk, 3, now)
assert.deepEqual(wv.map((w) => w.volume), [0, 500 + 1, 1000], 'oldest first; this week and last week')
assert.deepEqual(wv.map((w) => w.workouts), [0, 1, 1])
assert.deepEqual(muscleSplit(wk, (n) => ({ 'Bench Press': 'Chest', 'Back Squat': 'Legs' })[n]), [{ muscle: 'Chest', sets: 2 }, { muscle: 'Legs', sets: 1 }, { muscle: 'Other', sets: 1 }])
console.log('All tests passed')
