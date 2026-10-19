import React from 'react';

interface AstraMascotHeroProps {
  className?: string;
}

export const AstraMascotHero: React.FC<AstraMascotHeroProps> = ({ className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Ambient background glow & radial gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/15 via-purple-400/20 to-cyan-400/20 rounded-full blur-3xl -z-10 transform scale-110" />

      {/* Floating decorative badges and geometry */}
      {/* Badge 1: Code & Dev */}
      <div className="absolute -top-3 -left-3 sm:top-2 sm:left-2 bg-white/95 dark:bg-slate-800/95 shadow-lg shadow-indigo-500/10 border border-indigo-100 dark:border-indigo-900/60 px-3 py-1.5 rounded-2xl flex items-center gap-2 animate-bounce [animation-duration:3.2s] z-20">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
          Astra 7 Brain
        </span>
      </div>

      {/* Badge 2: Creativity & Study */}
      <div className="absolute -bottom-2 -right-2 sm:bottom-4 sm:right-2 bg-white/95 dark:bg-slate-800/95 shadow-lg shadow-cyan-500/10 border border-cyan-100 dark:border-cyan-900/60 px-3 py-1.5 rounded-2xl flex items-center gap-2 animate-bounce [animation-duration:4s] z-20">
        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
          Creative & Study AI
        </span>
      </div>

      {/* Badge 3: 8 Tools Ready */}
      <div className="hidden sm:flex absolute top-1/2 -right-6 bg-white/90 dark:bg-slate-800/90 shadow-md border border-purple-100 dark:border-purple-900/50 px-2.5 py-1 rounded-xl items-center gap-1.5 text-[10px] font-bold text-purple-600 dark:text-purple-300 z-20">
        <span>⚡ 8 Tools Active</span>
      </div>

      {/* Central Hero Character SVG */}
      <svg
        viewBox="0 0 460 460"
        className="w-full max-w-[400px] h-auto drop-shadow-[0_20px_40px_rgba(99,102,241,0.25)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bodyGrad" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>

          <linearGradient id="astroIndigo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>

          <linearGradient id="headphoneGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EC4899" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>

          <linearGradient id="visorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#1E1B4B" />
          </linearGradient>

          <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#EC4899" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="landscapeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E0E7FF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#CFFAFE" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FCE7F3" stopOpacity="0.8" />
          </linearGradient>

          <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="70%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Futuristic Platform / Horizon Landscape Ring */}
        <ellipse cx="230" cy="385" rx="170" ry="32" fill="url(#landscapeGrad)" />
        <ellipse cx="230" cy="385" rx="140" ry="24" stroke="url(#astroIndigo)" strokeWidth="2" strokeDasharray="8 6" opacity="0.6" />

        {/* Floating Particles / Stars */}
        <circle cx="90" cy="140" r="4" fill="#06B6D4" opacity="0.8" />
        <circle cx="370" cy="120" r="5" fill="#EC4899" opacity="0.8" />
        <circle cx="390" cy="260" r="3.5" fill="#F59E0B" opacity="0.8" />
        <circle cx="70" cy="270" r="3" fill="#8B5CF6" opacity="0.8" />

        {/* Orbital Ring Around Mascot */}
        <g transform="rotate(-18 230 230)">
          <ellipse
            cx="230"
            cy="230"
            rx="185"
            ry="48"
            stroke="url(#orbitGrad)"
            strokeWidth="4"
            fill="none"
            strokeDasharray="400 30"
          />
          {/* Planet / Orbiting node */}
          <circle cx="410" cy="230" r="10" fill="#06B6D4" />
          <circle cx="410" cy="230" r="5" fill="#FFFFFF" />
          <circle cx="50" cy="230" r="7" fill="#EC4899" />
        </g>

        {/* Mascot Robot Body */}
        {/* Torso */}
        <path
          d="M 175 255 C 175 240 285 240 285 255 L 295 330 C 295 350 280 365 260 365 L 200 365 C 180 365 165 350 165 330 Z"
          fill="url(#bodyGrad)"
          stroke="#CBD5E1"
          strokeWidth="3"
        />

        {/* Chest Plate with Glowing A7 Emblem */}
        <rect
          x="195"
          y="265"
          width="70"
          height="55"
          rx="14"
          fill="url(#astroIndigo)"
          stroke="#FFFFFF"
          strokeWidth="2"
        />
        {/* Letter A & 7 on Chest */}
        <text
          x="230"
          y="300"
          textAnchor="middle"
          fill="#FFFFFF"
          fontFamily="system-ui, sans-serif"
          fontWeight="900"
          fontSize="20"
          letterSpacing="1"
        >
          A7
        </text>

        {/* Arms with Cute White Mitts */}
        {/* Left Arm (holding wave gesture) */}
        <path
          d="M 170 265 C 140 270 120 240 110 215 C 105 205 120 195 130 205 C 140 220 150 245 170 255"
          fill="url(#bodyGrad)"
          stroke="#CBD5E1"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="112" cy="208" r="14" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2.5" />
        {/* Sparkle near waving hand */}
        <path
          d="M 100 185 L 105 170 L 110 185 L 125 190 L 110 195 L 105 210 L 100 195 L 85 190 Z"
          fill="#F59E0B"
          opacity="0.9"
        />

        {/* Right Arm (resting comfortably) */}
        <path
          d="M 290 265 C 320 275 335 295 340 320 C 342 330 330 335 322 328 C 315 315 305 295 290 280"
          fill="url(#bodyGrad)"
          stroke="#CBD5E1"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="335" cy="326" r="14" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2.5" />

        {/* Cute Floating Robot Head */}
        {/* Head Base */}
        <rect
          x="145"
          y="110"
          width="170"
          height="135"
          rx="52"
          fill="url(#bodyGrad)"
          stroke="#CBD5E1"
          strokeWidth="3"
        />

        {/* Headphone Arch */}
        <path
          d="M 132 170 C 132 105 180 75 230 75 C 280 75 328 105 328 170"
          fill="none"
          stroke="url(#headphoneGrad)"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* Left Headphone Ear Cushion & Shell */}
        <rect
          x="124"
          y="145"
          width="24"
          height="55"
          rx="12"
          fill="url(#astroIndigo)"
          stroke="#FFFFFF"
          strokeWidth="2.5"
        />
        <circle cx="136" cy="172" r="6" fill="#06B6D4" />

        {/* Right Headphone Ear Cushion & Shell */}
        <rect
          x="312"
          y="145"
          width="24"
          height="55"
          rx="12"
          fill="url(#astroIndigo)"
          stroke="#FFFFFF"
          strokeWidth="2.5"
        />
        <circle cx="324" cy="172" r="6" fill="#EC4899" />

        {/* Antenna with Glowing Gem */}
        <line x1="230" y1="75" x2="230" y2="52" stroke="#6366F1" strokeWidth="4" strokeLinecap="round" />
        <circle cx="230" cy="48" r="9" fill="#06B6D4" />
        <circle cx="230" cy="48" r="4.5" fill="#FFFFFF" />

        {/* Futuristic Visor Screen */}
        <rect
          x="165"
          y="130"
          width="130"
          height="85"
          rx="36"
          fill="url(#visorGrad)"
          stroke="#6366F1"
          strokeWidth="2"
        />

        {/* Cheerful Friendly Glowing Eyes */}
        {/* Left Eye (Curved happy crescent) */}
        <path
          d="M 188 170 C 188 158 206 158 206 170"
          stroke="#00E5FF"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="197" cy="165" r="8" fill="url(#eyeGlow)" opacity="0.6" />

        {/* Right Eye (Curved happy crescent) */}
        <path
          d="M 254 170 C 254 158 272 158 272 170"
          stroke="#00E5FF"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="263" cy="165" r="8" fill="url(#eyeGlow)" opacity="0.6" />

        {/* Blush Cheeks */}
        <ellipse cx="180" cy="188" rx="8" ry="4" fill="#EC4899" opacity="0.75" />
        <ellipse cx="280" cy="188" rx="8" ry="4" fill="#EC4899" opacity="0.75" />

        {/* Cheerful Mouth */}
        <path
          d="M 222 188 Q 230 196 238 188"
          stroke="#00E5FF"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
};
