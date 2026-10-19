import React, { useState } from 'react';
import {
  FlaskConical,
  Zap,
  Sliders,
  RotateCcw,
  Play,
  Pause,
  ArrowLeft,
  Activity,
  CheckCircle2,
  HelpCircle,
  Binary,
  Cpu,
  BarChart2
} from 'lucide-react';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

export type LabSubject = 'Electronics' | 'Physics' | 'Chemistry' | 'Mathematics' | 'Computer Science';

interface AstraLabPowerProps {
  onBack?: () => void;
}

export const AstraLabPower: React.FC<AstraLabPowerProps> = ({ onBack }) => {
  const [activeSubject, setActiveSubject] = useState<LabSubject>('Electronics');

  // Electronics Circuit State
  const [batteryVoltage, setBatteryVoltage] = useState(9); // Volts
  const [resistance, setResistance] = useState(100); // Ohms
  const [isCircuitClosed, setIsCircuitClosed] = useState(true);

  // Physics Pendulum State
  const [pendulumLength, setPendulumLength] = useState(2.0); // meters
  const [gravity, setGravity] = useState(9.81); // m/s^2

  // Chemistry pH Reaction State
  const [acidMoles, setAcidMoles] = useState(0.1);
  const [baseMoles, setBaseMoles] = useState(0.1);

  // Calculations
  const currentAmps = isCircuitClosed ? batteryVoltage / resistance : 0;
  const powerWatts = isCircuitClosed ? (batteryVoltage * batteryVoltage) / resistance : 0;
  const pendulumPeriod = 2 * Math.PI * Math.sqrt(pendulumLength / gravity);

  const netH = acidMoles - baseMoles;
  let simulatedPH = 7.0;
  if (netH > 0) {
    simulatedPH = Math.max(1, -Math.log10(netH * 10));
  } else if (netH < 0) {
    simulatedPH = Math.min(14, 14 + Math.log10(Math.abs(netH) * 10));
  }

  const handleReset = () => {
    setBatteryVoltage(9);
    setResistance(100);
    setIsCircuitClosed(true);
    setPendulumLength(2.0);
    setGravity(9.81);
    setAcidMoles(0.1);
    setBaseMoles(0.1);
    hapticAction();
  };

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
            <FlaskConical className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">ASTRA LAB</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                INTERACTIVE SIMULATOR
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Virtual Experiments with Formula Equations, Graphs, Interactive Sliders & Scientific Explanations
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-mono transition-colors shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Lab</span>
        </button>
      </div>

      {/* Subject Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-white/10 pb-2 text-xs">
        {(['Electronics', 'Physics', 'Chemistry', 'Mathematics', 'Computer Science'] as LabSubject[]).map((subj) => (
          <button
            key={subj}
            onClick={() => {
              setActiveSubject(subj);
              hapticAction();
            }}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              activeSubject === subj
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            {subj}
          </button>
        ))}
      </div>

      {/* SIMULATION 1: ELECTRONICS (Virtual Circuit) */}
      {activeSubject === 'Electronics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>DC Ohm's Law Circuit Controls</span>
            </h3>

            {/* Voltage Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Battery Voltage ($V$)</span>
                <span className="text-amber-300 font-mono font-bold">{batteryVoltage} V</span>
              </div>
              <input
                type="range"
                min={1}
                max={48}
                value={batteryVoltage}
                onChange={(e) => setBatteryVoltage(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            {/* Resistance Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Resistor ($R$)</span>
                <span className="text-cyan-300 font-mono font-bold">{resistance} Ω</span>
              </div>
              <input
                type="range"
                min={10}
                max={1000}
                step={10}
                value={resistance}
                onChange={(e) => setResistance(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            {/* Switch Toggle */}
            <div className="pt-2 flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 text-xs">
              <span>Circuit Switch</span>
              <button
                onClick={() => setIsCircuitClosed(!isCircuitClosed)}
                className={`px-3 py-1.5 rounded-lg font-bold font-mono text-xs transition-colors ${
                  isCircuitClosed ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
                }`}
              >
                {isCircuitClosed ? 'CLOSED (Conducting)' : 'OPEN (Zero Flow)'}
              </button>
            </div>

            {/* Formula Display Required */}
            <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-1 text-xs">
              <span className="font-mono text-[10px] text-amber-400 font-bold uppercase">GOVERNING FORMULAS</span>
              <div className="font-mono text-slate-200">
                {"• Current: I = V / R"}
              </div>
              <div className="font-mono text-slate-200">
                {"• Power Dissipated: P = V · I = V² / R"}
              </div>
            </div>
          </div>

          {/* Results & Visualizer Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-3xl bg-black/50 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-slate-400">TELEMETRY READOUT</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  Real-Time Calculation
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-slate-400 text-[10px] font-mono">CURRENT ($I$)</span>
                  <div className="text-2xl font-bold font-mono text-white">
                    {(currentAmps * 1000).toFixed(1)} mA
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">({currentAmps.toFixed(4)} Amperes)</div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-slate-400 text-[10px] font-mono">POWER DISSIPATION ($P$)</span>
                  <div className="text-2xl font-bold font-mono text-amber-300">
                    {powerWatts.toFixed(3)} W
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">Thermal output</div>
                </div>
              </div>

              {/* Circuit Schematic Display */}
              <div className="p-6 rounded-2xl bg-black/70 border border-white/5 flex flex-col items-center justify-center min-h-[140px] text-xs font-mono">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-center">
                    [+] Battery {batteryVoltage}V [-]
                  </div>
                  <div className={`h-0.5 w-12 ${isCircuitClosed ? 'bg-amber-400 animate-pulse' : 'bg-slate-700'}`} />
                  <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-center">
                    [ Resistor {resistance}Ω ]
                  </div>
                  <div className={`h-0.5 w-12 ${isCircuitClosed ? 'bg-amber-400 animate-pulse' : 'bg-slate-700'}`} />
                  <div
                    className={`p-3 rounded-full border text-center transition-all ${
                      isCircuitClosed ? 'bg-yellow-400/30 text-yellow-300 border-yellow-400' : 'bg-slate-800 text-slate-500 border-slate-700'
                    }`}
                  >
                    💡 LED
                  </div>
                </div>
                <div className="text-slate-400 text-[11px] mt-4">
                  {isCircuitClosed
                    ? `Current flows steadily at ${(currentAmps * 1000).toFixed(1)} mA.`
                    : 'Switch open: current circuit impedance is infinite.'}
                </div>
              </div>

              {/* Scientific Explanation */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1 text-xs">
                <span className="font-bold text-slate-200">Scientific Explanation:</span>
                <p className="text-slate-400 leading-relaxed font-sans">
                  According to Ohm's Law, electric current through a conductor between two points is directly
                  proportional to the voltage across the two points and inversely proportional to the resistance.
                  When you double the resistance, the current is halved.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIMULATION 2: PHYSICS (Harmonic Pendulum) */}
      {activeSubject === 'Physics' && (
        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white">Simple Harmonic Motion — Pendulum Oscillations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <span className="text-slate-400">Length ($L$): {pendulumLength} meters</span>
                <input
                  type="range"
                  min={0.5}
                  max={10}
                  step={0.1}
                  value={pendulumLength}
                  onChange={(e) => setPendulumLength(Number(e.target.value))}
                  className="w-full accent-amber-500 mt-1"
                />
              </div>
              <div>
                <span className="text-slate-400">Gravity ($g$): {gravity} m/s² (Earth = 9.81, Moon = 1.62, Mars = 3.72)</span>
                <input
                  type="range"
                  min={1}
                  max={25}
                  step={0.1}
                  value={gravity}
                  onChange={(e) => setGravity(Number(e.target.value))}
                  className="w-full accent-cyan-500 mt-1"
                />
              </div>
            </div>
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <span className="text-[10px] font-mono text-amber-400 font-bold">{"PERIOD EQUATION: T = 2π√(L/g)"}</span>
                <div className="text-3xl font-bold font-mono text-white">{pendulumPeriod.toFixed(2)} seconds</div>
              <p className="text-slate-400 text-[11px]">Notice that period is completely independent of the bob's mass.</p>
            </div>
          </div>
        </div>
      )}

      {/* SIMULATION 3: CHEMISTRY (pH Neutralization) */}
      {activeSubject === 'Chemistry' && (
        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white">Acid-Base Neutralization Titration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <span className="text-slate-400">Hydrochloric Acid (HCl): {acidMoles} Moles</span>
                <input
                  type="range"
                  min={0.01}
                  max={1.0}
                  step={0.01}
                  value={acidMoles}
                  onChange={(e) => setAcidMoles(Number(e.target.value))}
                  className="w-full accent-rose-500 mt-1"
                />
              </div>
              <div>
                <span className="text-slate-400">Sodium Hydroxide (NaOH): {baseMoles} Moles</span>
                <input
                  type="range"
                  min={0.01}
                  max={1.0}
                  step={0.01}
                  value={baseMoles}
                  onChange={(e) => setBaseMoles(Number(e.target.value))}
                  className="w-full accent-cyan-500 mt-1"
                />
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <span className="text-[10px] font-mono text-amber-400 font-bold">CALCULATED SOLUTION pH:</span>
              <div className="text-3xl font-bold font-mono text-amber-300">pH {simulatedPH.toFixed(2)}</div>
              <p className="text-slate-400 text-[11px]">
                {simulatedPH < 7 ? 'Acidic Solution ($[H^+] > [OH^-]$)' : simulatedPH > 7 ? 'Basic Solution ($[OH^-] > [H^+]$)' : 'Perfect Equivalence Point (Neutral)'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
