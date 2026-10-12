import React, { useState, useId } from 'react';
import { ChartDataPoint, StakingMode } from '../types';
import { formatSol, formatUsd } from '../utils/calculations';

interface YieldChartProps {
  data: ChartDataPoint[];
  mode: StakingMode;
  solPriceUsd: number;
  showComparison: boolean;
  onToggleComparison: () => void;
}

export const YieldChart: React.FC<YieldChartProps> = ({
  data,
  mode,
  solPriceUsd,
  showComparison,
  onToggleComparison,
}) => {
  const gradientId = useId();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  // Find max reward value to scale Y axis nicely
  const maxActive = Math.max(
    ...data.map((d) => (mode === 'liquid' ? d.liquidRewards : d.nativeRewards))
  );
  const maxBenchmark = Math.max(...data.map((d) => d.benchmarkRewards));
  const maxY = Math.max(maxActive, maxBenchmark, 0.001) * 1.15; // 15% top padding

  const width = 640;
  const height = 230;
  const paddingLeft = 46;
  const paddingRight = 16;
  const paddingTop = 16;
  const paddingBottom = 32;

  const innerWidth = width - paddingLeft - paddingRight;
  const innerHeight = height - paddingTop - paddingBottom;

  const getX = (index: number) => {
    return paddingLeft + (index / (data.length - 1)) * innerWidth;
  };

  const getY = (val: number) => {
    return paddingTop + innerHeight - (val / maxY) * innerHeight;
  };

  // Build SVG path strings
  const activeKey = mode === 'liquid' ? 'liquidRewards' : 'nativeRewards';
  const points = data.map((d, i) => `${getX(i)},${getY(d[activeKey])}`);
  const linePath = `M ${points.join(' L ')}`;
  const areaPath = `${linePath} L ${getX(data.length - 1)},${paddingTop + innerHeight} L ${paddingLeft},${paddingTop + innerHeight} Z`;

  // Benchmark path
  const benchmarkPoints = data.map((d, i) => `${getX(i)},${getY(d.benchmarkRewards)}`);
  const benchmarkLinePath = `M ${benchmarkPoints.join(' L ')}`;

  // Currently hovered or final point
  const activePointIndex = hoverIndex !== null ? hoverIndex : data.length - 1;
  const currentPoint = data[activePointIndex];
  const currentActiveReward = currentPoint ? currentPoint[activeKey] : 0;
  const currentBenchmarkReward = currentPoint ? currentPoint.benchmarkRewards : 0;
  const deltaReward = currentActiveReward - currentBenchmarkReward;

  // Y-axis grid ticks (3 ticks)
  const yTicks = [
    0,
    maxY * 0.5,
    maxY * 0.95,
  ];

  // X-axis 4 representative milestones
  const xMilestones = [
    0,
    Math.floor((data.length - 1) * 0.33),
    Math.floor((data.length - 1) * 0.66),
    data.length - 1,
  ];

  return (
    <div className="w-full bg-[#fdfcf9] border border-[#e5e1d8] rounded-xl p-4 sm:p-5">
      {/* Chart Top Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-[#6b7c70] font-semibold flex items-center gap-2">
            <span>Cumulative Rewards Trajectory</span>
            <span className="text-[#a5b2a9]">·</span>
            <span className="text-[#1a3c2a] font-mono normal-case">
              {mode === 'liquid' ? 'rkuSOL Compounding' : 'Raiku Validator Node'}
            </span>
          </div>
          <div className="text-xs text-[#809184] mt-0.5">
            Epoch-by-epoch projected growth over time
          </div>
        </div>

        {/* Comparison toggle button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleComparison}
            className={`inline-flex items-center gap-2 px-2.5 py-1 text-xs rounded-md border transition-all ${
              showComparison
                ? 'bg-[#1a3c2a]/10 border-[#1a3c2a]/30 text-[#1a3c2a] font-medium'
                : 'bg-transparent border-[#ded9cf] text-[#6b7c70] hover:text-[#1a3c2a]'
            }`}
          >
            <span
              className={`w-2.5 h-0.5 rounded-full ${
                showComparison ? 'bg-[#7c8f82]' : 'bg-[#c5bfb4]'
              }`}
            />
            <span>Compare vs Network Avg</span>
          </button>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible cursor-crosshair"
          onMouseLeave={() => setHoverIndex(null)}
          onTouchEnd={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a3c2a" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#1a3c2a" stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {yTicks.map((tickVal, idx) => {
            const yPos = getY(tickVal);
            return (
              <g key={`grid-${idx}`}>
                <line
                  x1={paddingLeft}
                  y1={yPos}
                  x2={width - paddingRight}
                  y2={yPos}
                  stroke="#ece8e0"
                  strokeWidth="1"
                  strokeDasharray={idx > 0 ? '3 3' : 'none'}
                />
                <text
                  x={paddingLeft - 8}
                  y={yPos + 3}
                  textAnchor="end"
                  className="text-[10px] fill-[#849488] font-mono tabular-nums"
                >
                  {tickVal === 0 ? '0' : formatSol(tickVal, tickVal < 1 ? 2 : 1)}
                </text>
              </g>
            );
          })}

          {/* Benchmark comparison line (if enabled) */}
          {showComparison && (
            <path
              d={benchmarkLinePath}
              fill="none"
              stroke="#95a69a"
              strokeWidth="1.75"
              strokeDasharray="4 4"
              className="transition-opacity duration-300"
            />
          )}

          {/* Active Gradient Fill */}
          <path d={areaPath} fill={`url(#${gradientId})`} />

          {/* Active Solid Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#1a3c2a"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Crosshair & Cursor */}
          {activePointIndex !== null && (
            <g>
              {/* Vertical line indicator */}
              <line
                x1={getX(activePointIndex)}
                y1={paddingTop}
                x2={getX(activePointIndex)}
                y2={paddingTop + innerHeight}
                stroke="#1a3c2a"
                strokeWidth="1"
                strokeDasharray="2 2"
                strokeOpacity="0.45"
              />

              {/* Point on active line */}
              <circle
                cx={getX(activePointIndex)}
                cy={getY(currentActiveReward)}
                r="4.5"
                fill="#1a3c2a"
                stroke="#ffffff"
                strokeWidth="2"
              />

              {/* Point on benchmark line (if active) */}
              {showComparison && (
                <circle
                  cx={getX(activePointIndex)}
                  cy={getY(currentBenchmarkReward)}
                  r="3.5"
                  fill="#95a69a"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              )}
            </g>
          )}

          {/* Invisible interactive overlay rects for hover detection */}
          {data.map((_, i) => {
            const currentX = getX(i);
            const stepWidth = innerWidth / data.length;
            return (
              <rect
                key={`hit-${i}`}
                x={currentX - stepWidth / 2}
                y={paddingTop}
                width={stepWidth}
                height={innerHeight}
                fill="transparent"
                onMouseEnter={() => setHoverIndex(i)}
                onTouchStart={() => setHoverIndex(i)}
                onTouchMove={(e) => {
                  const touch = e.touches[0];
                  const rect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                  if (rect) {
                    const relX = touch.clientX - rect.left - paddingLeft;
                    const calculatedIndex = Math.round(
                      (relX / innerWidth) * (data.length - 1)
                    );
                    const clamped = Math.max(0, Math.min(data.length - 1, calculatedIndex));
                    setHoverIndex(clamped);
                  }
                }}
              />
            );
          })}

          {/* X Axis milestones */}
          {xMilestones.map((idx) => {
            const pt = data[idx];
            if (!pt) return null;
            return (
              <text
                key={`x-label-${idx}`}
                x={getX(idx)}
                y={paddingTop + innerHeight + 18}
                textAnchor={idx === 0 ? 'start' : idx === data.length - 1 ? 'end' : 'middle'}
                className="text-[10px] fill-[#7d8f82] font-mono"
              >
                {pt.dateLabel}
              </text>
            );
          })}
        </svg>

        {/* Live Hover Scrubber HUD */}
        <div className="mt-3 pt-3 border-t border-[#ede8de] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-medium text-[#142419]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1a3c2a]" />
              <span>{mode === 'liquid' ? 'rkuSOL' : 'Raiku Validator'}:</span>
              <span className="font-mono font-semibold text-[#1a3c2a] tabular-nums">
                +{formatSol(currentActiveReward, currentActiveReward < 10 ? 3 : 2)} SOL
              </span>
              <span className="text-[#6d7e72] font-mono tabular-nums">
                ({formatUsd(currentActiveReward * solPriceUsd)})
              </span>
            </div>

            {showComparison && (
              <div className="hidden sm:flex items-center gap-1.5 text-[#596a5d]">
                <span className="w-2 h-0.5 bg-[#95a69a]" />
                <span>Net Avg:</span>
                <span className="font-mono tabular-nums">
                  +{formatSol(currentBenchmarkReward, currentBenchmarkReward < 10 ? 3 : 2)} SOL
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-[#586a5d]">
            {showComparison && deltaReward > 0 && (
              <span className="text-[#1a3c2a] font-semibold bg-[#e7efe9] px-2 py-0.5 rounded border border-[#c4dcce] tabular-nums">
                +{formatSol(deltaReward, 3)} SOL Raiku Alpha
              </span>
            )}
            <span className="text-[#849589]">·</span>
            <span>Day {currentPoint?.day || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
