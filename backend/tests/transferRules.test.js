const test = require('node:test');
const assert = require('node:assert/strict');
const { evaluateTransferRisk } = require('../utils/transferRules');

test('outgoing transfers over $1,000 warn but do not flag when location is AU', () => {
  const result = evaluateTransferRisk({ amount: 1200, category: 'Other', isIncoming: false, country: 'AU' });

  assert.equal(result.flagged, false);
  assert.equal(result.warn, true);
  assert.equal(result.requiresVerification, false);
  assert.equal(result.flagReason, '');
  assert.equal(result.securityNotice, null);
  assert.deepEqual(result.ruleResults, []);
});

test('outgoing transfers from outside allowed region are flagged', () => {
  const result = evaluateTransferRisk({ amount: 500, category: 'Other', isIncoming: false, country: 'US' });

  assert.equal(result.flagged, true);
  assert.equal(result.requiresVerification, true);
  assert.equal(result.flagReason, 'Transaction from US - outside allowed region');
  assert.equal(result.warn, false);
  assert.equal(result.securityNotice.title, 'Security Notice');
  assert.match(result.securityNotice.message, /outside the expected banking region/);
  assert.equal(result.ruleResults.length, 1);
});

test('incoming transfers over $1,000 are not flagged', () => {
  const result = evaluateTransferRisk({ amount: 1200, category: 'Other', isIncoming: true, country: 'US' });

  assert.equal(result.flagged, false);
  assert.equal(result.warn, false);
  assert.equal(result.flagReason, '');
});
