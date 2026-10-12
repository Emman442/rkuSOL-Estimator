import React from 'react';
import { ProjectionSummary, StakingMode, StakingRates } from '../types';
import { formatSol, formatUsd } from '../utils/calculations';
import { Clock, HelpCircle, Zap } from 'lucide-react';

interface SidebarSummaryProps {
  mode: StakingMode;
  rates: StakingRates;
  summary: ProjectionSummary;
}

export const SidebarSummary: React.FC<SidebarSummaryProps> = ({
  mode,
  rates,
  summary,
}) => {
  return (
    <div className="w-full space-y-4">
      {/* Card 1: Current Rates Card */}
      <div id="rates" className="bg-[#fbfaf7] border border-[#e5e1d8] rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#ece8e0]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#57695b]">
            Current Benchmark Rates
          </h3>
          <span className="text-[11px] font-mono text-[#255236] bg-[#eef4ee] px-2 py-0.5 rounded border border-[#cfe2d2]">
            0% Commission
          </span>
        </div>

        {/* Rate Comparison Rows */}
        <div className="mt-3.5 space-y-2.5">
          {/* Liquid Rate */}
          <div
            className={`p-3 rounded-lg border transition-all ${
              mode === 'liquid'
                ? 'bg-white border-[#1a3c2a]/30 shadow-xs'
                : 'bg-[#f5f2eb] border-[#e7e1d5] opacity-80'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#142419]">Liquid (rkuSOL)</span>
                {mode === 'liquid' && (
                  <span className="text-[10px] bg-[#1a3c2a] text-white px-1.5 py-0.2 rounded font-medium">
                    Active
                  </span>
                )}
              </div>
              <div className="text-base font-bold font-mono text-[#1a3c2a] tabular-nums">
                {rates.liquidApy.toFixed(2)}% <span className="text-xs font-normal text-[#6d7e72]">APY</span>
              </div>
            </div>
            <div className="text-[11px] text-[#6d7e72] mt-1 flex items-center justify-between">
              <span>Inflation 3.88% + MEV 0.94%</span>
              <span className="text-[#255236] font-medium">Auto-compounds</span>
            </div>
          </div>

          {/* Native Rate */}
          <div
            className={`p-3 rounded-lg border transition-all ${
              mode === 'native'
                ? 'bg-white border-[#1a3c2a]/30 shadow-xs'
                : 'bg-[#f5f2eb] border-[#e7e1d5] opacity-80'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#142419]">Native (Raiku Validator)</span>
                {mode === 'native' && (
                  <span className="text-[10px] bg-[#1a3c2a] text-white px-1.5 py-0.2 rounded font-medium">
                    Active
                  </span>
                )}
              </div>
              <div className="text-base font-bold font-mono text-[#1a3c2a] tabular-nums">
                {rates.nativeApy.toFixed(2)}% <span className="text-xs font-normal text-[#6d7e72]">APY</span>
              </div>
            </div>
            <div className="text-[11px] text-[#6d7e72] mt-1 flex items-center justify-between">
              <span>Inflation 4.62% + MEV 1.15%</span>
              <span className="text-[#255236] font-medium">Max base yield</span>
            </div>
          </div>
        </div>

        {/* Footnote */}
        <p className="mt-3 text-[11px] text-[#6d7e72] leading-tight">
          Net APY after validator commission. Rewards = Solana inflation + MEV.
        </p>
      </div>

      {/* Card 2: Live Projected Summary Card */}
      <div className="bg-[#fbfaf7] border border-[#e5e1d8] rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#ece8e0]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#57695b]">
            Projected Summary
          </h3>
          <span className="text-xs font-mono text-[#5b6e60]">
            {mode === 'liquid' ? 'Liquid Staking' : 'Native Delegation'}
          </span>
        </div>

        {/* Live metric table */}
        <div className="mt-3.5 space-y-2.5 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-[#f0ede6]">
            <span className="text-[#647668]">Active stake</span>
            <span className="font-mono font-semibold text-[#142419] tabular-nums">
              {formatSol(summary.stakedAmount, 2)} SOL
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#f0ede6]">
            <span className="text-[#647668]">Time horizon</span>
            <span className="font-mono font-semibold text-[#142419]">
              {summary.horizonLabel} ({summary.selectedDays} days)
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#f0ede6]">
            <span className="text-[#647668]">Effective APY</span>
            <span className="font-mono font-bold text-[#1a3c2a] tabular-nums">
              {summary.activeApy.toFixed(2)}%
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#f0ede6]">
            <span className="text-[#647668]">Projected rewards (SOL)</span>
            <span className="font-mono font-bold text-[#1a3c2a] tabular-nums">
              +{formatSol(summary.projectedRewardsSol, summary.projectedRewardsSol < 10 ? 3 : 2)} SOL
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#f0ede6]">
            <span className="text-[#647668]">Projected rewards (USD)</span>
            <span className="font-mono font-semibold text-[#142419] tabular-nums">
              +{formatUsd(summary.projectedRewardsUsd)}
            </span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-[#647668]">Final portfolio value</span>
            <span className="font-mono font-bold text-[#142419] tabular-nums">
              {formatSol(summary.totalBalanceSol, 2)} SOL
            </span>
          </div>
        </div>

        {/* Liquidity condition note */}
        <div className="mt-4 p-3 rounded-lg bg-[#f3efe7] border border-[#e2dbcd] text-xs">
          {mode === 'liquid' ? (
            <div className="flex items-start gap-2 text-[#245235]">
              <Zap className="w-4 h-4 shrink-0 mt-0.5 text-[#1a3c2a]" />
              <div>
                <span className="font-semibold text-[#1a3c2a]">Instant rkuSOL</span>
                <p className="text-[11px] text-[#4d5e52] mt-0.5 leading-snug">
                  Usable across Solana DeFi (Orca, Kamino, Meteora, Drift) with zero unbonding lockup.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 text-[#245235]">
              <Clock className="w-4 h-4 shrink-0 mt-0.5 text-[#1a3c2a]" />
              <div>
                <span className="font-semibold text-[#1a3c2a]">2–3 day unstaking period</span>
                <p className="text-[11px] text-[#4d5e52] mt-0.5 leading-snug">
                  Native Solana epoch warm-down before funds can be withdrawn back to wallet.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card 3: "What this shows" Explanation Card */}
      <div className="bg-[#fbfaf7] border border-[#e5e1d8] rounded-xl p-5 shadow-xs text-xs">
        <div className="flex items-center gap-2 pb-2.5 border-b border-[#ece8e0]">
          <HelpCircle className="w-3.5 h-3.5 text-[#526356]" />
          <h3 className="font-bold uppercase tracking-wider text-[#57695b] text-[11px]">
            What this shows
          </h3>
        </div>

        <div className="mt-3 space-y-2.5 text-[#506054] leading-relaxed">
          <p>
            Rewards come from Solana’s programmatic inflation schedule plus MEV collected by the Raiku validator cluster. The estimated figures shown are net of commission.
          </p>
          <p>
            Actual results vary slightly each epoch (approximately every 2.5 days) based on total network staking participation, validator cluster uptime, and on-chain arbitrage volume.
          </p>
        </div>
      </div>
    </div>
  );
};
