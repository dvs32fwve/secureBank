const test = require('node:test');
const assert = require('node:assert/strict');
const { evaluateTransferRisk } = require('../utils/transferRules');

test('outgoing transfers over $1,000 use a limit-control message', () => {
  const result = evaluateTransferRisk({ amount: 1200, category: 'Other', isIncoming: false });

  assert.equal(result.flagged, true);
  assert.equal(result.flagReason, 'This transaction exceeds your daily transfer limit of $1,000');
});

test('incoming transfers over $1,000 are not flagged', () => {
  const result = evaluateTransferRisk({ amount: 1200, category: 'Other', isIncoming: true });

  assert.equal(result.flagged, false);
  assert.equal(result.flagReason, '');
});
