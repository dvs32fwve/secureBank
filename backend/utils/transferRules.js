const DEFAULT_LIMIT = 1000;

const evaluateTransferRisk = ({ amount, category = 'Other', isIncoming = false, country = '' }) => {
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

  const outsideAllowedRegion = !isOverLimit && country && !['AU', 'NZ'].includes(country);
  const ruleResults = [];

  if (outsideAllowedRegion) {
    ruleResults.push({
      rule: 'outside_banking_region',
      threshold: 'AU,NZ',
      outcome: true,
      details: { country, amount: parsedAmount },
    });
  }

  return {
    flagged: outsideAllowedRegion,
    requiresVerification: outsideAllowedRegion,
    warn: isOverLimit,
    flagReason: outsideAllowedRegion ? `Transaction from ${country || 'Unknown'} - outside allowed region` : '',
    securityNotice: outsideAllowedRegion
      ? {
          title: 'Security Notice',
          message: 'This transfer request originated from outside the expected banking region (Australia/New Zealand).\n\nPlease verify your identity before continuing.\n\nGoverned by the CAIGA Framework.',
        }
      : null,
    ruleResults,
  };
};

module.exports = { evaluateTransferRisk, DEFAULT_LIMIT };
