import { describe, expect, it } from 'vitest';
import { calculateStakeSummary, deriveRiskIndex, formatTokenAmount } from '@/lib/staking';

describe('StakeVault math', () => {
  it('calculates principal, rewards, and total value', () => {
    const summary = calculateStakeSummary({
      principal: 1000,
      apy: 9.8,
      days: 30,
      cooldownWindowHours: 72,
    });

    expect(summary.principal).toBe(1000);
    expect(summary.reward).toBeCloseTo(8.05, 2);
    expect(summary.total).toBeCloseTo(1008.05, 2);
  });

  it('formats values consistently', () => {
    expect(formatTokenAmount(1234.5)).toBe('1,234.50');
    expect(formatTokenAmount(42, 0)).toBe('42');
  });

  it('keeps risk index bounded', () => {
    expect(deriveRiskIndex(250, 1000)).toBe(75);
    expect(deriveRiskIndex(0, 1000)).toBe(100);
    expect(deriveRiskIndex(2000, 1000)).toBe(0);
  });
});
