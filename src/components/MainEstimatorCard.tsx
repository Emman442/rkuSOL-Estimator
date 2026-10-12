import React from 'react';
import { ChartDataPoint, ProjectionSummary, StakingMode, StakingRates, TimeHorizon } from '../types';
import { YieldChart } from './YieldChart';
import { formatSol, formatUsd, TIME_HORIZONS } from '../utils/calculations';
import { Info, Sparkles, TrendingUp } from 'lucide-react';

interface MainEstimatorCardProps {
  mode: StakingMode;
  stakedAmount: number;
  onStakedAmountChange: (amount: number) => void;
  selectedHorizon: TimeHorizon;
  onSelectHorizon: (horizon: TimeHorizon) => void;
  summary: ProjectionSummary;
  chartData: ChartDataPoint[];
  rates: StakingRates;
  showComparison: boolean;
  onToggleComparison: () => void;
}

// Preset amounts for quick selection
const PRESET_AMOUNTS = [10, 50, 100, 500, 1000, 5000];

export const MainEstimatorCard: React.FC<MainEstimatorCardProps> = ({
  mode,
  stakedAmount,
  onStakedAmountChange,
  selectedHorizon,
  onSelectHorizon,
  summary,
  chartData,
  rates,
  showComparison,
  onToggleComparison,
}) => {
  // Slider uses power of 3 scale to smoothly handle 1 to 100,000 SOL
  // normalized slider position: 0 to 100
  const sliderMin = 1;
  const sliderMax = 100000;

  // Convert amount to slider 0-100 position using log scale
  const amountToSlider = (val: number) => {
    const minLog = Math.log(sliderMin);
    const maxLog = Math.log(sliderMax);
    const clamped = Math.max(sliderMin, Math.min(sliderMax, val));
    return ((Math.log(clamped) - minLog) / (maxLog - minLog)) * 100;
  };

  // Convert slider 0-100 position back to amount
  const sliderToAmount = (pos: number) => {
    const minLog = Math.log(sliderMin);
    const maxLog = Math.log(sliderMax);
    const val = Math.exp(minLog + (pos / 100) * (maxLog - minLog));
    if (val < 100) return Math.round(val);
    if (val < 1000) return Math.round(val / 10) * 10;
    if (val < 10000) return Math.round(val / 50) * 50;
    return Math.round(val / 500) * 500;
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = Number(e.target.value);
    const calculated = sliderToAmount(num);
    onStakedAmountChange(calculated);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/,/g, '');
    const num = parseFloat(cleaned);
    if (!isNaN(num)) {
      onStakedAmountChange(Math.max(0, num));
    } else if (e.target.value === '') {
      onStakedAmountChange(0);
    }
  };

  return (
    <div className="bg-[#fbfaf7] border border-[#e5e1d8] rounded-2xl p-6 sm:p-8 shadow-xs">
      {/* Title & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 border-b border-[#ece8e0]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#142419]">
            Estimated staking rewards
          </h2>
          <p className="text-xs sm:text-sm text-[#5a6b5e] mt-1">
            Simulate dynamic compounding yields, MEV capture, and epoch maturation.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 self-start sm:self-auto px-3 py-1 bg-[#ede8de] rounded-md text-xs font-mono text-[#255236] border border-[#dcd6c8]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1a3c2a]" />
          <span>{summary.activeApy.toFixed(2)}% Net APY</span>
        </div>
      </div>

      {/* Control 1: Staked Amount Slider + Numeric Input */}
      <div className="mt-6">
        <div className="flex items-center justify-between gap-4 mb-2">
          <label
            htmlFor="staked-input"
            className="text-xs font-semibold tracking-wider text-[#57695b] uppercase"
          >
            You’re Staking
          </label>
          <div className="text-xs font-mono text-[#6d7e72]">
            ≈ {formatUsd(stakedAmount * rates.solPriceUsd)} USD
          </div>
        </div>

        {/* Input box with currency badge */}
        <div className="relative flex items-center">
          <input
            id="staked-input"
            type="text"
            inputMode="decimal"
            value={stakedAmount === 0 ? '' : stakedAmount.toLocaleString('en-US')}
            onChange={handleInputChange}
            placeholder="0"
            className="w-full bg-white border border-[#ded8cb] focus:border-[#1a3c2a] focus:ring-1 focus:ring-[#1a3c2a] rounded-xl px-4 py-3.5 pr-20 text-lg sm:text-xl font-bold font-mono text-[#142419] transition-all outline-none tabular-nums"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1 bg-[#f4f1ea] border border-[#ded9cf] rounded-md text-xs font-bold font-mono text-[#1a3c2a]">
            <span>SOL</span>
          </div>
        </div>

        {/* Range slider */}
        <div className="mt-3.5 px-0.5">
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={amountToSlider(stakedAmount)}
            onChange={handleSliderChange}
            className="w-full h-2 cursor-pointer"
            aria-label="Staked amount range slider"
          />
          <div className="flex justify-between text-[11px] font-mono text-[#78887c] mt-1.5">
            <span>1 SOL</span>
            <span>100 SOL</span>
            <span>1,000 SOL</span>
            <span>10,000 SOL</span>
            <span>100,000 SOL</span>
          </div>
        </div>

        {/* Preset quick buttons */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          <span className="text-[11px] text-[#718275] mr-1">Presets:</span>
          {PRESET_AMOUNTS.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => onStakedAmountChange(amt)}
              className={`px-2.5 py-1 text-xs font-mono rounded-md border transition-all ${
                stakedAmount === amt
                  ? 'bg-[#1a3c2a] text-white border-[#1a3c2a] font-medium'
                  : 'bg-white text-[#4d5e52] border-[#ded9cf] hover:border-[#1a3c2a] hover:text-[#1a3c2a]'
              }`}
            >
              {amt.toLocaleString()} SOL
            </button>
          ))}
          <button
            type="button"
            onClick={() => onStakedAmountChange(10000)}
            className={`px-2.5 py-1 text-xs font-mono rounded-md border transition-all ${
              stakedAmount === 10000
                ? 'bg-[#1a3c2a] text-white border-[#1a3c2a] font-medium'
                : 'bg-white text-[#4d5e52] border-[#ded9cf] hover:border-[#1a3c2a] hover:text-[#1a3c2a]'
            }`}
          >
            10k SOL
          </button>
        </div>
      </div>

      {/* Control 2: Time Horizon Selector */}
      <div className="mt-7 pt-6 border-t border-[#ece8e0]">
        <div className="flex items-center justify-between gap-4 mb-2.5">
          <span className="text-xs font-semibold tracking-wider text-[#57695b] uppercase">
            Time Horizon
          </span>
          <span className="text-xs font-mono text-[#6d7e72]">
            {summary.effectiveEpochs} Solana epochs
          </span>
        </div>

        {/* Horizon tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 bg-[#eee9df] p-1.5 rounded-xl border border-[#ded9cf]">
          {TIME_HORIZONS.map((h) => {
            const isSelected = selectedHorizon.id === h.id;
            return (
              <button
                key={h.id}
                type="button"
                onClick={() => onSelectHorizon(h)}
                className={`py-2 px-3 text-xs font-medium rounded-lg transition-all text-center ${
                  isSelected
                    ? 'bg-white text-[#142419] font-semibold shadow-xs border border-[#d6cfbe]'
                    : 'text-[#5a6b5e] hover:text-[#142419] hover:bg-[#e7e1d5]'
                }`}
              >
                {h.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Large Projected Outcome Display */}
      <div className="mt-8 bg-gradient-to-br from-[#f2efe8] to-[#ebe6db] border border-[#dcd5c6] rounded-xl p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#5b6d60] flex items-center gap-1.5">
              <span>Projected Rewards ({selectedHorizon.label})</span>
              <TrendingUp className="w-3.5 h-3.5 text-[#245436]" />
            </div>

            {/* Main Big Number */}
            <div className="mt-1 flex items-baseline gap-2.5 flex-wrap">
              <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-mono text-[#1a3c2a] tracking-tight tabular-nums">
                +{formatSol(summary.projectedRewardsSol, summary.projectedRewardsSol < 10 ? 3 : 2)}
              </span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-[#1a3c2a]">
                SOL
              </span>
              <span className="text-base sm:text-lg font-mono text-[#546859] tabular-nums">
                ({formatUsd(summary.projectedRewardsUsd)})
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-start gap-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#d8d0bf]">
            <div className="text-xs text-[#637667]">Total Portfolio Balance</div>
            <div className="text-sm sm:text-base font-bold font-mono text-[#142419] tabular-nums">
              {formatSol(summary.totalBalanceSol, 2)} SOL
              <span className="text-xs font-normal text-[#5b6e60] ml-1.5 font-mono">
                ({formatUsd(summary.totalBalanceUsd)})
              </span>
            </div>
          </div>
        </div>

        {/* Extra Raiku Yield Comparison Highlight */}
        {summary.alphaSol > 0 && (
          <div className="mt-4 pt-3 border-t border-[#dfd8c9] flex items-center justify-between text-xs text-[#2c5c3e] flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#1a3c2a]" />
              <span>Raiku Validator Alpha vs Network Average:</span>
            </div>
            <div className="font-mono font-bold tabular-nums">
              +{formatSol(summary.alphaSol, 3)} SOL ({formatUsd(summary.alphaUsd)})
            </div>
          </div>
        )}
      </div>

      {/* Yield Chart */}
      <div className="mt-6">
        <YieldChart
          data={chartData}
          mode={mode}
          solPriceUsd={rates.solPriceUsd}
          showComparison={showComparison}
          onToggleComparison={onToggleComparison}
        />
      </div>

      {/* Disclaimer / Note under Chart */}
      <div className="mt-4 flex items-start gap-2.5 p-3.5 bg-[#f4f1ea] border border-[#e5e0d4] rounded-lg text-xs text-[#5f7163] leading-relaxed">
        <Info className="w-4 h-4 text-[#728376] shrink-0 mt-0.5" />
        <p>
          Actual yield varies each epoch based on network participation, validator slot performance, leader schedules, and MEV tips collected via the Raiku block engine. Compounding is calculated on ~2.5 day Solana epoch intervals.
        </p>
      </div>
    </div>
  );
};
