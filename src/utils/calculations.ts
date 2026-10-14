import { ChartDataPoint, ProjectionSummary, StakingMode, StakingRates } from '../types';

export const DEFAULT_RATES: StakingRates = {
  liquidApy: 4.80,
  nativeApy: 5.77, 
  networkAverageApy: 4.10,
  solPriceUsd: 154.20,
  inflationRate: 4.50,
  mevBoostLiquid: 0.82,
  mevBoostNative: 1.27,
  validatorCommission: 0.0,
};

export const TIME_HORIZONS = [
  { id: '30d', label: '30 days', days: 30, months: 1 },
  { id: '90d', label: '90 days', days: 90, months: 3 },
  { id: '1y', label: '1 year', days: 365, months: 12 },
  { id: '2y', label: '2 years', days: 730, months: 24 },
  { id: '3y', label: '3 years', days: 1095, months: 36 },
];


export function calculateCompoundReturn(
  principal: number,
  apyPercentage: number,
  days: number
): { rewards: number; total: number } {
  if (principal <= 0 || days <= 0) {
    return { rewards: 0, total: principal };
  }

  const rate = apyPercentage / 100;
  const years = days / 365.25;

  const epochsPerYear = 146.1;
  const n = epochsPerYear;
  const total = principal * Math.pow(1 + rate / n, n * years);
  const rewards = total - principal;

  return { rewards, total };
}


export function generateChartData(
  principal: number,
  days: number,
  rates: StakingRates
): ChartDataPoint[] {
  const steps = 30; 
  const interval = days / steps;
  const points: ChartDataPoint[] = [];

  const now = new Date();

  for (let i = 0; i <= steps; i++) {
    const currentDay = Math.round(i * interval);
    const targetDate = new Date(now.getTime() + currentDay * 86400000);
    const month = targetDate.toLocaleDateString('en-US', { month: 'short' });
    const dayOfMonth = targetDate.getDate();
    const year = targetDate.getFullYear();

    const dateLabel = days > 365 ? `${month} '${year.toString().slice(2)}` : `${month} ${dayOfMonth}`;

    const liquid = calculateCompoundReturn(principal, rates.liquidApy, currentDay);
    const native = calculateCompoundReturn(principal, rates.nativeApy, currentDay);
    const benchmark = calculateCompoundReturn(principal, rates.networkAverageApy, currentDay);

    points.push({
      day: currentDay,
      dateLabel: i === 0 ? 'Today' : dateLabel,
      liquidRewards: liquid.rewards,
      nativeRewards: native.rewards,
      benchmarkRewards: benchmark.rewards,
      liquidTotal: liquid.total,
      nativeTotal: native.total,
      benchmarkTotal: benchmark.total,
    });
  }

  return points;
}

/**
 * Calculates high-level projection metrics for the selected options.
 */
export function getProjectionSummary(
  principal: number,
  mode: StakingMode,
  days: number,
  horizonLabel: string,
  rates: StakingRates
): ProjectionSummary {
  const activeApy = mode === 'liquid' ? rates.liquidApy : rates.nativeApy;
  const activeResult = calculateCompoundReturn(principal, activeApy, days);
  const benchmarkResult = calculateCompoundReturn(principal, rates.networkAverageApy, days);

  const projectedRewardsSol = activeResult.rewards;
  const projectedRewardsUsd = projectedRewardsSol * rates.solPriceUsd;
  const totalBalanceSol = activeResult.total;
  const totalBalanceUsd = totalBalanceSol * rates.solPriceUsd;

  const benchmarkRewardsSol = benchmarkResult.rewards;
  const alphaSol = projectedRewardsSol - benchmarkRewardsSol;
  const alphaUsd = alphaSol * rates.solPriceUsd;

  const effectiveEpochs = Math.round(days / 2.5);

  return {
    stakedAmount: principal,
    selectedDays: days,
    horizonLabel,
    activeApy,
    projectedRewardsSol,
    projectedRewardsUsd,
    totalBalanceSol,
    totalBalanceUsd,
    networkComparisonRewardsSol: benchmarkRewardsSol,
    alphaSol,
    alphaUsd,
    effectiveEpochs,
  };
}

/**
 * Formats numbers into high-precision, scannable strings.
 */
export function formatSol(val: number, precision: number = 2): string {
  if (isNaN(val)) return '0.00';
  return val.toLocaleString('en-US', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });
}

export function formatUsd(val: number, precision: number = 2): string {
  if (isNaN(val)) return '$0.00';
  return `$${val.toLocaleString('en-US', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  })}`;
}
