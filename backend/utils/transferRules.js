const DEFAULT_LIMIT = 1000;
const RAPID_TRANSFER_WINDOW_MS = 10 * 60 * 1000;

const getTimestampMs = (value) => {
  if (!value) return null;
  if (typeof value === 'number') return value;
  if (typeof value.toDate === 'function') return value.toDate().getTime();
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const evaluateTransferRisk = ({ amount, category = 'Other', isIncoming = false, country = '', recipient = '', recentTransfers = [] }) => {
  const parsedAmount = Number(amount);
  const isOverLimit = Number.isFinite(parsedAmount) && parsedAmount > DEFAULT_LIMIT;

  if (isIncoming) {
    return {
      flagged: false,
      requiresVerification: false,
      warn: false,
      flagReason: '',
      securityNotice: null,
      ruleResults: [],
    };
  }

  const normalizedRecipient = String(recipient || '').toLowerCase();
  const outsideAllowedRegion = country && !['AU', 'NZ'].includes(country);
  const now = Date.now();
  const repeatedTransfer = recentTransfers.some((tx) => {
    const txRecipient = String(tx?.recipient || '').toLowerCase();
    const txAmount = Number(tx?.amount);
    const txTimestamp = getTimestampMs(tx?.timestamp);

    if (!txRecipient || txRecipient !== normalizedRecipient) return false;
    if (!Number.isFinite(txAmount) || txAmount !== parsedAmount) return false;
    if (txTimestamp === null || txTimestamp > now) return false;

    const elapsedMs = now - txTimestamp;
    return elapsedMs <= RAPID_TRANSFER_WINDOW_MS;
  });

  const ruleResults = [];

  if (outsideAllowedRegion) {
    ruleResults.push({
      rule: 'outside_banking_region',
      threshold: 'AU,NZ',
      outcome: true,
      details: { country, amount: parsedAmount },
    });
  }

  if (repeatedTransfer) {
    ruleResults.push({
      rule: 'rapid_repeated_transfer',
      threshold: '10 minutes',
      outcome: true,
      details: { amount: parsedAmount, windowMs: RAPID_TRANSFER_WINDOW_MS },
    });
  }

  const flagged = outsideAllowedRegion || repeatedTransfer;
  const requiresVerification = outsideAllowedRegion;
  const flagReason = repeatedTransfer
    ? 'Rapid repeated transfer detected: same recipient and amount within 10 minutes'
    : outsideAllowedRegion
      ? `Transaction from ${country || 'Unknown'} - outside allowed region`
      : '';

  return {
    flagged,
    requiresVerification,
    warn: isOverLimit,
    flagReason,
    securityNotice: outsideAllowedRegion
      ? {
          title: 'Security Notice',
          message: 'This transfer request originated from outside the expected banking region (Australia/New Zealand).\n\nPlease verify your identity before continuing.\n\nGoverned by the CAIGA Framework.',
        }
      : repeatedTransfer
        ? {
            title: 'Security Notice',
            message: 'This transfer was repeated in a short period to the same recipient.\n\nPlease review the transaction for suspicious activity.\n\nGoverned by the CAIGA Framework.',
          }
        : null,
    ruleResults,
  };
};

module.exports = { evaluateTransferRisk, DEFAULT_LIMIT };
