import React from 'react';

interface AstraLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  tagline?: boolean | string;
  darkText?: boolean;
}

export const AstraLogo: React.FC<AstraLogoProps> = ({
  size = 36,
  className = '',
  showText = true,
  tagline = false,
  darkText = false,
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* A7 Futuristic Geometric Emblem */}
      <div
        className="relative flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_4px_12px_rgba(99,102,241,0.35)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="a7Grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <linearGradient id="a7Accent" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <radialGradient id="a7Glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Rounded Hexagonal / Shield Capsule */}
          <rect
            x="6"
            y="6"
            width="88"
            height="88"
            rx="24"
            fill="url(#a7Grad)"
            opacity="0.15"
          />
          <rect
            x="6"
            y="6"
            width="88"
            height="88"
            rx="24"
            stroke="url(#a7Grad)"
            strokeWidth="2.5"
            strokeDasharray="90 10"
          />

          {/* Futuristic Interlocking A & 7 glyphs */}
          {/* Letter 'A' Left Stem & Apex */}
          <path
            d="M 32 74 L 46 26 C 47.5 21 52.5 21 54 26 L 68 74"
            stroke="url(#a7Grad)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* 'A' Crossbar with neon spark */}
          <path
            d="M 38 56 L 62 56"
            stroke="url(#a7Accent)"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Dynamic Top Angle & Diagonal of '7' overlapping */}
          <path
            d="M 44 32 L 75 32 L 56 74"
            stroke="#06B6D4"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Core Energy Spark */}
          <circle cx="50" cy="56" r="4.5" fill="url(#a7Accent)" />
          <circle cx="50" cy="56" r="2" fill="#FFFFFF" />
          <circle cx="75" cy="32" r="3" fill="#06B6D4" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5 leading-tight">
            <span
              className={`font-black tracking-tight text-lg sm:text-xl font-sans ${
                darkText ? 'text-slate-900' : 'text-slate-900 dark:text-white'
              }`}
            >
              ASTRA
            </span>
            <span className="px-1.5 py-0.5 rounded-lg text-xs font-black bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white shadow-sm shadow-indigo-500/30">
              7
            </span>
          </div>
          {Boolean(tagline) && (
            <span
              className={`text-[10px] tracking-tight font-medium ${
                darkText ? 'text-slate-500' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {typeof tagline === 'string' && tagline === 'secondary'
                ? 'Your AI. Your Ideas. Your Future.'
                : 'Think Beyond. Create Beyond.'}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
