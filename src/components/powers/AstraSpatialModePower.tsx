import React, { useState } from 'react';
import {
  ArrowLeft,
  Boxes,
  Compass,
  Maximize2,
  Sparkles,
  Layers,
  Radio,
  Eye,
  Sliders,
  RotateCw,
  Orbit,
  Zap,
  Globe2
} from 'lucide-react';

type SpatialEnvironment = 'orbital' | 'cyberlab' | 'neuralvoid';

export const AstraSpatialModePower: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [environment, setEnvironment] = useState<SpatialEnvironment>('orbital');
  const [perspectiveDepth, setPerspectiveDepth] = useState(65);
  const [rotationAngle, setRotationAngle] = useState(12);

  const getEnvStyle = () => {
    switch (environment) {
      case 'orbital':
        return 'from-slate-950 via-blue-950/40 to-slate-950 border-blue-500/30';
      case 'cyberlab':
        return 'from-slate-950 via-amber-950/30 to-slate-950 border-amber-500/30';
      case 'neuralvoid':
        return 'from-slate-950 via-purple-950/40 to-slate-950 border-purple-500/30';
    }
  };

  return (
    <div id="astra-spatial-mode" className="h-full overflow-y-auto px-4 py-6 md:px-8 space-y-8 text-slate-100 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-all"
              title="Return to Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                <Boxes className="w-7 h-7 text-cyan-400 animate-pulse" />
                ASTRA SPATIAL MODE
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                HOLOGRAPHIC COMPUTING
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulated 3D spatial interface • Multi-depth floating visual planes • Gesture orientation
            </p>
          </div>
        </div>

        {/* Environment Selector */}
        <div className="flex items-center gap-2">
          {[
            { id: 'orbital', label: 'Orbital Station' },
            { id: 'cyberlab', label: 'Cyber Lab 2040' },
            { id: 'neuralvoid', label: 'Neural Void' }
          ].map((env) => (
            <button
              key={env.id}
              onClick={() => setEnvironment(env.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                environment === env.id
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-lg'
                  : 'bg-white/5 text-slate-400 border-white/5'
              }`}
            >
              {env.label}
            </button>
          ))}
        </div>
      </div>

      {/* Spatial 3D Stage Container */}
      <div
        className={`relative min-h-[480px] rounded-3xl bg-gradient-to-b ${getEnvStyle()} border p-8 flex items-center justify-center overflow-hidden shadow-2xl backdrop-blur-2xl transition-all duration-700`}
        style={{
          perspective: '1200px'
        }}
      >
        {/* Background 3D Grid lines */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#06b6d4_1px,transparent_1px),linear-gradient(to_bottom,#06b6d4_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        {/* Floating Holographic Main Panel */}
        <div
          className="w-full max-w-lg p-6 rounded-3xl bg-slate-950/80 border border-cyan-400/50 shadow-[0_0_50px_rgba(6,182,212,0.3)] backdrop-blur-3xl space-y-4 transform transition-all duration-300 select-none hover:scale-[1.02]"
          style={{
            transform: `rotateY(${rotationAngle}deg) translateZ(${perspectiveDepth}px)`
          }}
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-200">
                Spatial Cognitive Plane
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">DEPTH: {perspectiveDepth}mm</span>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-white">
              Volumetric Astra Node #7
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Spatial computing eliminates physical screen boundaries. Information expands naturally into your physical environment with zero occlusions.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2">
            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
              <div className="text-[9px] text-slate-400">PITCH / YAW</div>
              <div className="text-cyan-300 font-bold">{rotationAngle}° Angular Offset</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
              <div className="text-[9px] text-slate-400">EYE GAZE TRACKING</div>
              <div className="text-emerald-300 font-bold">Foveated 120 FPS</div>
            </div>
          </div>
        </div>

        {/* Satellite Floating Widget 1 */}
        <div
          className="absolute left-6 top-12 hidden md:block p-4 rounded-2xl bg-slate-950/70 border border-purple-400/40 shadow-xl backdrop-blur-xl space-y-1 text-left select-none"
          style={{
            transform: `rotateY(${rotationAngle - 8}deg) translateZ(${perspectiveDepth - 30}px)`
          }}
        >
          <div className="text-[10px] font-mono text-purple-300 uppercase">Auxiliary Feed</div>
          <div className="text-xs font-bold text-white">Orbital Velocity: 7.6 km/s</div>
        </div>

        {/* Satellite Floating Widget 2 */}
        <div
          className="absolute right-6 bottom-12 hidden md:block p-4 rounded-2xl bg-slate-950/70 border border-amber-400/40 shadow-xl backdrop-blur-xl space-y-1 text-left select-none"
          style={{
            transform: `rotateY(${rotationAngle + 8}deg) translateZ(${perspectiveDepth - 20}px)`
          }}
        >
          <div className="text-[10px] font-mono text-amber-300 uppercase">Atmosphere Matrix</div>
          <div className="text-xs font-bold text-white">Exosphere Nominal • 0.02% O₂</div>
        </div>
      </div>

      {/* Spatial Calibration Controls */}
      <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Virtual Depth (Z-axis):</span>
            <input
              type="range"
              min={20}
              max={150}
              value={perspectiveDepth}
              onChange={(e) => setPerspectiveDepth(Number(e.target.value))}
              className="accent-cyan-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
            />
            <span className="font-mono text-cyan-300">{perspectiveDepth}px</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Yaw Rotation (Y-axis):</span>
            <input
              type="range"
              min={-30}
              max={30}
              value={rotationAngle}
              onChange={(e) => setRotationAngle(Number(e.target.value))}
              className="accent-cyan-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
            />
            <span className="font-mono text-cyan-300">{rotationAngle}°</span>
          </div>
        </div>

        <button
          onClick={() => {
            setPerspectiveDepth(65);
            setRotationAngle(12);
          }}
          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono"
        >
          Recalibrate to Origin
        </button>
      </div>
    </div>
  );
};
