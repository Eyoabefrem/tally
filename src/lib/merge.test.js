import assert from 'node:assert/strict'
import { mergeById } from './merge.js'

const r = mergeById([{ id: 'a', v: 'cloud' }, { id: 'b', v: 'cloud' }], [{ id: 'b', v: 'local' }, { id: 'c', v: 'local' }])
assert.deepEqual(r.merged.map((x) => `${x.id}:${x.v}`), ['a:cloud', 'b:cloud', 'c:local'], 'cloud wins on duplicates')
assert.deepEqual(r.localOnly, [{ id: 'c', v: 'local' }], 'only unsynced rows get uploaded')
assert.deepEqual(mergeById([], [{ id: 'x' }]).localOnly, [{ id: 'x' }], 'first login uploads everything')
assert.deepEqual(mergeById([{ id: 'x' }], []).localOnly, [], 'nothing to upload')
console.log('Merge tests passed')
