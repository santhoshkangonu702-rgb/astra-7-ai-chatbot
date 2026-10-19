import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, Radio, Cpu, Activity } from 'lucide-react';
import { hapticCorePulse } from '../../utils/haptics';

export type AstraCoreState = 'idle' | 'thinking' | 'searching' | 'speaking' | 'generating';

interface AstraCoreProps {
  state?: AstraCoreState;
  size?: number;
  className?: string;
  onClick?: () => void;
  audioLevel?: number;
  statusText?: string;
}

export const AstraCore: React.FC<AstraCoreProps> = ({
  state = 'idle',
  size = 280,
  className = '',
  onClick,
  audioLevel = 0,
  statusText,
}) => {
  const [pulseTick, setPulseTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseTick((prev) => (prev + 1) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // Theme-coordinated color palette for the 2040 Core
  const getCoreGradients = () => {
    switch (state) {
      case 'thinking':
        return {
          inner: 'from-amber-400 via-purple-500 to-cyan-400',
          ring1: 'border-purple-400/40 shadow-[0_0_25px_rgba(168,85,247,0.35)]',
          ring2: 'border-cyan-400/35',
          ring3: 'border-amber-400/30',
          glow: 'radial-gradient(circle, rgba(168,85,247,0.45) 0%, rgba(6,182,212,0.2) 50%, rgba(0,0,0,0) 75%)',
          label: 'Astra Brain 2.0 Thinking...',
          badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
        };
      case 'searching':
        return {
          inner: 'from-cyan-400 via-blue-500 to-indigo-400',
          ring1: 'border-cyan-400/50 shadow-[0_0_25px_rgba(6,182,212,0.4)]',
          ring2: 'border-blue-400/35',
          ring3: 'border-cyan-400/30',
          glow: 'radial-gradient(circle, rgba(6,182,212,0.5) 0%, rgba(59,130,246,0.2) 50%, rgba(0,0,0,0) 75%)',
          label: 'Live Web Grounding & Fact Verification',
          badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
        };
      case 'speaking':
        return {
          inner: 'from-cyan-300 via-amber-400 to-purple-500',
          ring1: 'border-amber-400/50 shadow-[0_0_30px_rgba(234,179,8,0.45)]',
          ring2: 'border-cyan-400/40',
          ring3: 'border-purple-400/30',
          glow: `radial-gradient(circle, rgba(234,179,8,${0.35 + audioLevel * 0.45}) 0%, rgba(6,182,212,0.25) 50%, rgba(0,0,0,0) 75%)`,
          label: 'Astra 7 Synthesizing Voice',
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        };
      case 'generating':
        return {
          inner: 'from-rose-400 via-purple-500 to-amber-300',
          ring1: 'border-rose-400/50 shadow-[0_0_25px_rgba(244,63,94,0.4)]',
          ring2: 'border-amber-400/35',
          ring3: 'border-purple-400/30',
          glow: 'radial-gradient(circle, rgba(244,63,94,0.45) 0%, rgba(234,179,8,0.2) 50%, rgba(0,0,0,0) 75%)',
          label: 'Neural Engine Synthesizing Output',
          badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        };
      case 'idle':
      default:
        return {
          inner: 'from-amber-300 via-cyan-400 to-purple-500',
          ring1: 'border-amber-400/40 shadow-[0_0_30px_rgba(234,179,8,0.25)]',
          ring2: 'border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]',
          ring3: 'border-purple-500/25',
          glow: 'radial-gradient(circle, rgba(234,179,8,0.3) 0%, rgba(6,182,212,0.18) 45%, rgba(139,92,246,0.12) 65%, rgba(0,0,0,0) 80%)',
          label: 'Astra 7 AI Core • Ready',
          badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        };
    }
  };

  const styleConfig = getCoreGradients();
  const dynamicScale = state === 'speaking' ? 1 + audioLevel * 0.12 : 1;

  return (
    <div
      id="astra-7-ai-core"
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
    >
      {/* Outer interactive wrapper */}
      <div
        onClick={(e) => {
          hapticCorePulse();
          if (onClick) onClick();
        }}
        style={{ width: size, height: size, transform: `scale(${dynamicScale})` }}
        className="relative flex items-center justify-center cursor-pointer transition-transform duration-300 group"
        title="ASTRA 7 AI CORE — Click to interact"
      >
        {/* Ambient Neural Halo Glow */}
        <div
          className="absolute inset-[-20%] rounded-full pointer-events-none transition-all duration-700 blur-2xl"
          style={{ background: styleConfig.glow }}
        />

        {/* Ring 1 - Outermost Orbit with Data Nodes */}
        <div
          style={{ transform: `rotate(${pulseTick * 0.5}deg)` }}
          className={`absolute inset-0 rounded-full border border-dashed ${styleConfig.ring3} transition-all duration-500`}
        >
          {/* Orbiting Quantum Node 1 */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_10px_#F59E0B]" />
          {/* Orbiting Quantum Node 2 */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06B6D4]" />
        </div>

        {/* Ring 2 - Middle Reverse Rotating Ring */}
        <div
          style={{ transform: `rotate(-${pulseTick * 0.8}deg)` }}
          className={`absolute inset-4 rounded-full border ${styleConfig.ring2} transition-all duration-500`}
        >
          {/* Node 3 */}
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#A855F7]" />
          {/* Node 4 */}
          <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_8px_#FCD34D]" />
        </div>

        {/* Ring 3 - Inner Glowing Luminous Ring */}
        <div
          style={{ transform: `rotate(${pulseTick * 1.2}deg)` }}
          className={`absolute inset-8 rounded-full border-2 ${styleConfig.ring1} transition-all duration-300`}
        />

        {/* Neural Network Micro Particle Field (Floating stars/dots) */}
        <div className="absolute inset-10 rounded-full pointer-events-none overflow-hidden opacity-75">
          <div
            className="absolute w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_#67E8F9]"
            style={{
              top: `${50 + 35 * Math.sin((pulseTick * Math.PI) / 180)}%`,
              left: `${50 + 35 * Math.cos((pulseTick * Math.PI) / 180)}%`,
            }}
          />
          <div
            className="absolute w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_6px_#FCD34D]"
            style={{
              top: `${50 + 25 * Math.sin(((pulseTick + 120) * Math.PI) / 180)}%`,
              left: `${50 + 25 * Math.cos(((pulseTick + 120) * Math.PI) / 180)}%`,
            }}
          />
          <div
            className="absolute w-1 h-1 rounded-full bg-purple-300 shadow-[0_0_6px_#D8B4FE]"
            style={{
              top: `${50 + 30 * Math.sin(((pulseTick + 240) * Math.PI) / 180)}%`,
              left: `${50 + 30 * Math.cos(((pulseTick + 240) * Math.PI) / 180)}%`,
            }}
          />
        </div>

        {/* Central Energy Sphere */}
        <div className="relative z-10 w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 border border-amber-400/40 shadow-[0_0_35px_rgba(234,179,8,0.35)] flex flex-col items-center justify-center p-3 backdrop-blur-md overflow-hidden group-hover:border-amber-300 transition-colors">
          {/* Glass Specular Reflection Arc */}
          <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none blur-[1px]" />

          {/* Central Astra 7 Logo / Geometric Star Glyph */}
          <div className="relative flex items-center justify-center mb-1">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-purple-500 to-cyan-400 p-[2px] shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-[14px] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center">
                <span className="text-xl md:text-2xl font-black tracking-tighter bg-gradient-to-r from-amber-200 via-white to-cyan-200 bg-clip-text text-transparent">
                  A7
                </span>
              </div>
            </div>
            {/* Pulsing Core Center Spark */}
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-amber-300 animate-pulse" />
          </div>

          {/* Branding Subtitle */}
          <span className="text-[10px] md:text-xs font-bold tracking-widest text-amber-300/90 uppercase">
            NEXUS
          </span>
          <span className="text-[9px] font-mono tracking-widest text-cyan-300/80">
            2040 CORE
          </span>
        </div>
      </div>

      {/* Futuristic Status Ribbon beneath Core */}
      <div className="mt-4 flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-slate-900/80 backdrop-blur-md text-xs shadow-lg">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
        </span>
        <span className="font-mono text-slate-300 font-medium">
          {statusText || styleConfig.label}
        </span>
      </div>
    </div>
  );
};
