import React, { useState } from 'react';
import {
  ArrowLeft,
  Building2,
  Car,
  Zap,
  Radio,
  Sliders,
  Sparkles,
  Layers,
  Wind,
  ShieldCheck,
  RotateCcw,
  Activity,
  Cpu,
  Info
} from 'lucide-react';

interface DistrictMetric {
  label: string;
  value: string;
  trend: string;
  status: 'optimal' | 'nominal' | 'adaptive';
}

interface CityDistrict {
  id: 'transport' | 'energy' | 'buildings' | 'comm';
  title: string;
  subtitle: string;
  icon: React.ElementType;
  description: string;
  concepts: Array<{
    name: string;
    description: string;
    readiness: 'CURRENT PROTOTYPE' | 'RESEARCH' | '2040 CONCEPT';
    metrics: string;
  }>;
  simulationParams: {
    efficiency: number;
    carbonAbsorption: number;
    networkMeshDensity: number;
    autonomousFlowRate: number;
  };
}

const FUTURE_CITY_DISTRICTS: CityDistrict[] = [
  {
    id: 'transport',
    title: 'TRANSPORTATION & SPATIAL MOBILITY',
    subtitle: 'Autonomous Maglev Transit, EV Fleet Swarms, & Vertiports',
    icon: Car,
    description:
      'Zero-emission subterranean freight tubes, elevated maglev arterial conduits, and autonomous passenger pods operating on collisionless algorithmic swarm routing.',
    concepts: [
      {
        name: 'Autonomous Pod Swarm Routing',
        description: 'V2X (Vehicle-to-Everything) micro-routing eliminating traffic lights; pods pass through intersections at staggered micro-intervals.',
        readiness: 'CURRENT PROTOTYPE',
        metrics: '99.4% congestion reduction in simulation'
      },
      {
        name: 'Aerodynamic Urban Vertiports',
        description: 'Multi-tiered skyscraper sky-docks accommodating electric vertical takeoff and landing (eVTOL) air ambulances and intercity shuttles.',
        readiness: 'RESEARCH',
        metrics: '3.2 min average emergency medical response'
      },
      {
        name: 'Subterranean Cryogenic Freight Maglev',
        description: 'Underground pneumatic and magnetic levitation tubes quietly transporting 80% of inner-city dry cargo during nighttime hours.',
        readiness: '2040 CONCEPT',
        metrics: 'Zero surface heavy truck emissions'
      }
    ],
    simulationParams: {
      efficiency: 94,
      carbonAbsorption: 88,
      networkMeshDensity: 96,
      autonomousFlowRate: 98
    }
  },
  {
    id: 'energy',
    title: 'RENEWABLE ENERGY & MICRO-GRIDS',
    subtitle: 'Compact Clean Fusion, Photovoltaic Perovskite Facades, & Solid-State Reserves',
    icon: Zap,
    description:
      'Decentralized energy distribution network leveraging building-integrated transparent solar glass, modular molten salt heat storage, and micro-fusion baseload stability.',
    concepts: [
      {
        name: 'Perovskite-Quantum Dot Solar Glazing',
        description: 'High-clarity architectural window glass that absorbs infrared and ultraviolet spectra to produce electricity without darkening interiors.',
        readiness: 'RESEARCH',
        metrics: '28.4% photon-to-electron yield'
      },
      {
        name: 'Decentralized Solid-State Storage Banks',
        description: 'Non-combustible sodium-ion modular battery vaults integrated into subterranean building foundations to balance peak municipal demand.',
        readiness: 'CURRENT PROTOTYPE',
        metrics: '12-hour full district backup capacity'
      },
      {
        name: 'District Ambient Heat Scavenging',
        description: 'Thermal heat pump loops capturing waste heat from server compute centers to heat residential baths and aeroponic farms.',
        readiness: '2040 CONCEPT',
        metrics: '91% total thermodynamic recovery'
      }
    ],
    simulationParams: {
      efficiency: 97,
      carbonAbsorption: 94,
      networkMeshDensity: 92,
      autonomousFlowRate: 89
    }
  },
  {
    id: 'buildings',
    title: 'SMART BUILDINGS & BIOPHILIC INFRASTRUCTURE',
    subtitle: 'Kinetic Carbon-Negative Facades & Automated Vertical Farms',
    icon: Building2,
    description:
      'Living architectural structures utilizing bio-engineered self-healing concrete, passive thermal chimneys, automated robotic window cleaners, and aeroponic food gardens.',
    concepts: [
      {
        name: 'Bio-Engineered Self-Healing Concrete',
        description: 'Bacterial spores embedded in structural slabs produce limestone upon moisture contact, autonomously sealing micro-fractures.',
        readiness: 'RESEARCH',
        metrics: '120-year structural design lifespan'
      },
      {
        name: 'Internal Aeroponic Sky-Farms',
        description: 'Automated hydroponic and mist-fed vertical agricultural spirals inside high-rises yielding leafy greens and legumes with 95% less water.',
        readiness: 'CURRENT PROTOTYPE',
        metrics: '22 tons organic produce / tower / year'
      },
      {
        name: 'Kinetic Solar-Tracking Shading Louvers',
        description: 'Shape-memory alloy louvers that autonomously track sunlight vectors to minimize HVAC air-conditioning loads.',
        readiness: '2040 CONCEPT',
        metrics: '46% reduction in cooling energy'
      }
    ],
    simulationParams: {
      efficiency: 91,
      carbonAbsorption: 99,
      networkMeshDensity: 88,
      autonomousFlowRate: 85
    }
  },
  {
    id: 'comm',
    title: 'COMMUNICATION & SPATIAL MESH',
    subtitle: 'Terahertz 6G Networks, Ambient IoT Sensors, & Holographic Telepresence',
    icon: Radio,
    description:
      'Ubiquitous spatial computing fabric delivering sub-millisecond tactile internet, environmental air and seismic monitoring, and encrypted citizen data sovereignty.',
    concepts: [
      {
        name: 'Terahertz Sub-Millisecond 6G Relay',
        description: 'Micro-antenna beamforming arrays delivering 100 Gbps per user node for seamless spatial AR glasses and autonomous vehicle telemetry.',
        readiness: 'RESEARCH',
        metrics: '0.4 millisecond ultra-reliable latency'
      },
      {
        name: 'Planetary Seismic & Environmental Mesh',
        description: 'Granular MEMS sensors embedded in asphalt, bridge pillars, and water mains alerting authorities 30 seconds before earthquake S-waves.',
        readiness: 'CURRENT PROTOTYPE',
        metrics: '10,000 sampling points per km²'
      },
      {
        name: 'Holographic Civic Plaza Kiosks',
        description: 'Volumetric light-field displays for civic assemblies, democratic voting, and multi-lingual real-time municipal advisory.',
        readiness: '2040 CONCEPT',
        metrics: 'Zero-glasses 3D spatial field'
      }
    ],
    simulationParams: {
      efficiency: 99,
      carbonAbsorption: 82,
      networkMeshDensity: 99,
      autonomousFlowRate: 95
    }
  }
];

interface AstraFutureCityPowerProps {
  onBack?: () => void;
}

export const AstraFutureCityPower: React.FC<AstraFutureCityPowerProps> = ({ onBack }) => {
  const [selectedDistrictId, setSelectedDistrictId] = useState<'transport' | 'energy' | 'buildings' | 'comm'>('transport');
  const [simulationSpeed, setSimulationSpeed] = useState<'realtime' | 'accelerated'>('realtime');
  const [sliderEfficiency, setSliderEfficiency] = useState(94);

  const activeDistrict = FUTURE_CITY_DISTRICTS.find((d) => d.id === selectedDistrictId) || FUTURE_CITY_DISTRICTS[0];

  return (
    <div id="astra-future-city" className="h-full overflow-y-auto px-4 py-6 md:px-8 space-y-8 text-slate-100 max-w-7xl mx-auto">
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
                <Building2 className="w-7 h-7 text-amber-400" />
                ASTRA FUTURE CITY — 2040
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                2040 SIMULATION
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Hypothetical exploratory simulation of urban autonomy, clean energy micro-grids, and biophilic engineering
            </p>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-[11px] font-mono text-purple-200">
          <Info className="w-4 h-4 text-purple-400 flex-shrink-0" />
          <span>2040 FUTURE CONCEPT / SIMULATION • NOT CURRENT REALITY</span>
        </div>
      </div>

      {/* District Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {FUTURE_CITY_DISTRICTS.map((district) => {
          const Icon = district.icon;
          const isSelected = selectedDistrictId === district.id;
          return (
            <button
              key={district.id}
              onClick={() => setSelectedDistrictId(district.id)}
              className={`p-4 rounded-2xl border text-left transition-all backdrop-blur-xl ${
                isSelected
                  ? 'bg-gradient-to-br from-amber-500/20 via-purple-500/10 to-cyan-500/20 border-amber-400 text-white shadow-[0_0_20px_rgba(234,179,8,0.2)]'
                  : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="p-2 w-fit rounded-xl bg-white/5 border border-white/10 mb-3 text-amber-300">
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-xs font-black tracking-wide">{district.title}</div>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{district.subtitle}</p>
            </button>
          );
        })}
      </div>

      {/* Active District Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* District Overview & Concepts (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-950/70 border border-amber-400/30 backdrop-blur-2xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                  Active District Architecture
                </span>
                <h2 className="text-xl font-black text-white mt-1">{activeDistrict.title}</h2>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                NET-ZERO BALANCED
              </span>
            </div>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/5">
              {activeDistrict.description}
            </p>

            {/* Architectural Concepts */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                District Engineering Pillars
              </h3>
              <div className="space-y-3">
                {activeDistrict.concepts.map((concept) => (
                  <div
                    key={concept.name}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-amber-400/30 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">{concept.name}</span>
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded border ${
                          concept.readiness === 'CURRENT PROTOTYPE'
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : concept.readiness === 'RESEARCH'
                            ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                            : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                        }`}
                      >
                        {concept.readiness}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400">{concept.description}</p>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-amber-300 font-mono">
                      <span>Simulated Performance Metric:</span>
                      <span className="font-bold">{concept.metrics}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Simulation Matrix (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-2xl shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-wider text-slate-200">
                  Telemetry Simulation
                </span>
              </div>
              <span className="text-[10px] font-mono text-cyan-300">2040 VIRTUAL TWIN</span>
            </div>

            {/* Gauges */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Autonomous Flow Rate</span>
                  <span className="text-cyan-300 font-mono font-bold">{activeDistrict.simulationParams.autonomousFlowRate}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${activeDistrict.simulationParams.autonomousFlowRate}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Carbon Capture & Neutrality</span>
                  <span className="text-emerald-300 font-mono font-bold">{activeDistrict.simulationParams.carbonAbsorption}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${activeDistrict.simulationParams.carbonAbsorption}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Mesh Sensor Connectivity</span>
                  <span className="text-purple-300 font-mono font-bold">{activeDistrict.simulationParams.networkMeshDensity}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-400 rounded-full transition-all duration-500"
                    style={{ width: `${activeDistrict.simulationParams.networkMeshDensity}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Thermodynamic Efficiency</span>
                  <span className="text-amber-300 font-mono font-bold">{sliderEfficiency}%</span>
                </div>
                <input
                  type="range"
                  min={80}
                  max={100}
                  value={sliderEfficiency}
                  onChange={(e) => setSliderEfficiency(Number(e.target.value))}
                  className="w-full accent-amber-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Simulation Controls */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-400">Simulation Clock:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setSimulationSpeed('realtime')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono ${
                    simulationSpeed === 'realtime'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                      : 'bg-white/5 text-slate-400'
                  }`}
                >
                  1x Normal
                </button>
                <button
                  onClick={() => setSimulationSpeed('accelerated')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono ${
                    simulationSpeed === 'accelerated'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                      : 'bg-white/5 text-slate-400'
                  }`}
                >
                  100x Accelerated
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
