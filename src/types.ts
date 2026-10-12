export type StakingMode = 'liquid' | 'native';

export type TimeHorizon = {
  id: string;
  label: string;
  days: number;
  months: number;
};

export interface StakingRates {
  liquidApy: number; 
  nativeApy: number;
  networkAverageApy: number;
  solPriceUsd: number;
  inflationRate: number;
  mevBoostLiquid: number;
  mevBoostNative: number;
  validatorCommission: number; 
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
