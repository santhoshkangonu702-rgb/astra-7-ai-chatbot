import React from 'react';

interface AstraCoreIconProps {
  size?: number;
  isProcessing?: boolean;
  className?: string;
  onClick?: () => void;
}

export const AstraCoreIcon: React.FC<AstraCoreIconProps> = ({
  size = 28,
  isProcessing = false,
  className = '',
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center shrink-0 cursor-pointer select-none group ${className}`}
      style={{ width: size, height: size }}
      title="Astra Core • Golden Core Engine"
    >
      {/* Ambient Radial Golden Glow */}
      <div
        className={`absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/40 via-yellow-500/30 to-amber-600/40 blur-md transition-all duration-500 ${
          isProcessing
            ? 'scale-150 opacity-90 animate-pulse shadow-[0_0_20px_#F5B82E]'
            : 'scale-110 opacity-70 group-hover:scale-130 group-hover:opacity-90'
        }`}
      />

      {/* Rotating Outer Energy Ring with Golden dashes */}
      <svg
        className={`absolute inset-0 w-full h-full ${
          isProcessing ? 'animate-[spin_4s_linear_infinite]' : 'animate-[spin_12s_linear_infinite]'
        }`}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="20"
          cy="20"
          r="18"
          stroke="#F5B82E"
          strokeWidth="1.5"
          strokeDasharray="4 6"
          strokeOpacity={isProcessing ? 0.9 : 0.6}
        />
        <circle
          cx="20"
          cy="20"
          r="14"
          stroke="#FFD76A"
          strokeWidth="1"
          strokeDasharray="2 8"
          strokeOpacity={isProcessing ? 0.8 : 0.4}
        />
      </svg>

      {/* Counter-rotating Inner Orbit Ring */}
      <div
        className={`absolute inset-[3px] rounded-full border border-amber-300/40 ${
          isProcessing ? 'animate-[spin_3s_linear_infinite_reverse]' : 'animate-[spin_9s_linear_infinite_reverse]'
        }`}
      />

      {/* Glowing Core Sphere */}
      <div
        className={`relative z-10 rounded-full flex items-center justify-center bg-gradient-to-tr from-[#A66A00] via-[#F5B82E] to-[#FFD76A] shadow-[0_0_12px_rgba(245,184,46,0.8)] transition-all duration-300 ${
          isProcessing ? 'scale-105' : 'group-hover:scale-105'
        }`}
        style={{ width: size * 0.58, height: size * 0.58 }}
      >
        {/* Core Center White-Hot Pin */}
        <div className="w-[38%] h-[38%] rounded-full bg-white/95 shadow-[0_0_6px_#FFFFFF] animate-pulse" />
      </div>
    </div>
  );
};
