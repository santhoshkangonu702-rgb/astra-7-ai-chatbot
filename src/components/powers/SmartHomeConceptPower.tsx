import React, { useState } from 'react';
import {
  Home,
  Zap,
  ShieldCheck,
  Sun,
  Thermometer,
  Tv,
  Bot,
  Sliders,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Fan,
  Power
} from 'lucide-react';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

interface SmartHomeConceptPowerProps {
  onBack?: () => void;
}

export const SmartHomeConceptPower: React.FC<SmartHomeConceptPowerProps> = ({ onBack }) => {
  // Simulation Controls State
  const [targetTemp, setTargetTemp] = useState(21.5);
  const [lightsOn, setLightsOn] = useState(true);
  const [securityArmed, setSecurityArmed] = useState(true);
  const [robotVacuumActive, setRobotVacuumActive] = useState(false);
  const [solarGenerationKW] = useState(6.4);
  const [currentUsageKW] = useState(2.8);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 text-slate-100 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-yellow-500/15 border border-amber-500/25 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all group shrink-0 mr-1"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
              <span>← Back</span>
            </button>
          )}
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
            <Home className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">ASTRA SMART HOME CONCEPT</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                FUTURISTIC 2040
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive Architectural Simulation: Energy, Security, Lighting, Climate, Robotics & Automation
            </p>
          </div>
        </div>
      </div>

      {/* Prominent Mandatory Safety Label: SIMULATION vs REAL CONNECTED DEVICE */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
        <div className="leading-relaxed">
          <strong className="block text-amber-300 uppercase tracking-wider font-mono text-[11px]">
            SIMULATION ENVIRONMENT ONLY — NO PHYSICAL HARDWARE LINKED
          </strong>
          ASTRA 7 distinguishes conceptual digital twin simulations from physical IoT hardware.
          No real electrical relays, locks, or appliances have been actuated.
        </div>
      </div>

      {/* Futuristic Energy Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
          <span className="text-slate-400 font-mono text-[10px]">SOLAR ROOF GENERATION</span>
          <div className="text-2xl font-black text-amber-300 font-mono">+{solarGenerationKW} kW</div>
          <span className="text-[10px] text-emerald-400 font-mono">Perovskite Bifacial Solar Array</span>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
          <span className="text-slate-400 font-mono text-[10px]">HOUSEHOLD CONSUMPTION</span>
          <div className="text-2xl font-black text-white font-mono">{currentUsageKW} kW</div>
          <span className="text-[10px] text-slate-400 font-mono">Heat Pump + Lighting + Compute Hub</span>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
          <span className="text-slate-400 font-mono text-[10px]">NET GRID EXPORT / BATTERY</span>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            +{(solarGenerationKW - currentUsageKW).toFixed(1)} kW
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">100% Self-Sustaining Clean Energy</span>
        </div>
      </div>

      {/* Simulated Subsystems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Climate & Thermal Simulation */}
        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-cyan-400" />
              <span>Simulated HVAC & Zonal Climate</span>
            </span>
            <span className="font-mono text-cyan-300 font-bold">{targetTemp}°C</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Zonal Temperature Target</span>
              <span>18°C – 26°C</span>
            </div>
            <input
              type="range"
              min={18}
              max={26}
              step={0.5}
              value={targetTemp}
              onChange={(e) => setTargetTemp(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>

          <p className="text-slate-400 text-[11px] leading-relaxed">
            Geothermal ground-loop heat pump dynamically maintains 21.5°C with micro-zone airflow dampers.
          </p>
        </div>

        {/* Security & Access Simulation */}
        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Biometric Perimeter Security</span>
            </span>
            <button
              onClick={() => {
                setSecurityArmed(!securityArmed);
                hapticAction();
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
                securityArmed ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}
            >
              {securityArmed ? 'ARMED (Quantum Enclave)' : 'DISARMED'}
            </button>
          </div>

          <div className="space-y-1.5 text-slate-300 text-[11px]">
            <div>• Facial & Gait Biometrics: Active at main portal</div>
            <div>• Synthetic Aperture Radar: Zero blindspots across perimeter</div>
            <div>• Local Passphrase Override: Operational on-device</div>
          </div>
        </div>

        {/* Smart Lighting Simulation */}
        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Circadian Lighting Simulation</span>
            </span>
            <button
              onClick={() => {
                setLightsOn(!lightsOn);
                hapticAction();
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
                lightsOn ? 'bg-amber-500 text-slate-950' : 'bg-white/5 text-slate-400'
              }`}
            >
              {lightsOn ? 'ACTIVE (Warm 2700K)' : 'STANDBY'}
            </button>
          </div>

          <p className="text-slate-400 text-[11px] leading-relaxed">
            Full-spectrum micro-LED panels track the natural solar curve to optimize human melatonin cycles.
          </p>
        </div>

        {/* Domestic Robotics Concept */}
        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-400" />
              <span>Domestic Robotics Concept</span>
            </span>
            <button
              onClick={() => {
                setRobotVacuumActive(!robotVacuumActive);
                hapticAction();
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
                robotVacuumActive ? 'bg-purple-500 text-white' : 'bg-white/5 text-slate-400'
              }`}
            >
              {robotVacuumActive ? 'CLEANING IN PROGRESS' : 'DOCKED AT DOCK-01'}
            </button>
          </div>

          <p className="text-slate-400 text-[11px] leading-relaxed">
            Bipedal autonomous domestic assistant conceptualization: routes laundry, cleans surfaces, and monitors indoor plant hydroponics.
          </p>
        </div>
      </div>
    </div>
  );
};
