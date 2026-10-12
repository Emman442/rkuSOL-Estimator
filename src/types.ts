export type StakingMode = 'liquid' | 'native';

export type TimeHorizon = {
  id: string;
  label: string;
  days: number;
  months: number;
};

export interface StakingRates {
  liquidApy: number; // e.g. 4.82%
  nativeApy: number; // e.g. 5.77%
  networkAverageApy: number; // e.g. 4.10%
  solPriceUsd: number; // e.g. 152.40
  inflationRate: number; // e.g. 4.6%
  mevBoostLiquid: number; // e.g. 0.94%
  mevBoostNative: number; // e.g. 1.15%
  validatorCommission: number; // 0%
}

export interface ChartDataPoint {
  day: number;
  dateLabel: string;
  liquidRewards: number;
  nativeRewards: number;
  benchmarkRewards: number;
  liquidTotal: number;
  nativeTotal: number;
  benchmarkTotal: number;
}

export interface ProjectionSummary {
  stakedAmount: number;
  selectedDays: number;
  horizonLabel: string;
  activeApy: number;
  projectedRewardsSol: number;
  projectedRewardsUsd: number;
  totalBalanceSol: number;
  totalBalanceUsd: number;
  networkComparisonRewardsSol: number;
  alphaSol: number;
  alphaUsd: number;
  effectiveEpochs: number;
}
