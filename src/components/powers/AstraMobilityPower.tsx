import React, { useState } from 'react';
import {
  Car,
  Plane,
  Train,
  Zap,
  ArrowLeft,
  Navigation,
  Globe2,
  Cpu,
  ShieldCheck,
  Fuel,
  Compass
} from 'lucide-react';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

export type MobilityTopic =
  | 'Electric vehicles'
  | 'Autonomous vehicles'
  | 'Public transport'
  | 'Railways'
  | 'Aircraft'
  | 'Drones'
  | 'Hyperloop concepts'
  | 'Smart traffic'
  | 'Charging infrastructure';

interface MobilitySystem {
  id: string;
  topic: MobilityTopic;
  title: string;
  currentTech: string;
  researchAndPrototypes: string;
  futureConcept2040: string;
  environmentalImpact: string;
  infrastructureRequirements: string;
}

const MOBILITY_SYSTEMS: MobilitySystem[] = [
  {
    id: 'mob-1',
    topic: 'Electric vehicles',
    title: 'Solid-State Sodium-Ion & Silicon-Anode Battery Platforms',
    currentTech: 'Liquid electrolyte lithium iron phosphate (LFP) & NMC chemistries achieving 450–650 km range.',
    researchAndPrototypes: 'Sulfur-lithium and solid-state silicon anodes delivering 500 Wh/kg with 10-minute 10-80% charge curves.',
    futureConcept2040: 'Structural chassis batteries integrating wireless dynamic resonant highway induction charging.',
    environmentalImpact: 'Zero direct tailpipe emissions; 78% life-cycle carbon reduction when paired with solar grid.',
    infrastructureRequirements: '1000V Megawatt DC fast-charging plazas and grid-scale sodium battery buffering.'
  },
  {
    id: 'mob-2',
    topic: 'Railways',
    title: 'High-Speed Magnetic Levitation (Maglev) & Hydrogen Shinkansen',
    currentTech: 'High-speed rail (Vande Bharat / Shinkansen / TGV) operating at 160–320 km/h on standard gauge.',
    researchAndPrototypes: 'High-temperature superconductor (HTS) Maglev running at 620 km/h in partial vacuum tube test tracks.',
    futureConcept2040: 'Inter-city pneumatic Maglev linking national economic hubs in under 45 minutes.',
    environmentalImpact: 'Consumes 1/5th the energy per passenger-kilometer of commercial short-haul aviation.',
    infrastructureRequirements: 'Dedicated elevated guideways, liquid nitrogen cryo-cooling facilities, and vibration damping.'
  },
  {
    id: 'mob-3',
    topic: 'Autonomous vehicles',
    title: 'Level 4 / Level 5 Autonomous Sensor Fusion & V2X Mesh',
    currentTech: 'Vision + 4D imaging radar + solid-state LiDAR operating within geofenced robotaxi corridors.',
    researchAndPrototypes: 'End-to-end multimodal neural policy networks with millimeter-wave V2X intersection coordination.',
    futureConcept2040: 'Zero-traffic-signal decentralized urban transit where vehicular platoons weave seamlessly.',
    environmentalImpact: '35% reduction in braking energy losses via fluid intersection pacing.',
    infrastructureRequirements: '5G-Advanced / 6G low-latency roadside units and high-definition dynamic spatial mapping.'
  },
  {
    id: 'mob-4',
    topic: 'Aircraft',
    title: 'Electric Vertical Takeoff and Landing (eVTOL) & Hydrogen Turbofans',
    currentTech: 'Composite airframes with kerosene turbofans; preliminary 4-seater eVTOL flight trials.',
    researchAndPrototypes: 'Liquid hydrogen fuel cells powering regional commuter aircraft (up to 80 passengers, 1,000 km).',
    futureConcept2040: 'Urban air mobility (UAM) aerial skyways integrated with high-rise vertiports.',
    environmentalImpact: 'Abolishes high-altitude nitrogen oxide (NOx) and soot emissions; water vapor primary exhaust.',
    infrastructureRequirements: 'Cryogenic liquid hydrogen airport storage tanks and autonomous airspace flight corridors.'
  }
];

interface AstraMobilityPowerProps {
  onBack?: () => void;
}

export const AstraMobilityPower: React.FC<AstraMobilityPowerProps> = ({ onBack }) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedSystem, setSelectedSystem] = useState<MobilitySystem>(MOBILITY_SYSTEMS[0]);

  const filtered = MOBILITY_SYSTEMS.filter((m) => {
    if (selectedTopic !== 'all' && m.topic !== selectedTopic) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 text-slate-100 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-indigo-500/15 border border-cyan-500/25 backdrop-blur-md">
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
          <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
            <Car className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">ASTRA MOBILITY</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                FUTURE TRANSPORT 2040
              </span>
            </div>
            <p className="text-xs text-slate-400">
              EVs, Autonomous Vehicles, High-Speed Maglev, eVTOL Aviation, Hyperloop & Smart Traffic
            </p>
          </div>
        </div>
      </div>

      {/* Filter Topics */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
        {['all', 'Electric vehicles', 'Railways', 'Autonomous vehicles', 'Aircraft'].map((top) => (
          <button
            key={top}
            onClick={() => {
              setSelectedTopic(top);
              hapticAction();
            }}
            className={`px-3 py-1.5 rounded-xl font-bold capitalize transition-all ${
              selectedTopic === top
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            {top}
          </button>
        ))}
      </div>

      {/* Grid: Topics List + Deep Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-2">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setSelectedSystem(item);
                hapticAction();
              }}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedSystem.id === item.id
                  ? 'bg-cyan-500/15 border-cyan-500/40 shadow-md'
                  : 'bg-white/[0.02] border-white/5 hover:border-white/10'
              }`}
            >
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold uppercase">
                {item.topic}
              </span>
              <h4 className="text-sm font-bold text-white mt-1.5">{item.title}</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.currentTech}</p>
            </div>
          ))}
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-black/50 border border-white/10 space-y-4 text-xs">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-cyan-300">
              {selectedSystem.topic}
            </span>
            <h3 className="text-lg font-black text-white">{selectedSystem.title}</h3>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="font-mono text-[10px] text-amber-400 font-bold uppercase">CURRENT TECHNOLOGY</span>
                <p className="text-slate-200">{selectedSystem.currentTech}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase">
                  RESEARCH & PROTOTYPES
                </span>
                <p className="text-slate-200">{selectedSystem.researchAndPrototypes}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="font-mono text-[10px] text-purple-400 font-bold uppercase">
                  2040 FUTURE CONCEPT
                </span>
                <p className="text-slate-200">{selectedSystem.futureConcept2040}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                  <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase">
                    ENVIRONMENTAL IMPACT
                  </span>
                  <p className="text-slate-300 text-[11px]">{selectedSystem.environmentalImpact}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <span className="font-mono text-[10px] text-slate-400 font-bold uppercase">
                    INFRASTRUCTURE REQUIREMENTS
                  </span>
                  <p className="text-slate-300 text-[11px]">{selectedSystem.infrastructureRequirements}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
