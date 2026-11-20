import assert from 'node:assert/strict'
import { kgTo, toKg, fmt, stepFor, PLATES } from './units.js'
import { plates } from './stats.js'

assert.equal(kgTo(100, 'kg'), 100)
assert.equal(kgTo(100, 'lb'), 220.5)
assert.equal(kgTo(62.5, 'kg'), 62.5)
assert.equal(toKg(55, 'kg'), 55)
assert.equal(kgTo(toKg(225, 'lb'), 'lb'), 225, 'a typed pound value displays back unchanged')
assert.equal(fmt(60, 'lb'), '132.3 lb')
assert.equal(stepFor('kg'), 2.5); assert.equal(stepFor('lb'), 5)
assert.deepEqual(plates(225, PLATES.lb.bar, PLATES.lb.avail).perSide, [45, 45], 'two 45 lb plates a side')
assert.deepEqual(plates(135, PLATES.lb.bar, PLATES.lb.avail).perSide, [45])
console.log('Units tests passed')
