const test = require('node:test');
const assert = require('node:assert/strict');
const { createCache } = require('../utils/cache');

test('returns cached value within TTL and expires afterwards', async () => {
  const cache = createCache({ ttlMs: 30 });

  cache.set('user:1', { name: 'Ada' });
  assert.deepEqual(cache.get('user:1'), { name: 'Ada' });

  await new Promise((resolve) => setTimeout(resolve, 40));

  assert.equal(cache.get('user:1'), undefined);
});

test('delete removes cached value immediately', () => {
  const cache = createCache({ ttlMs: 1000 });

  cache.set('user:2', { name: 'Grace' });
  cache.delete('user:2');

  assert.equal(cache.get('user:2'), undefined);
});
