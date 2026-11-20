import assert from 'node:assert/strict'
import { toCSV } from './csv.js'

const h = [{ finishedAt: Date.UTC(2025, 0, 15, 12), name: 'Push, "heavy"', exercises: [{ name: 'Bench Press', sets: [{ weight: 100, reps: 5 }, { weight: 100, reps: 1 }] }] }]
const lines = toCSV(h).split('\n')
assert.equal(lines[0], 'date,workout,exercise,set,weight_kg,reps,estimated_1rm_kg')
assert.equal(lines.length, 3)
assert.equal(lines[1], '2025-01-15,"Push, ""heavy""",Bench Press,1,100,5,116.7', 'commas and quotes are escaped')
assert.equal(lines[2].split(',').pop(), '100', 'a single rep is its own 1RM')
assert.equal(toCSV([]), 'date,workout,exercise,set,weight_kg,reps,estimated_1rm_kg')
console.log('CSV tests passed')
