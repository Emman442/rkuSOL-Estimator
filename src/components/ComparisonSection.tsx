import React from 'react';
import { StakingMode } from '../types';
import { Check, Coins, Server } from 'lucide-react';

interface ComparisonSectionProps {
  currentMode: StakingMode;
}

export const ComparisonSection: React.FC<ComparisonSectionProps> = ({
  currentMode,
}) => {
  return (
    <section id="comparison" className="mt-14 pt-10 border-t border-[#e2dcd0]">
      <div className="max-w-3xl mb-8">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#142419]">
          Liquid vs. Native Staking Comparison
        </h2>
        <p className="text-sm text-[#5a6b5e] mt-1.5">
          Choose between capital velocity with liquid tokens or direct validator delegation for sovereign custody.
        </p>
      </div>

      {/* Two comparative highlight cards without action buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {/* Card 1: Liquid Staking (rkuSOL) */}
        <div
          className={`rounded-2xl p-6 transition-all border ${
            currentMode === 'liquid'
              ? 'bg-[#fcfbf7] border-[#1a3c2a] shadow-xs'
              : 'bg-[#f8f6f0] border-[#ded9cf]'
          }`}
        >
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#1a3c2a] text-[#f7f5f0] flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-[#1a3c2a] bg-[#eef4ee] px-2.5 py-1 rounded-md border border-[#cfe2d2]">
                4.82% Net APY
              </span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-[#142419]">
            Liquid Staking (rkuSOL)
          </h3>
          <p className="text-sm font-medium text-[#2d6343] mt-1">
            Receive rkuSOL instantly. Usable across DeFi while it earns.
          </p>
          <p className="text-xs text-[#5f7164] mt-2 leading-relaxed">
            Mint rkuSOL against your staked SOL. The exchange rate naturally grows each epoch as staking and MEV rewards accrue. Exit anytime via DEX liquidity pools or redeem directly with zero unbonding lockup.
          </p>

          <ul className="mt-4 pt-4 border-t border-[#ede8de] space-y-2 text-xs text-[#425246]">
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#1a3c2a] shrink-0" />
              <span>Instant liquidity via Orca, Meteora & Raydium</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#1a3c2a] shrink-0" />
              <span>Use as collateral in Kamino Lend & Drift Protocol</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#1a3c2a] shrink-0" />
              <span>Auto-compounds without manual claim transactions</span>
            </li>
          </ul>
        </div>

        {/* Card 2: Native Staking */}
        <div
          className={`rounded-2xl p-6 transition-all border ${
            currentMode === 'native'
              ? 'bg-[#fcfbf7] border-[#1a3c2a] shadow-xs'
              : 'bg-[#f8f6f0] border-[#ded9cf]'
          }`}
        >
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#142419] text-[#f7f5f0] flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-[#1a3c2a] bg-[#eef4ee] px-2.5 py-1 rounded-md border border-[#cfe2d2]">
                5.77% Net APY
              </span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-[#142419]">
            Native (Raiku Validator)
          </h3>
          <p className="text-sm font-medium text-[#2d6343] mt-1">
            Stake directly to a Raiku validator. Earns staking rewards + MEV. 2–3 day unstaking.
          </p>
          <p className="text-xs text-[#5f7164] mt-2 leading-relaxed">
            Delegate directly to Raiku’s low-latency validator infrastructure. Retain total non-custodial ownership through your native Solana stake account with 100% MEV tip pass-through.
          </p>

          <ul className="mt-4 pt-4 border-t border-[#ede8de] space-y-2 text-xs text-[#425246]">
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#1a3c2a] shrink-0" />
              <span>Highest pure staking yield on Solana</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#1a3c2a] shrink-0" />
              <span>Direct vote account delegation (Zero smart contract risk)</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#1a3c2a] shrink-0" />
              <span>Institutional SLA with 99.99% block proposal success</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Comparison Spec Table */}
      <div className="overflow-x-auto bg-[#fcfbf9] border border-[#e5e1d8] rounded-xl shadow-xs">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-[#ded9cf] bg-[#f4f1ea] text-[#556759] uppercase font-semibold">
              <th className="py-3 px-4 sm:px-6">Feature / Specification</th>
              <th className="py-3 px-4 sm:px-6 text-[#1a3c2a]">Liquid (rkuSOL)</th>
              <th className="py-3 px-4 sm:px-6 text-[#142419]">Native (Raiku Validator)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ece8e0] text-[#405144]">
            <tr>
              <td className="py-3 px-4 sm:px-6 font-medium text-[#142419]">Net Staking APY</td>
              <td className="py-3 px-4 sm:px-6 font-mono font-bold text-[#1a3c2a] tabular-nums">4.82%</td>
              <td className="py-3 px-4 sm:px-6 font-mono font-bold text-[#142419] tabular-nums">5.77%</td>
            </tr>
            <tr>
              <td className="py-3 px-4 sm:px-6 font-medium text-[#142419]">Unstaking / Liquidity</td>
              <td className="py-3 px-4 sm:px-6 font-semibold text-[#1a3c2a]">Instant (via DEX pools)</td>
              <td className="py-3 px-4 sm:px-6">2–3 Days (Epoch cooldown)</td>
            </tr>
            <tr>
              <td className="py-3 px-4 sm:px-6 font-medium text-[#142419]">DeFi Collateral Support</td>
              <td className="py-3 px-4 sm:px-6 text-[#245436] font-medium">Full Solana DeFi integration</td>
              <td className="py-3 px-4 sm:px-6 text-[#728375]">None (held in stake account)</td>
            </tr>
            <tr>
              <td className="py-3 px-4 sm:px-6 font-medium text-[#142419]">MEV Fee Sharing</td>
              <td className="py-3 px-4 sm:px-6">Continuous token price appreciation</td>
              <td className="py-3 px-4 sm:px-6">Direct credit to stake account</td>
            </tr>
            <tr>
              <td className="py-3 px-4 sm:px-6 font-medium text-[#142419]">Validator Commission</td>
              <td className="py-3 px-4 sm:px-6 font-mono">0.0%</td>
              <td className="py-3 px-4 sm:px-6 font-mono">0.0%</td>
            </tr>
            <tr>
              <td className="py-3 px-4 sm:px-6 font-medium text-[#142419]">Custody Architecture</td>
              <td className="py-3 px-4 sm:px-6">SPL Stake Pool Program</td>
              <td className="py-3 px-4 sm:px-6">Native Solana Stake Account</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};
