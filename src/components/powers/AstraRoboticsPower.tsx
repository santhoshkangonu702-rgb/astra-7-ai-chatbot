import React, { useState } from 'react';
import {
  ArrowLeft,
  Bot,
  Cpu,
  Activity,
  Layers,
  Sparkles,
  Info,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Zap
} from 'lucide-react';

interface RobotArchetype {
  id: string;
  name: string;
  category: 'Humanoid' | 'Industrial Swarm' | 'Biomedical Service' | 'Autonomous Exoskeleton';
  dofs: number;
  actuatorType: string;
  batteryLife: string;
  aiBrainArchitecture: string;
  currentMaturity: 'Commercial Pilot' | 'Laboratory Prototype' | '2040 Vision';
  summary: string;
  keyCapabilities: string[];
}

const ROBOT_MODELS: RobotArchetype[] = [
  {
    id: 'rob-humanoid',
    name: 'Astra-Titan Gen 4 Bipedal Humanoid',
    category: 'Humanoid',
    dofs: 48,
    actuatorType: 'Planetary Gear Quasi-Direct Drive & Series Elastic Actuators',
    batteryLife: '6.5 hours continuous warehouse operation',
    aiBrainArchitecture: 'Vision-Language-Action (VLA) End-to-End Latent Policy',
    currentMaturity: 'Commercial Pilot',
    summary: 'General-purpose bipedal android designed for human-centric environments, factory logistics, and dexterous assembly manipulation with 5-finger tactile feedback.',
    keyCapabilities: [
      'Self-balancing dynamic push recovery on uneven terrain',
      'Tactile optical fingertip sensor array (0.1 mm resolution)',
      'Natural language task decomposition without retraining'
    ]
  },
  {
    id: 'rob-swarm',
    name: 'Micro-Aerial Swarm Autonomous Surveyors',
    category: 'Industrial Swarm',
    dofs: 6,
    actuatorType: 'Brushless Ultra-Light Titanium Motors',
    batteryLife: '45 minutes (inductive dock recharging)',
    aiBrainArchitecture: 'Decentralized Swarm Consensus Graph Network',
    currentMaturity: 'Laboratory Prototype',
    summary: 'Swarm of 24 micro-quadcopters collaboratively mapping subterranean tunnels, disaster zones, and high-voltage power conduits in GPS-denied environments.',
    keyCapabilities: [
      'Simultaneous Localization and Mapping (SLAM) in zero visibility',
      'Mesh network redundancy with automatic drone replacement',
      'Infrared thermal leak detection and 3D point cloud generation'
    ]
  },
  {
    id: 'rob-surgical',
    name: 'Sub-Millimeter Micro-Surgical Manipulator',
    category: 'Biomedical Service',
    dofs: 16,
    actuatorType: 'Piezo-Electric Micro-Actuators',
    batteryLife: 'Tethered Uninterruptible Power Supply (UPS)',
    aiBrainArchitecture: 'Real-Time Tremor Cancellation & Foveated Stereo Vision',
    currentMaturity: 'Commercial Pilot',
    summary: 'Robotic surgical workstation augmenting ophthalmic and neurosurgical operations with physiological tremor attenuation down to 3 microns.',
    keyCapabilities: [
      '0.003 mm precision spatial needle insertion',
      'Haptic resistance simulation for delicate arterial tissue',
      'Automated optical suture placement along blood vessels'
    ]
  }
];

export const AstraRoboticsPower: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [selectedRobot, setSelectedRobot] = useState<RobotArchetype>(ROBOT_MODELS[0]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  return (
    <div id="astra-robotics" className="h-full overflow-y-auto px-4 py-6 md:px-8 space-y-8 text-slate-100 max-w-7xl mx-auto">
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
                <Bot className="w-7 h-7 text-cyan-400" />
                ASTRA ROBOTICS
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                RESEARCH / SIMULATION MODE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Humanoid systems • Dexterous manipulation • Swarm telemetry • Kinematic simulations
            </p>
          </div>
        </div>

        {/* Mandatory Safety Notice */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-[11px] font-mono text-amber-200">
          <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>Research & Simulation Mode • No direct control of physical hardware</span>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Robot Models List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Robotic Architectures</span>
            <span className="text-cyan-400 font-mono text-[10px]">VLA INTEGRATED</span>
          </div>

          <div className="space-y-3">
            {ROBOT_MODELS.map((robot) => {
              const isSelected = selectedRobot.id === robot.id;
              return (
                <div
                  key={robot.id}
                  onClick={() => setSelectedRobot(robot)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer backdrop-blur-xl ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                      : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-cyan-300 px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/30">
                      {robot.category}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">{robot.currentMaturity}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white mt-2">{robot.name}</h3>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/5 text-[11px] font-mono text-slate-400">
                    <span>{robot.dofs} Degrees of Freedom</span>
                    <span className="text-slate-300">{robot.batteryLife}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Kinematic Specifications (7 cols) */}
        <div className="lg:col-span-7">
          {selectedRobot && (
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-2xl shadow-xl space-y-6">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                  Robotic Kinematic Blueprint
                </span>
                <h2 className="text-lg font-black text-white mt-0.5">{selectedRobot.name}</h2>
                <p className="text-xs text-cyan-300 font-medium">{selectedRobot.category}</p>
              </div>

              <p className="text-xs md:text-sm text-slate-200 leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/5">
                {selectedRobot.summary}
              </p>

              {/* Technical Specifications Matrix */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-[10px] text-slate-400 font-mono block">Actuation System</span>
                  <span className="font-bold text-white mt-1 block">{selectedRobot.actuatorType}</span>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-[10px] text-slate-400 font-mono block">Autonomous Brain</span>
                  <span className="font-bold text-white mt-1 block">{selectedRobot.aiBrainArchitecture}</span>
                </div>
              </div>

              {/* Verified Capabilities */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Benchmarked Real-World Capabilities
                </h4>
                <div className="space-y-2">
                  {selectedRobot.keyCapabilities.map((cap, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
