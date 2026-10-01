export type StakeSummary = {
  principal: number;
  apy: number;
  days: number;
  reward: number;
  total: number;
  cooldownWindowHours: number;
  projectedApr: number;
};

export function calculateStakeSummary({
  principal,
  apy,
  days,
  cooldownWindowHours,
}: {
  principal: number;
  apy: number;
  days: number;
  cooldownWindowHours: number;
}): StakeSummary {
  const reward = principal * (apy / 100) * (days / 365);
  const total = principal + reward;

  return {
    principal,
    apy,
    days,
    reward,
    total,
    cooldownWindowHours,
    projectedApr: apy,
  };
}

export function formatTokenAmount(value: number, digits = 2) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function deriveRiskIndex(staked: number, totalPool: number) {
  const utilization = staked / totalPool;
  const safeRange = 1 - utilization;
  return Math.max(0, Math.min(100, Math.round(safeRange * 100)));
}
