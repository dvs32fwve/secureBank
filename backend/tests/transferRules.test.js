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

test('outgoing transfers over $1,000 also apply the outside-region flag', () => {
  const result = evaluateTransferRisk({ amount: 3000, category: 'Other', isIncoming: false, country: 'US' });

  assert.equal(result.flagged, true);
  assert.equal(result.warn, true);
  assert.equal(result.requiresVerification, true);
  assert.equal(result.flagReason, 'Transaction from US - outside allowed region');
  assert.equal(result.securityNotice.title, 'Security Notice');
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

test('outgoing transfers repeated to the same recipient within 10 minutes are flagged', () => {
  const result = evaluateTransferRisk({
    amount: 300,
    category: 'Other',
    isIncoming: false,
    country: 'AU',
    recipient: 'syed21abdullah@gmail.com',
    recentTransfers: [
      { amount: 300, recipient: 'syed21abdullah@gmail.com', type: 'transfer', timestamp: Date.now() - 5 * 60 * 1000 },
    ],
  });

  assert.equal(result.flagged, true);
  assert.equal(result.requiresVerification, false);
  assert.equal(result.warn, false);
  assert.equal(result.flagReason, 'Rapid repeated transfer detected: same recipient and amount within 10 minutes');
  assert.equal(result.ruleResults.length, 1);
  assert.equal(result.ruleResults[0].rule, 'rapid_repeated_transfer');
});

test('incoming transfers over $1,000 are not flagged', () => {
  const result = evaluateTransferRisk({ amount: 1200, category: 'Other', isIncoming: true, country: 'US' });

  assert.equal(result.flagged, false);
  assert.equal(result.warn, false);
  assert.equal(result.flagReason, '');
});
