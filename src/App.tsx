import React, { useState, useMemo } from 'react';
import { StakingMode, TimeHorizon } from './types';
import {
  DEFAULT_RATES,
  TIME_HORIZONS,
  generateChartData,
  getProjectionSummary,
} from './utils/calculations';
import { Header } from './components/Header';
import { ModeToggle } from './components/ModeToggle';
import { MainEstimatorCard } from './components/MainEstimatorCard';
import { SidebarSummary } from './components/SidebarSummary';
import { ComparisonSection } from './components/ComparisonSection';
import { Footer } from './components/Footer';

export default function App() {
  const [mode, setMode] = useState<StakingMode>('liquid');
  const [stakedAmount, setStakedAmount] = useState<number>(100);
  const [selectedHorizon, setSelectedHorizon] = useState<TimeHorizon>(TIME_HORIZONS[2]); // 1 year default
  const [showComparison, setShowComparison] = useState<boolean>(true);
  const rates = DEFAULT_RATES;

  // Dynamic calculations memoized for instant responsive updates
  const summary = useMemo(() => {
    return getProjectionSummary(
      stakedAmount,
      mode,
      selectedHorizon.days,
      selectedHorizon.label,
      rates
    );
  }, [stakedAmount, mode, selectedHorizon, rates]);

  const chartData = useMemo(() => {
    return generateChartData(stakedAmount, selectedHorizon.days, rates);
  }, [stakedAmount, selectedHorizon, rates]);

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#142419] flex flex-col font-sans selection:bg-[#1a3c2a] selection:text-[#f7f5f0]">
      {/* Simplified Header: Raiku Logo + Title Only */}
      <Header />

      {/* Main Page Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section & Staking Structure Selector */}
        <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#142419] tracking-tight">
            Staking Rewards Estimator
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#526456] max-w-2xl mx-auto leading-relaxed">
            Estimate projected staking yields and MEV rewards across Raiku liquid staking (rkuSOL) and direct native validator delegation.
          </p>

          {/* Mode Switcher (Liquid vs Native) */}
          <div className="mt-8 max-w-2xl mx-auto">
            <ModeToggle
              mode={mode}
              onChange={setMode}
              liquidApy={rates.liquidApy}
              nativeApy={rates.nativeApy}
            />
          </div>
        </div>

        {/* Desktop 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Main Estimator Card: ~65% width */}
          <div className="lg:col-span-7 xl:col-span-8">
            <MainEstimatorCard
              mode={mode}
              stakedAmount={stakedAmount}
              onStakedAmountChange={setStakedAmount}
              selectedHorizon={selectedHorizon}
              onSelectHorizon={setSelectedHorizon}
              summary={summary}
              chartData={chartData}
              rates={rates}
              showComparison={showComparison}
              onToggleComparison={() => setShowComparison(!showComparison)}
            />
          </div>

          {/* Right Sidebar: Stacked Cards */}
          <div className="lg:col-span-5 xl:col-span-4">
            <SidebarSummary
              mode={mode}
              rates={rates}
              summary={summary}
            />
          </div>
        </div>

        {/* Bottom Section: Liquid vs Native Comparison */}
        <ComparisonSection currentMode={mode} />
      </main>

      {/* Simplified Clean Footer */}
      <Footer />
    </div>
  );
}
