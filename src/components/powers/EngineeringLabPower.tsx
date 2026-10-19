import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  Wrench,
  Calculator,
  Compass,
  FileText,
  Sliders,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

export type EngineeringBranch =
  | 'Civil'
  | 'Mechanical'
  | 'Electrical'
  | 'Electronics'
  | 'Computer'
  | 'Chemical'
  | 'Aerospace';

interface EngineeringFormula {
  branch: EngineeringBranch;
  name: string;
  formula: string;
  variables: string;
  practicalApplication: string;
}

const FORMULAS: EngineeringFormula[] = [
  {
    branch: 'Civil',
    name: 'Euler Critical Buckling Load for Columns',
    formula: 'P_{cr} = \\frac{\\pi^2 E I}{(K L)^2}',
    variables: 'E = Young\'s Modulus, I = Area Moment of Inertia, L = Unsupported Length, K = Effective Column Factor',
    practicalApplication: 'Determining structural bridge pylon safety margins before mechanical collapse.'
  },
  {
    branch: 'Mechanical',
    name: 'Bernoulli Dynamic Pressure & Flow Conservation',
    formula: 'P_1 + \\frac{1}{2} \\rho v_1^2 + \\rho g h_1 = P_2 + \\frac{1}{2} \\rho v_2^2 + \\rho g h_2',
    variables: 'P = Static Pressure, \\rho = Fluid Density, v = Velocity, h = Elevation Head',
    practicalApplication: 'Venturi meter sizing and aerodynamic airfoil lift calculation.'
  },
  {
    branch: 'Aerospace',
    name: 'Tsiolkovsky Rocket Equation (Delta-V)',
    formula: '\\Delta v = I_{sp} g_0 \\ln \\left(\\frac{m_0}{m_f}\\right)',
    variables: 'I_{sp} = Specific Impulse (sec), g_0 = 9.80665 m/s^2, m_0 = Initial Wet Mass, m_f = Dry Final Mass',
    practicalApplication: 'Calculating payload mass fraction required for low-Earth orbit and lunar transfer injection.'
  },
  {
    branch: 'Electrical',
    name: 'Three-Phase AC Real Power',
    formula: 'P = \\sqrt{3} \\cdot V_{LL} \\cdot I_L \\cdot \\cos(\\phi)',
    variables: 'V_{LL} = Line-to-Line RMS Voltage, I_L = Line Current, \\cos(\\phi) = Power Factor',
    practicalApplication: 'Industrial substation transformer load balancing and power factor correction.'
  },
  {
    branch: 'Computer',
    name: 'Amdahl\'s Law of Parallel Speedup',
    formula: 'S_{latency}(s) = \\frac{1}{(1 - p) + \\frac{p}{s}}',
    variables: 'p = Proportion of parallel execution, s = Number of processors / cores',
    practicalApplication: 'Determining theoretical limit of multithreaded AI model inference scalability.'
  }
];

interface EngineeringLabPowerProps {
  onBack?: () => void;
}

export const EngineeringLabPower: React.FC<EngineeringLabPowerProps> = ({ onBack }) => {
  const [selectedBranch, setSelectedBranch] = useState<EngineeringBranch>('Aerospace');
  const [rocketIsp, setRocketIsp] = useState(380); // sec (LOX/Methane)
  const [wetMass, setWetMass] = useState(100000); // kg
  const [dryMass, setDryMass] = useState(12000); // kg

  // Rocket Delta-V
  const deltaV = rocketIsp * 9.80665 * Math.log(wetMass / dryMass);

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
            <Cpu className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">ASTRA ENGINEERING LAB</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                7 BRANCHES SUPPORTED
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Civil, Mechanical, Electrical, Electronics, Computer, Chemical & Aerospace Engineering
            </p>
          </div>
        </div>
      </div>

      {/* Required Approximate Educational Calculation Notice */}
      <div className="p-3.5 rounded-2xl bg-black/40 border border-amber-500/20 text-xs text-amber-200 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong>Educational Notice:</strong> Calculations and diagrams are simplified approximations
          intended for academic conceptualization and learning. Structural aerospace designs require formal finite-element (FEA) and regulatory sign-offs.
        </span>
      </div>

      {/* Branch Selector Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
        {(['Civil', 'Mechanical', 'Electrical', 'Electronics', 'Computer', 'Chemical', 'Aerospace'] as EngineeringBranch[]).map(
          (b) => (
            <button
              key={b}
              onClick={() => {
                setSelectedBranch(b);
                hapticAction();
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                selectedBranch === b
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {b}
            </button>
          )
        )}
      </div>

      {/* Interactive Calculation Workspace (Aerospace Tsiolkovsky Demo) */}
      <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center justify-between">
          <span>{selectedBranch} Calculation Workspace: Tsiolkovsky Delta-V</span>
          <span className="text-[10px] font-mono text-slate-400">Approximate Educational Model</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1.5">
            <span className="text-slate-400">Specific Impulse (I_sp): {rocketIsp} seconds</span>
            <input
              type="range"
              min={250}
              max={480}
              value={rocketIsp}
              onChange={(e) => setRocketIsp(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <span className="text-slate-400">Initial Wet Mass ($m_0$): {wetMass.toLocaleString()} kg</span>
            <input
              type="range"
              min={20000}
              max={300000}
              step={5000}
              value={wetMass}
              onChange={(e) => setWetMass(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>

          <div className="space-y-1.5">
            <span className="text-slate-400">Dry Mass ($m_f$): {dryMass.toLocaleString()} kg</span>
            <input
              type="range"
              min={5000}
              max={50000}
              step={1000}
              value={dryMass}
              onChange={(e) => setDryMass(Number(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>
        </div>

        {/* Calculated Result Card */}
        <div className="p-5 rounded-2xl bg-black/50 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">TOTAL DELTA-V ACCELERATION</span>
            <div className="text-3xl font-black font-mono text-white mt-0.5">
              {deltaV.toFixed(1)} m/s ({(deltaV / 1000).toFixed(2)} km/s)
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Low-Earth orbit requires roughly ~9.4 km/s. This vehicle {deltaV >= 9400 ? 'reaches orbit successfully' : 'requires additional staging stages'}.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] font-mono text-slate-300">
            Mass Fraction: {((dryMass / wetMass) * 100).toFixed(1)}% Structural
          </div>
        </div>
      </div>

      {/* Engineering Formulas Registry */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
          Standard Engineering Formula Matrix
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FORMULAS.map((f, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{f.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-amber-300">{f.branch}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 font-mono text-amber-200 text-sm">
                ${f.formula}$
              </div>
              <p className="text-[11px] text-slate-400 font-mono">{f.variables}</p>
              <p className="text-slate-300 text-[11px] pt-1 border-t border-white/5">
                <strong>Application:</strong> {f.practicalApplication}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
