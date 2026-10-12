import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-[#e2dcd0] bg-[#f5f2eb]/60 py-8 text-[#5a6b5e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#718274]">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-md bg-[#1a3c2a] flex items-center justify-center text-white text-[10px]">
              <svg
                viewBox="0 0 24 24"
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 20h16" />
                <path d="M7 20V4l6 8 6-8v16" />
              </svg>
            </div>
            <span className="font-semibold text-[#142419]">Raiku</span>
            <span className="text-[#a1b0a5]">·</span>
            <span>Staking Rewards Estimator</span>
          </div>

          <p className="max-w-2xl leading-relaxed text-[#718274] text-[11px] sm:text-right">
            Estimates only. Actual rewards depend on network conditions, validator performance, and MEV. Not financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
};
