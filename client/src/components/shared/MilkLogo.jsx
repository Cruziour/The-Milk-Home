import React from "react";

const MilkLogo = () => {
  return (
    <div className="relative mb-4">
      <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-white/30 to-white/10 border border-white/30 flex items-center justify-center shadow-lg">
        <svg
          className="w-11 h-11 text-white"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22 14 C22 14 18 18 18 26 L18 52 C18 54.2 19.8 56 22 56 L42 56 C44.2 56 46 54.2 46 52 L46 26 C46 18 42 14 42 14 Z"
            fill="white"
            fillOpacity="0.9"
          />
          <rect x="24" y="8" width="16" height="8" rx="3" fill="white" fillOpacity="0.7" />
          <path
            d="M18 32 Q32 38 46 32"
            stroke="rgba(56,189,248,0.8)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />

          <path
            d="M10 20 Q14 10 22 14"
            stroke="rgba(134,239,172,0.9)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M54 20 Q50 10 42 14"
            stroke="rgba(134,239,172,0.9)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="absolute inset-0 rounded-2xl ring-2 ring-white/20 ring-offset-2 ring-offset-transparent" />
    </div>
  );
};

export default MilkLogo;
