// Everything is stored in kilograms. Pounds exist only at the screen edges.
const LB = 2.2046226218
export const kgTo = (kg, u) => (u === 'lb' ? Math.round(kg * LB * 10) / 10 : Math.round(kg * 100) / 100)
export const toKg = (v, u) => (u === 'lb' ? Math.round((v / LB) * 1000) / 1000 : v)
export const unitLabel = (u) => (u === 'lb' ? 'lb' : 'kg')
export const fmt = (kg, u) => `${kgTo(kg, u)} ${unitLabel(u)}`
export const stepFor = (u) => (u === 'lb' ? 5 : 2.5)
export const PLATES = { kg: { bar: 20, avail: [25, 20, 15, 10, 5, 2.5, 1.25] }, lb: { bar: 45, avail: [45, 35, 25, 10, 5, 2.5] } }
