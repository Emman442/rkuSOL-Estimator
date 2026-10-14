import React, { useState } from 'react';
import { TimeHorizon } from '../types';
import { TIME_HORIZONS, formatSol, formatUsd } from '../utils/calculations';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface DeFiIntegrationsSectionProps {
  initialAmount: number;
  solPriceUsd: number;
  selectedHorizon: TimeHorizon;
}

export const DeFiIntegrationsSection: React.FC<DeFiIntegrationsSectionProps> = ({
  initialAmount,  
  solPriceUsd,
  selectedHorizon,
}) => {
  // Exponent state
  const [exponentAmount, setExponentAmount] = useState<number>(initialAmount || 100);
  const [exponentFixedApy, setExponentFixedApy] = useState<number>(7.0);
  const [exponentHorizon, setExponentHorizon] = useState<TimeHorizon>(selectedHorizon);

  // Loopscale state
  const [loopscaleAmount, setLoopscaleAmount] = useState<number>(initialAmount || 100);
  const [leverage, setLeverage] = useState<number>(1.0);
  const [loopscaleBaseApy, setLoopscaleBaseApy] = useState<number>(5.5);
  const [loopscaleHorizon, setLoopscaleHorizon] = useState<TimeHorizon>(selectedHorizon);

  // Exponent Calculations
  const exponentDays = exponentHorizon.days;
  const exponentYearFraction = exponentDays / 365.25;
  const exponentRewardsSol = exponentAmount * (exponentFixedApy / 100) * exponentYearFraction;
  const exponentTotalSol = exponentAmount + exponentRewardsSol;
  const exponentRewardsUsd = exponentRewardsSol * solPriceUsd;
  const exponentTotalUsd = exponentTotalSol * solPriceUsd;

  // Loopscale Calculations
  const borrowCostApy = 3.8;
  const loopscaleEffectiveApy =
    leverage === 1.0
      ? loopscaleBaseApy
      : Math.max(0, loopscaleBaseApy * leverage - borrowCostApy * (leverage - 1));

  const loopscaleDays = loopscaleHorizon.days;
  const loopscaleYearFraction = loopscaleDays / 365.25;
  const loopscaleRewardsSol = loopscaleAmount * (loopscaleEffectiveApy / 100) * loopscaleYearFraction;
  const loopscaleTotalSol = loopscaleAmount + loopscaleRewardsSol;
  const loopscaleRewardsUsd = loopscaleRewardsSol * solPriceUsd;
  const loopscaleTotalUsd = loopscaleTotalSol * solPriceUsd;

  const grossExposureSol = loopscaleAmount * leverage;
  const borrowedAmountSol = loopscaleAmount * (leverage - 1);

  return (
    <section className="mt-14 pt-10 border-t border-[#e2dcd0]">
      {/* Section Header */}
      <div className="max-w-3xl mb-8">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#142419]">
          Put rkuSOL to work
        </h2>
        <p className="text-sm text-[#5a6b5e] mt-1.5">
          Estimate outcomes if you use rkuSOL on Exponent or Loopscale. Rates shown are illustrative.
        </p>
      </div>

      {/* Two Side-by-Side Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Exponent — Fixed rate (PT-rkuSOL) */}
        <div className="bg-[#fbfaf7] border border-[#e5e1d8] rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between">
          <div>
            {/* Card Header */}
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#ece8e0]">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-[#142419]">
                    Exponent
                  </h3>
                  <span className="text-[11px] font-mono text-[#5b6e60] bg-[#eeeae0] px-2 py-0.5 rounded border border-[#ded8cb]">
                    Fixed rate (PT-rkuSOL)
                  </span>
                </div>
                <div className="text-xs font-mono text-[#255236] font-semibold mt-1">
                  {exponentFixedApy.toFixed(1)}% Illustrative Fixed APY
                </div>
              </div>
              <img
                src="https://pbs.twimg.com/profile_images/2031739648498860032/3OLuGYJK_400x400.jpg"
                alt="Exponent Logo"
                className="w-10 h-10 rounded-sm"
              />
            </div>

            {/* Short Explanation */}
            <p className="text-xs text-[#5f7164] mt-4 leading-relaxed">
              Lock in a fixed rate by buying PT-rkuSOL until maturity. You give up variable yield in exchange for a known rate.
            </p>

            {/* Inputs Section */}
            <div className="mt-5 space-y-4">
              {/* Input: Amount of rkuSOL */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <label
                    htmlFor="exponent-amount"
                    className="font-semibold text-[#57695b] uppercase tracking-wider text-[11px]"
                  >
                    Amount of rkuSOL
                  </label>
                  <span className="font-mono text-[#6d7e72]">
                    ≈ {formatUsd(exponentAmount * solPriceUsd)}
                  </span>
                </div>
                <div className="relative flex items-center">
                  <input
                    id="exponent-amount"
                    type="number"
                    min="1"
                    max="100000"
                    step="10"
                    value={exponentAmount || ''}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setExponentAmount(isNaN(val) ? 0 : Math.max(0, val));
                    }}
                    placeholder="100"
                    className="w-full bg-white border border-[#ded8cb] focus:border-[#1a3c2a] focus:ring-1 focus:ring-[#1a3c2a] rounded-xl px-3.5 py-2.5 pr-20 text-sm font-bold font-mono text-[#142419] outline-none tabular-nums"
                  />
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-[#f4f1ea] border border-[#ded9cf] rounded text-[11px] font-bold font-mono text-[#1a3c2a]">
                    rkuSOL
                  </div>
                </div>
              </div>

              {/* Input: Fixed Rate Input (Editable) */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <label
                    htmlFor="exponent-rate"
                    className="font-semibold text-[#57695b] uppercase tracking-wider text-[11px]"
                  >
                    Illustrative fixed APY
                  </label>
                  <span className="text-[11px] text-[#78887c]">Default 7.0%</span>
                </div>
                <div className="relative flex items-center">
                  <input
                    id="exponent-rate"
                    type="number"
                    min="0"
                    max="50"
                    step="0.1"
                    value={exponentFixedApy}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setExponentFixedApy(isNaN(val) ? 0 : Math.max(0, val));
                    }}
                    className="w-full bg-white border border-[#ded8cb] focus:border-[#1a3c2a] focus:ring-1 focus:ring-[#1a3c2a] rounded-xl px-3.5 py-2.5 pr-14 text-sm font-bold font-mono text-[#142419] outline-none tabular-nums"
                  />
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-[#f4f1ea] border border-[#ded9cf] rounded text-[11px] font-bold font-mono text-[#1a3c2a]">
                    % APY
                  </div>
                </div>
              </div>

              {/* Input: Time Horizon */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-[#57695b] uppercase tracking-wider text-[11px]">
                    Time Horizon
                  </span>
                  <span className="font-mono text-[#6d7e72] text-[11px]">
                    {exponentHorizon.days} days
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1 bg-[#eee9df] p-1 rounded-lg border border-[#ded9cf]">
                  {TIME_HORIZONS.map((h) => {
                    const isSelected = exponentHorizon.id === h.id;
                    return (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => setExponentHorizon(h)}
                        className={`py-1.5 text-[11px] font-medium rounded transition-all text-center ${
                          isSelected
                            ? 'bg-white text-[#142419] font-semibold shadow-2xs border border-[#d6cfbe]'
                            : 'text-[#5a6b5e] hover:text-[#142419]'
                        }`}
                      >
                        {h.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Outputs Box */}
            <div className="mt-6 bg-[#f4f1ea] border border-[#e2dbce] rounded-xl p-4.5 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#5f7164]">Projected rewards</span>
                <span className="font-mono font-bold text-[#1a3c2a] text-sm tabular-nums">
                  +{formatSol(exponentRewardsSol, 3)} rkuSOL
                  <span className="text-[11px] font-normal text-[#586a5d] ml-1">
                    ({formatUsd(exponentRewardsUsd)})
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-t border-[#e8e2d4]">
                <span className="text-[#5f7164]">Projected value at maturity</span>
                <span className="font-mono font-bold text-[#142419] tabular-nums">
                  {formatSol(exponentTotalSol, 2)} rkuSOL ({formatUsd(exponentTotalUsd)})
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-t border-[#e8e2d4]">
                <span className="text-[#5f7164]">Effective APY</span>
                <span className="font-mono font-bold text-[#1a3c2a] tabular-nums">
                  {exponentFixedApy.toFixed(2)}% (Locked)
                </span>
              </div>
            </div>
          </div>

          {/* Small Note */}
          <p className="mt-5 text-[11px] text-[#7a8c7e] leading-relaxed border-t border-[#ece8e0] pt-3">
            Actual implied rates change with the market. Check Exponent for live quotes.
          </p>
        </div>

        {/* Card 2: Loopscale — Lend or loop */}
        <div className="bg-[#fbfaf7] border border-[#e5e1d8] rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between">
          <div>
            {/* Card Header */}
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#ece8e0]">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-[#142419]">
                    Loopscale
                  </h3>
                  <span className="text-[11px] font-mono text-[#5b6e60] bg-[#eeeae0] px-2 py-0.5 rounded border border-[#ded8cb]">
                    Lend or loop
                  </span>
                </div>
                <div className="text-xs font-mono text-[#255236] font-semibold mt-1">
                  {loopscaleEffectiveApy.toFixed(2)}% Net Effective APY
                  {leverage > 1.0 && (
                    <span className="text-[#586a5d] font-normal ml-1">
                      ({leverage.toFixed(1)}x leverage)
                    </span>
                  )}
                </div>
              </div>
              <img
                src="https://pbs.twimg.com/profile_images/1896677394506784768/f_moNZvF_400x400.png"
                alt="Loopscale Logo"
                className="w-10 h-10 rounded-sm"
              />
            </div>

            {/* Short Explanation */}
            <p className="text-xs text-[#5f7164] mt-4 leading-relaxed">
              Use rkuSOL as collateral on Loopscale’s fixed-rate order book. You can lend it or loop for leveraged exposure.
            </p>

            {/* Inputs Section */}
            <div className="mt-5 space-y-4">
              {/* Input: Amount of rkuSOL */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <label
                    htmlFor="loopscale-amount"
                    className="font-semibold text-[#57695b] uppercase tracking-wider text-[11px]"
                  >
                    Amount of rkuSOL
                  </label>
                  <span className="font-mono text-[#6d7e72]">
                    ≈ {formatUsd(loopscaleAmount * solPriceUsd)}
                  </span>
                </div>
                <div className="relative flex items-center">
                  <input
                    id="loopscale-amount"
                    type="number"
                    min="1"
                    max="100000"
                    step="10"
                    value={loopscaleAmount || ''}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setLoopscaleAmount(isNaN(val) ? 0 : Math.max(0, val));
                    }}
                    placeholder="100"
                    className="w-full bg-white border border-[#ded8cb] focus:border-[#1a3c2a] focus:ring-1 focus:ring-[#1a3c2a] rounded-xl px-3.5 py-2.5 pr-20 text-sm font-bold font-mono text-[#142419] outline-none tabular-nums"
                  />
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-[#f4f1ea] border border-[#ded9cf] rounded text-[11px] font-bold font-mono text-[#1a3c2a]">
                    rkuSOL
                  </div>
                </div>
              </div>

              {/* Input: Leverage slider (1x to 3x, default 1x) */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <label
                    htmlFor="leverage-slider"
                    className="font-semibold text-[#57695b] uppercase tracking-wider text-[11px]"
                  >
                    Leverage Exposure
                  </label>
                  <span className="font-mono font-bold text-[#1a3c2a]">
                    {leverage.toFixed(1)}x
                    {leverage > 1.0 ? ' (Looping)' : ' (Unleveraged)'}
                  </span>
                </div>

                <div className="px-0.5 mt-1">
                  <input
                    id="leverage-slider"
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={leverage}
                    onChange={(e) => setLeverage(parseFloat(e.target.value))}
                    className="w-full h-2 cursor-pointer"
                    aria-label="Leverage slider from 1x to 3x"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-[#78887c] mt-1">
                    <span>1.0x</span>
                    <span>1.5x</span>
                    <span>2.0x</span>
                    <span>2.5x</span>
                    <span>3.0x</span>
                  </div>
                </div>
              </div>

              {/* Input: Illustrative Net APY Input (Editable, default 5.5%) */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <label
                    htmlFor="loopscale-apy"
                    className="font-semibold text-[#57695b] uppercase tracking-wider text-[11px]"
                  >
                    Illustrative net APY
                  </label>
                  <span className="text-[11px] text-[#78887c]">Default 5.5%</span>
                </div>
                <div className="relative flex items-center">
                  <input
                    id="loopscale-apy"
                    type="number"
                    min="0"
                    max="40"
                    step="0.1"
                    value={loopscaleBaseApy}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setLoopscaleBaseApy(isNaN(val) ? 0 : Math.max(0, val));
                    }}
                    className="w-full bg-white border border-[#ded8cb] focus:border-[#1a3c2a] focus:ring-1 focus:ring-[#1a3c2a] rounded-xl px-3.5 py-2.5 pr-14 text-sm font-bold font-mono text-[#142419] outline-none tabular-nums"
                  />
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-[#f4f1ea] border border-[#ded9cf] rounded text-[11px] font-bold font-mono text-[#1a3c2a]">
                    % Base
                  </div>
                </div>
              </div>

              {/* Input: Time Horizon */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-[#57695b] uppercase tracking-wider text-[11px]">
                    Time Horizon
                  </span>
                  <span className="font-mono text-[#6d7e72] text-[11px]">
                    {loopscaleHorizon.days} days
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1 bg-[#eee9df] p-1 rounded-lg border border-[#ded9cf]">
                  {TIME_HORIZONS.map((h) => {
                    const isSelected = loopscaleHorizon.id === h.id;
                    return (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => setLoopscaleHorizon(h)}
                        className={`py-1.5 text-[11px] font-medium rounded transition-all text-center ${
                          isSelected
                            ? 'bg-white text-[#142419] font-semibold shadow-2xs border border-[#d6cfbe]'
                            : 'text-[#5a6b5e] hover:text-[#142419]'
                        }`}
                      >
                        {h.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Outputs Box */}
            <div className="mt-6 bg-[#f4f1ea] border border-[#e2dbce] rounded-xl p-4.5 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#5f7164]">Projected rewards</span>
                <span className="font-mono font-bold text-[#1a3c2a] text-sm tabular-nums">
                  +{formatSol(loopscaleRewardsSol, 3)} rkuSOL
                  <span className="text-[11px] font-normal text-[#586a5d] ml-1">
                    ({formatUsd(loopscaleRewardsUsd)})
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-t border-[#e8e2d4]">
                <span className="text-[#5f7164]">Projected value</span>
                <span className="font-mono font-bold text-[#142419] tabular-nums">
                  {formatSol(loopscaleTotalSol, 2)} rkuSOL ({formatUsd(loopscaleTotalUsd)})
                </span>
              </div>

              {leverage > 1.0 && (
                <div className="flex items-center justify-between py-1 border-t border-[#e8e2d4] text-[11px]">
                  <span className="text-[#5f7164]">Gross exposure / Borrowed</span>
                  <span className="font-mono text-[#255236] tabular-nums">
                    {formatSol(grossExposureSol, 1)} rkuSOL / {formatSol(borrowedAmountSol, 1)} SOL debt
                  </span>
                </div>
              )}

              {/* Note about liquidation risk when leveraged */}
              {leverage > 1.0 ? (
                <div className="mt-2 pt-2 border-t border-[#e2dbce] flex items-start gap-2 text-[#8b4513] bg-[#faebd7]/50 p-2 rounded-lg text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#b45309]" />
                  <p className="leading-snug">
                    <span className="font-semibold text-[#92400e]">Liquidation risk:</span> Borrowing SOL against rkuSOL collateral introduces margin debt. Position is subject to liquidation thresholds if the rkuSOL/SOL price ratio fluctuates or borrow rates rise.
                  </p>
                </div>
              ) : (
                <div className="mt-2 pt-2 border-t border-[#e2dbce] flex items-center gap-1.5 text-[#596d5e] text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2d6343] shrink-0" />
                  <span>1.0x unleveraged position (no debt or liquidation threshold).</span>
                </div>
              )}
            </div>
          </div>

          {/* Small Note */}
          <p className="mt-5 text-[11px] text-[#7a8c7e] leading-relaxed border-t border-[#ece8e0] pt-3">
            Rates and available offers change. Looping increases risk.
          </p>
        </div>
      </div>

      {/* Required Bottom Section Disclaimer */}
      <div className="mt-6 p-4 rounded-xl bg-[#f4f1ea] border border-[#ded8cb] text-xs text-[#637667] text-center leading-relaxed">
        These are simplified estimates only. Actual rates, liquidity, and risks on Exponent and Loopscale vary. Not financial advice.
      </div>
    </section>
  );
};
