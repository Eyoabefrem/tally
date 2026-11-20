import { supabase } from './supabase'

// Tally in Supabase. Row-level security means every call only sees and changes your own rows.
const must = ({ data, error }) => { if (error) throw new Error(error.message); return data }
const up = (table, rows, conflict = 'user_id,id') => supabase.from(table).upsert(rows, { onConflict: conflict })

export async function pullAll() {
  const [w, s, r, b] = await Promise.all([
    supabase.from('workouts').select('id,data'),
    supabase.from('user_settings').select('data').maybeSingle(),
    supabase.from('routines').select('id,name,exercises').order('created_at'),
    supabase.from('bodyweight').select('id,day,kg'),
  ])
  return { workouts: must(w).map((x) => x.data), settings: must(s)?.data ?? null, routines: must(r), body: must(b).map((x) => ({ ...x, kg: +x.kg })) }
}
export const pushWorkouts = async (list) => { if (list.length) must(await up('workouts', list.map((w) => ({ id: w.id, data: w, finished_at: new Date(w.finishedAt).toISOString() })))) }
export const dropWorkout = async (id) => must(await supabase.from('workouts').delete().eq('id', id))
export const wipeWorkouts = async () => must(await supabase.from('workouts').delete().not('id', 'is', null))
export const pushSettings = async (data) => must(await up('user_settings', { data }, 'user_id'))
export const pushRoutine = async (r) => must(await up('routines', { id: r.id, name: r.name, exercises: r.exercises }))
export const dropRoutine = async (id) => must(await supabase.from('routines').delete().eq('id', id))
export const pushBody = async (e) => must(await up('bodyweight', { id: e.id, day: e.day, kg: e.kg }))
export const dropBody = async (id) => must(await supabase.from('bodyweight').delete().eq('id', id))
