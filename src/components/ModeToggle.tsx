import React from 'react';
import { StakingMode } from '../types';
import { Coins, Server } from 'lucide-react';

interface ModeToggleProps {
  mode: StakingMode;
  onChange: (mode: StakingMode) => void;
  liquidApy: number;
  nativeApy: number;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({
  mode,
  onChange,
  liquidApy,
  nativeApy,
}) => {
  return (
    <div className="w-full bg-[#eee9df] p-1.5 rounded-xl border border-[#ded9cf] flex flex-col sm:flex-row gap-1.5">
      {/* Option 1: Liquid (rkuSOL) */}
      <button
        type="button"
        onClick={() => onChange('liquid')}
        className={`flex-1 flex items-center justify-between sm:justify-start gap-3 px-4 py-3 rounded-lg text-left transition-all ${
          mode === 'liquid'
            ? 'bg-white text-[#142419] shadow-xs border border-[#d6cfbe]'
            : 'text-[#4d5e52] hover:text-[#142419] hover:bg-[#e7e1d5]'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-md flex items-center justify-center transition-colors ${
              mode === 'liquid'
                ? 'bg-[#1a3c2a] text-[#f7f5f0]'
                : 'bg-[#ded8cb] text-[#4d5e52]'
            }`}
          >
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm sm:text-base text-[#142419]">
                Liquid
              </span>
              <span className="text-xs font-mono font-medium text-[#2d6343] bg-[#eef4ee] px-1.5 py-0.5 rounded border border-[#cfe2d2]">
                rkuSOL
              </span>
            </div>
            <p className="text-xs text-[#637568] hidden sm:block mt-0.5">
              Instant liquidity · Usable across Solana DeFi
            </p>
          </div>
        </div>

        <div className="text-right sm:ml-auto">
          <div className="text-sm sm:text-base font-bold font-mono text-[#1a3c2a] tabular-nums">
            {liquidApy.toFixed(2)}%
          </div>
          <div className="text-[11px] text-[#6d7e72]">Net APY</div>
        </div>
      </button>

      {/* Option 2: Native (Raiku Validator) */}
      <button
        type="button"
        onClick={() => onChange('native')}
        className={`flex-1 flex items-center justify-between sm:justify-start gap-3 px-4 py-3 rounded-lg text-left transition-all ${
          mode === 'native'
            ? 'bg-white text-[#142419] shadow-xs border border-[#d6cfbe]'
            : 'text-[#4d5e52] hover:text-[#142419] hover:bg-[#e7e1d5]'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-md flex items-center justify-center transition-colors ${
              mode === 'native'
                ? 'bg-[#1a3c2a] text-[#f7f5f0]'
                : 'bg-[#ded8cb] text-[#4d5e52]'
            }`}
          >
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm sm:text-base text-[#142419]">
                Native
              </span>
              <span className="text-xs font-mono font-medium text-[#2d6343] bg-[#eef4ee] px-1.5 py-0.5 rounded border border-[#cfe2d2]">
                Raiku Validator
              </span>
            </div>
            <p className="text-xs text-[#637568] hidden sm:block mt-0.5">
              Direct delegation · Max yield + MEV tips
            </p>
          </div>
        </div>

        <div className="text-right sm:ml-auto">
          <div className="text-sm sm:text-base font-bold font-mono text-[#1a3c2a] tabular-nums">
            {nativeApy.toFixed(2)}%
          </div>
          <div className="text-[11px] text-[#6d7e72]">Net APY</div>
        </div>
      </button>
    </div>
  );
};
