import React from 'react';

export type OrbState =
  | 'idle'
  | 'thinking'
  | 'searching'
  | 'generating'
  | 'voice'
  | 'error'
  | 'success';

interface AstraOrbProps {
  state?: OrbState;
  size?: number;
  className?: string;
  showRings?: boolean;
  audioLevel?: number; // 0.0 to 1.0 (used in voice mode)
  onClick?: () => void;
  interactive?: boolean;
}

export const AstraOrb: React.FC<AstraOrbProps> = ({
  state = 'idle',
  size = 140,
  className = '',
  showRings = true,
  audioLevel = 0,
  onClick,
  interactive = false,
}) => {
  // Determine color accents based on state
  const getGradients = () => {
    switch (state) {
      case 'thinking':
        return {
          primary: '#8B5CF6',
          secondary: '#38BDF8',
          accent: '#EC4899',
          glow: 'rgba(139, 92, 246, 0.55)',
          speed: '2s',
        };
      case 'searching':
        return {
          primary: '#06B6D4',
          secondary: '#3B82F6',
          accent: '#8B5CF6',
          glow: 'rgba(6, 182, 212, 0.6)',
          speed: '1.4s',
        };
      case 'generating':
        return {
          primary: '#EC4899',
          secondary: '#8B5CF6',
          accent: '#06B6D4',
          glow: 'rgba(236, 72, 153, 0.6)',
          speed: '1.2s',
        };
      case 'voice':
        return {
          primary: '#38BDF8',
          secondary: '#8B5CF6',
          accent: '#10B981',
          glow: `rgba(56, 189, 248, ${0.45 + audioLevel * 0.45})`,
          speed: '1s',
        };
      case 'error':
        return {
          primary: '#EF4444',
          secondary: '#F59E0B',
          accent: '#B91C1C',
          glow: 'rgba(239, 68, 68, 0.6)',
          speed: '1.8s',
        };
      case 'success':
        return {
          primary: '#10B981',
          secondary: '#06B6D4',
          accent: '#34D399',
          glow: 'rgba(16, 185, 129, 0.6)',
          speed: '1.5s',
        };
      case 'idle':
      default:
        return {
          primary: '#8B5CF6',
          secondary: '#38BDF8',
          accent: '#A855F7',
          glow: 'rgba(139, 92, 246, 0.4)',
          speed: '4s',
        };
    }
  };

  const colors = getGradients();
  const voiceScale = state === 'voice' ? 1 + audioLevel * 0.18 : 1;

  return (
    <div
      id="astra-orb-container"
      onClick={onClick}
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center select-none ${
        interactive ? 'cursor-pointer group' : ''
      } ${className}`}
    >
      {/* Outer ambient glow halo */}
      <div
        className="absolute inset-0 rounded-full blur-2xl transition-all duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${colors.glow} 0%, rgba(5,5,10,0) 72%)`,
          transform: `scale(${state === 'voice' ? 1.3 + audioLevel * 0.4 : 1.2})`,
        }}
      />

      {/* Orbital concentric rings */}
      {showRings && (
        <>
          {/* Ring 1 - Outer Tilted Orbit */}
          <div
            className="absolute rounded-full border border-purple-500/20 pointer-events-none transition-transform"
            style={{
              width: size * 1.32,
              height: size * 0.58,
              transform: `rotate(-25deg) scale(${voiceScale})`,
              boxShadow: `0 0 15px rgba(139, 92, 246, 0.12)`,
              animation: `spin 16s linear infinite`,
            }}
          >
            {/* Orbital node star */}
            <div
              className="absolute -top-1 left-1/4 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#38BDF8]"
            />
          </div>

          {/* Ring 2 - Counter Orbit */}
          <div
            className="absolute rounded-full border border-cyan-400/20 pointer-events-none transition-transform"
            style={{
              width: size * 1.18,
              height: size * 0.5,
              transform: `rotate(35deg) scale(${voiceScale})`,
              boxShadow: `0 0 12px rgba(6, 182, 212, 0.1)`,
              animation: `spin 22s linear infinite reverse`,
            }}
          >
            <div
              className="absolute -bottom-1 right-1/4 w-1.5 h-1.5 rounded-full bg-purple-300 shadow-[0_0_8px_#A855F7]"
            />
          </div>

          {/* Dynamic pulse rings when thinking or generating */}
          {(state === 'thinking' || state === 'searching' || state === 'voice') && (
            <div
              className="absolute inset-0 rounded-full border border-violet-400/40 animate-ping pointer-events-none"
              style={{ animationDuration: colors.speed }}
            />
          )}
        </>
      )}

      {/* Main Celestial Holographic Orb SVG */}
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full relative z-10 drop-shadow-[0_0_24px_rgba(139,92,246,0.5)] transition-transform duration-300"
        style={{ transform: `scale(${voiceScale})` }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Holographic Radial Gradient */}
          <radialGradient id="orbCore" cx="42%" cy="38%" r="62%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="25%" stopColor={colors.secondary} stopOpacity="0.85" />
            <stop offset="65%" stopColor={colors.primary} stopOpacity="0.8" />
            <stop offset="90%" stopColor="#0F1026" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#05050A" stopOpacity="1" />
          </radialGradient>

          {/* Atmospheric Nebula Plasma */}
          <linearGradient id="plasmaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.secondary} stopOpacity="0.7" />
            <stop offset="50%" stopColor={colors.accent} stopOpacity="0.5" />
            <stop offset="100%" stopColor={colors.primary} stopOpacity="0.8" />
          </linearGradient>

          {/* Core glow filter */}
          <filter id="cosmicBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Back dark cosmic depth */}
        <circle cx="100" cy="100" r="76" fill="#0A0B18" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

        {/* Shimmering Nebula Wave Bands */}
        <g opacity="0.7" filter="url(#cosmicBlur)">
          <ellipse cx="100" cy="94" rx="72" ry="46" fill="url(#plasmaGrad)" opacity="0.65" />
          <ellipse cx="98" cy="112" rx="64" ry="36" fill={colors.accent} opacity="0.4" />
        </g>

        {/* Primary Glass Orb Sphere */}
        <circle cx="100" cy="100" r="74" fill="url(#orbCore)" />

        {/* Internal 7-Point Quantum Core Resonance */}
        <g opacity="0.85" transform="rotate(15 100 100)">
          {/* Subtle 7-Point Star Geometry at Orb Center */}
          <polygon
            points="
              100,68 107,89 129,82 119,103 135,120 113,124 108,144
              92,144 87,124 65,120 81,103 71,82 93,89
            "
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeDasharray="2 3"
            opacity="0.6"
          />
          {/* Center Quantum Singularity */}
          <circle cx="100" cy="100" r="10" fill="#FFFFFF" opacity="0.8" />
          <circle cx="100" cy="100" r="5" fill={colors.secondary} />
        </g>

        {/* Specular Light Reflection (Glass Curvature) */}
        <path
          d="M 54 62 C 68 44, 110 40, 142 56 C 132 50, 92 46, 68 66 Z"
          fill="#FFFFFF"
          opacity="0.45"
        />

        {/* Bottom Ambient Counter-Reflection */}
        <ellipse cx="100" cy="154" rx="42" ry="12" fill={colors.secondary} opacity="0.3" filter="url(#cosmicBlur)" />
      </svg>

      {/* State label badge for interactive or modal display */}
      {interactive && (
        <div className="absolute -bottom-6 px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-purple-500/30 text-[10px] tracking-wider uppercase font-mono text-purple-300 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
          {state}
        </div>
      )}
    </div>
  );
};
