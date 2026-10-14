import React, { useState, useMemo, useEffect } from 'react';
import { StakingMode, TimeHorizon, StakingRates } from './types';
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
import { DeFiIntegrationsSection } from './components/DefiIntegrationSection';

const SANCTUM_API_KEY = import.meta.env.VITE_SANCTUM_API_KEY || 'YOUR_KEY_HERE';

export default function App() {
  const [mode, setMode] = useState<StakingMode>('liquid');
  const [stakedAmount, setStakedAmount] = useState<number>(100);
  const [selectedHorizon, setSelectedHorizon] = useState<TimeHorizon>(TIME_HORIZONS[2]);
  const [showComparison, setShowComparison] = useState<boolean>(true);
  const [rates, setRates] = useState<StakingRates>(DEFAULT_RATES);
  const [isLoadingRates, setIsLoadingRates] = useState(true);

  useEffect(() => {
    async function fetchLiveRates() {
      try {
        // 1. CoinGecko SOL price
        const priceRes = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
        );
        const priceData = await priceRes.json();
        const solPrice = priceData?.solana?.usd ?? DEFAULT_RATES.solPriceUsd;

        // 2. Sanctum rkuSOL APY
        let liquidApy = DEFAULT_RATES.liquidApy;
        try {
          const sanctumRes = await fetch(
            `https://sanctum-api.ironforge.network/lsts/rkuSOL?apiKey=${SANCTUM_API_KEY}`
          );
          const sanctumData = await sanctumRes.json();
          // Adjust the path based on the actual response shape
          // Common fields: latestApy, avgApy, or data.latestApy
          const apyFromApi =
            sanctumData?.latestApy ??
            sanctumData?.avgApy ??
            sanctumData?.data?.latestApy ??
            sanctumData?.data?.avgApy;

          if (typeof apyFromApi === 'number' && apyFromApi > 0) {
            liquidApy = apyFromApi;
          }
        } catch (err) {
          console.warn('Sanctum APY fetch failed, using fallback', err);
        }

        setRates((prev) => ({
          ...prev,
          solPriceUsd: solPrice,
          liquidApy,
          // nativeApy stays as the default (or you can set it relative to liquid if you want)
        }));
      } catch (err) {
        console.error('Failed to fetch live rates', err);
        // keep DEFAULT_RATES
      } finally {
        setIsLoadingRates(false);
      }
    }

    fetchLiveRates();
  }, []);

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
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#142419] tracking-tight">
            Staking Rewards Estimator
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#526456] max-w-2xl mx-auto leading-relaxed">
            Estimate projected staking yields and MEV rewards across Raiku liquid staking (rkuSOL) and direct native validator delegation.
          </p>
          <div className="mt-8 max-w-2xl mx-auto">
            <ModeToggle
              mode={mode}
              onChange={setMode}
              liquidApy={rates.liquidApy}
              nativeApy={rates.nativeApy}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
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

          <div className="lg:col-span-5 xl:col-span-4">
            <SidebarSummary
              mode={mode}
              rates={rates}
              summary={summary}
            />
          </div>
        </div>

        <DeFiIntegrationsSection
          initialAmount={stakedAmount}
          solPriceUsd={rates.solPriceUsd}
          selectedHorizon={selectedHorizon}
        />

        <ComparisonSection currentMode={mode} />
      </main>

      <Footer />
    </div>
  );
}