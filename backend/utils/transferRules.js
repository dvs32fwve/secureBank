const DEFAULT_LIMIT = 1000;

const evaluateTransferRisk = ({ amount, category = 'Other', isIncoming = false }) => {
  const parsedAmount = Number(amount);
  const isOverLimit = Number.isFinite(parsedAmount) && parsedAmount > DEFAULT_LIMIT;

  if (isIncoming) {
    return {
      flagged: false,
      flagReason: '',
      ruleResults: [],
    };
  }

  const flagged = isOverLimit;
  const flagReason = flagged
    ? 'This transaction exceeds your daily transfer limit of $1,000'
    : '';

  return {
    flagged,
    flagReason,
    ruleResults: flagged
      ? [{ rule: 'daily_transfer_limit', threshold: DEFAULT_LIMIT, outcome: true, details: { amount: parsedAmount } }]
      : [],
  };
};

module.exports = { evaluateTransferRisk, DEFAULT_LIMIT };
