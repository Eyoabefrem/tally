import { epley } from './stats.js'

// One row per completed set, in kilograms, ready for a spreadsheet.
export function toCSV(history) {
  const esc = (v) => { const s = String(v ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
  const rows = [['date', 'workout', 'exercise', 'set', 'weight_kg', 'reps', 'estimated_1rm_kg']]
  for (const w of history) for (const e of w.exercises) e.sets.forEach((s, i) =>
    rows.push([new Date(w.finishedAt).toISOString().slice(0, 10), w.name || 'Workout', e.name, i + 1, s.weight, s.reps, Math.round(epley(s.weight, s.reps) * 10) / 10]))
  return rows.map((r) => r.map(esc).join(',')).join('\n')
}
