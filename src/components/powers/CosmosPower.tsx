import React, { useState, useEffect, useRef } from 'react';
import {
  Satellite,
  Globe,
  Radio,
  Compass,
  Layers,
  Sparkles,
  ChevronRight,
  Info,
  Calendar,
  Zap,
  Clock,
  Navigation,
  Orbit,
  Maximize2
} from 'lucide-react';
import { SATELLITE_DATA, PLANET_DATA, SPACE_MISSIONS } from '../../data/sampleData';
import { SatelliteData, PlanetData, SpaceMission } from '../../types';

interface CosmosPowerProps {
  onAskAstra?: (query: string) => void;
}

export const CosmosPower: React.FC<CosmosPowerProps> = ({ onAskAstra }) => {
  const [activeTab, setActiveTab] = useState<'satellites' | 'planets' | 'missions' | 'discoveries'>('satellites');
  const [selectedSatellite, setSelectedSatellite] = useState<SatelliteData>(SATELLITE_DATA[0]);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData>(PLANET_DATA[2]); // Earth
  const [timeOffset, setTimeOffset] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animate orbital projection canvas
  useEffect(() => {
    let animationFrameId: number;
    let angle = 0;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      angle += 0.008;
      setTimeOffset((prev) => prev + 1);

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const earthRadius = Math.min(width, height) * 0.22;

      ctx.clearRect(0, 0, width, height);

      // Deep cosmic space background with subtle stars
      ctx.fillStyle = '#05050A';
      ctx.fillRect(0, 0, width, height);

      // Background starfield
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let i = 0; i < 40; i++) {
        const sx = (Math.sin(i * 99 + angle * 0.05) * 0.5 + 0.5) * width;
        const sy = (Math.cos(i * 33 + angle * 0.02) * 0.5 + 0.5) * height;
        ctx.fillRect(sx, sy, 1.2, 1.2);
      }

      // Orbital Rings for satellites
      ctx.save();
      // Orbit 1 (ISS Low Earth Orbit)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, earthRadius * 1.35, earthRadius * 0.7, 0.4, 0, Math.PI * 2);
      ctx.stroke();

      // Orbit 2 (Hubble / Medium Orbit)
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, earthRadius * 1.7, earthRadius * 0.9, -0.6, 0, Math.PI * 2);
      ctx.stroke();

      // Orbit 3 (Geostationary / Deep Space)
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.25)';
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, earthRadius * 2.1, earthRadius * 1.15, 0.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Draw Earth Hologram
      const grad = ctx.createRadialGradient(
        centerX - earthRadius * 0.3,
        centerY - earthRadius * 0.3,
        earthRadius * 0.1,
        centerX,
        centerY,
        earthRadius
      );
      grad.addColorStop(0, '#38BDF8');
      grad.addColorStop(0.4, '#1E40AF');
      grad.addColorStop(0.85, '#0F172A');
      grad.addColorStop(1, '#05050A');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthRadius, 0, Math.PI * 2);
      ctx.fill();

      // Earth atmosphere glow
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Latitude and Longitude Grid Lines on Globe
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      for (let lat = -2; lat <= 2; lat++) {
        ctx.beginPath();
        ctx.ellipse(
          centerX,
          centerY + lat * (earthRadius * 0.3),
          Math.sqrt(Math.max(0, earthRadius * earthRadius - Math.pow(lat * (earthRadius * 0.3), 2))),
          earthRadius * 0.18,
          0,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }
      ctx.restore();

      // Draw Active Satellite Position (e.g. ISS or selected)
      const satOrbitX = earthRadius * 1.35;
      const satOrbitY = earthRadius * 0.7;
      const satAngle = angle * 2;
      const satX = centerX + Math.cos(satAngle) * satOrbitX * Math.cos(0.4) - Math.sin(satAngle) * satOrbitY * Math.sin(0.4);
      const satY = centerY + Math.cos(satAngle) * satOrbitX * Math.sin(0.4) + Math.sin(satAngle) * satOrbitY * Math.cos(0.4);

      // Satellite blip
      ctx.fillStyle = '#38BDF8';
      ctx.shadowColor = '#38BDF8';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(satX, satY, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '10px monospace';
      ctx.fillText(selectedSatellite.name.split(' ')[0], satX + 8, satY - 6);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [selectedSatellite]);

  return (
    <div id="cosmos-power" className="flex flex-col gap-6 text-white max-w-7xl mx-auto w-full">
      {/* Top Banner with Telemetry Status */}
      <div className="relative rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-violet-950/40 via-[#0A0B18] to-cyan-950/40 border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono tracking-widest uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Astra Cosmos
              </span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Telemetry Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-purple-100 to-cyan-200 bg-clip-text text-transparent">
              Cosmic & Orbital Intelligence
            </h1>
            <p className="text-sm text-gray-400 mt-1 max-w-xl">
              Real-time satellite orbital vectors, planetary physical parameters, deep-space telemetry, and historical astronomical discoveries.
            </p>
          </div>

          {/* Real-time telemetry metrics pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 flex flex-col">
              <span className="text-[10px] font-mono text-purple-300 uppercase">Tracked Satellites</span>
              <span className="text-lg font-bold font-mono text-cyan-300">12,480+</span>
            </div>
            <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 flex flex-col">
              <span className="text-[10px] font-mono text-purple-300 uppercase">ISS Orbit Speed</span>
              <span className="text-lg font-bold font-mono text-white">7.66 km/s</span>
            </div>
            <div className="col-span-2 sm:col-span-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 flex flex-col">
              <span className="text-[10px] font-mono text-purple-300 uppercase">JWST Distance</span>
              <span className="text-lg font-bold font-mono text-purple-300">1.5M km</span>
            </div>
          </div>
        </div>

        {/* Cosmos Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/10 overflow-x-auto pb-1">
          {[
            { id: 'satellites', label: 'Orbital Satellites', icon: Satellite },
            { id: 'planets', label: 'Solar System Planets', icon: Globe },
            { id: 'missions', label: 'Deep Space Missions', icon: Radio },
            { id: 'discoveries', label: 'Cosmic Discoveries', icon: Sparkles }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium tracking-wide transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Cosmos Explorer Body */}
      {activeTab === 'satellites' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Orbital Projection Canvas Panel (7 Cols) */}
          <div className="lg:col-span-7 rounded-2xl bg-[#0A0B18] border border-white/10 p-5 flex flex-col shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Orbit className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono tracking-wider uppercase text-gray-300">
                  Real-Time Orbital Projection
                </span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                Earth Vector Model
              </span>
            </div>

            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 bg-[#05050A]">
              <canvas
                ref={canvasRef}
                width={700}
                height={400}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono text-gray-300 flex items-center gap-3">
                <span className="text-cyan-400">Target: {selectedSatellite.name.split(' ')[0]}</span>
                <span>Alt: {selectedSatellite.orbitAltitudeKm} km</span>
                <span>Speed: {selectedSatellite.velocityKmS} km/s</span>
              </div>
            </div>

            {/* Satellite detail breakdown */}
            <div className="mt-5 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedSatellite.name}</h3>
                  <p className="text-xs text-purple-300 font-mono mt-0.5">
                    NORAD ID: {selectedSatellite.noradId} • Operator: {selectedSatellite.operator}
                  </p>
                </div>
                <button
                  onClick={() => onAskAstra && onAskAstra(`Tell me everything about the ${selectedSatellite.name} including its mission, scientific instruments, and orbital dynamics.`)}
                  className="px-3 py-1.5 rounded-lg bg-violet-600/80 hover:bg-violet-600 text-xs text-white font-medium flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Analyze with Astra</span>
                </button>
              </div>

              <p className="text-xs text-gray-300 mt-3 leading-relaxed">
                {selectedSatellite.missionObjective}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/10 text-xs">
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-mono">Altitude</div>
                  <div className="font-semibold text-white">{selectedSatellite.orbitAltitudeKm.toLocaleString()} km</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-mono">Velocity</div>
                  <div className="font-semibold text-white">{selectedSatellite.velocityKmS} km/s</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-mono">Period</div>
                  <div className="font-semibold text-white">{selectedSatellite.periodMinutes} min</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-mono">Launched</div>
                  <div className="font-semibold text-white">{selectedSatellite.launchYear}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Satellites Selection List (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <h3 className="text-xs font-mono tracking-wider uppercase text-purple-300 mb-1">
              Monitored Orbital Craft
            </h3>
            {SATELLITE_DATA.map((sat) => {
              const isSelected = selectedSatellite.id === sat.id;
              return (
                <div
                  key={sat.id}
                  onClick={() => setSelectedSatellite(sat)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-violet-950/40 border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      : 'bg-[#0A0B18] hover:bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-gray-400'}`}>
                        <Satellite className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">{sat.name}</h4>
                        <span className="text-[10px] text-gray-400 font-mono">{sat.type}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {sat.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400 font-mono mt-3 pt-3 border-t border-white/5">
                    <span>Altitude: {sat.orbitAltitudeKm.toLocaleString()} km</span>
                    <span className="text-cyan-400 font-bold">{sat.velocityKmS} km/s</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Planetary Explorer Tab */}
      {activeTab === 'planets' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Planet selector list */}
          <div className="lg:col-span-4 flex flex-col gap-2.5 max-h-[600px] overflow-y-auto pr-1">
            <h3 className="text-xs font-mono tracking-wider uppercase text-purple-300 mb-1">
              Planetary System Bodies
            </h3>
            {PLANET_DATA.map((p) => {
              const isSelected = selectedPlanet.name === p.name;
              return (
                <button
                  key={p.name}
                  onClick={() => setSelectedPlanet(p)}
                  className={`flex items-center justify-between p-3.5 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-violet-900/50 to-cyan-950/50 border-cyan-400 text-white shadow-lg'
                      : 'bg-[#0A0B18] hover:bg-white/5 border-white/10 text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-violet-400 to-cyan-300" />
                    <div>
                      <div className="font-semibold text-sm">{p.name}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{p.type} • {p.distanceFromSunAU} AU</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>
              );
            })}
          </div>

          {/* Planet Focus Detail Panel */}
          <div className="lg:col-span-8 rounded-2xl bg-[#0A0B18] border border-white/10 p-6 sm:p-8 flex flex-col shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-300">
                  {selectedPlanet.type} Planet
                </span>
                <h2 className="text-3xl font-extrabold text-white mt-1">{selectedPlanet.name}</h2>
              </div>
              <button
                onClick={() => onAskAstra && onAskAstra(`Detail the geology, atmosphere, and exploration history of ${selectedPlanet.name}.`)}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium flex items-center gap-2 transition-all shadow-md shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask Astra About {selectedPlanet.name}</span>
              </button>
            </div>

            {/* Planet Key Metrics Bento */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] font-mono text-gray-400 uppercase">Distance to Sun</span>
                <div className="text-lg font-bold text-cyan-300 mt-1">{selectedPlanet.distanceFromSunAU} AU</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] font-mono text-gray-400 uppercase">Radius</span>
                <div className="text-lg font-bold text-white mt-1">{selectedPlanet.radiusKm.toLocaleString()} km</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] font-mono text-gray-400 uppercase">Moons</span>
                <div className="text-lg font-bold text-purple-300 mt-1">{selectedPlanet.moonsCount}</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] font-mono text-gray-400 uppercase">Surface Temp</span>
                <div className="text-lg font-bold text-amber-300 mt-1">{selectedPlanet.surfaceTempC}</div>
              </div>
            </div>

            {/* Atmosphere & Key Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <h4 className="text-xs font-mono uppercase tracking-wider text-purple-300 mb-3 flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5" />
                  Atmospheric Composition
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPlanet.atmosphere.map((gas, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg bg-cyan-950/60 border border-cyan-800/80 text-cyan-200 text-xs font-mono">
                      {gas}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <h4 className="text-xs font-mono uppercase tracking-wider text-purple-300 mb-3 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Notable Physical Features
                </h4>
                <ul className="space-y-1.5 text-xs text-gray-300">
                  {selectedPlanet.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deep Space Missions Tab */}
      {activeTab === 'missions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SPACE_MISSIONS.map((mission) => (
            <div
              key={mission.id}
              className="p-6 rounded-2xl bg-[#0A0B18] border border-white/10 hover:border-violet-500/40 transition-all flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    {mission.agency}
                  </span>
                  <span className="text-xs font-mono text-cyan-400">{mission.status.toUpperCase()}</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-2">{mission.name}</h3>
                <div className="text-xs font-mono text-purple-300 mt-1">
                  Target: {mission.target} • Launch: {mission.launchDate}
                </div>
                <p className="text-xs text-gray-300 mt-4 leading-relaxed">
                  {mission.highlights}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-gray-400 font-mono">{mission.type}</span>
                <button
                  onClick={() => onAskAstra && onAskAstra(`Provide an in-depth mission profile for ${mission.name}, including scientific payload and milestone accomplishments.`)}
                  className="text-xs text-cyan-300 hover:text-white flex items-center gap-1 font-medium transition-colors"
                >
                  <span>Explore Mission</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cosmic Discoveries Timeline Tab */}
      {activeTab === 'discoveries' && (
        <div className="rounded-2xl bg-[#0A0B18] border border-white/10 p-6 sm:p-8 shadow-2xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-cyan-400" />
            Milestones in Astrophysics & Astronomical History
          </h3>

          <div className="relative pl-6 border-l-2 border-violet-500/30 space-y-8">
            {[
              { year: '1609 CE', title: 'Galileo’s Astronomical Telescope', desc: 'Galileo Galilei observes Jupiter’s four largest moons and lunar topography, overturning geocentric doctrine.' },
              { year: '1929 CE', title: 'Hubble Confirms Universe Expansion', desc: 'Edwin Hubble measures galactic redshift, revealing galaxies moving apart proportional to distance.' },
              { year: '1957 CE', title: 'Sputnik 1 First Artificial Satellite', desc: 'First human-made satellite orbits Earth in 96 minutes, opening the technological space age.' },
              { year: '1969 CE', title: 'Apollo 11 Crewed Lunar Landing', desc: 'First humans land on the Moon (Sea of Tranquility), returning 21.5 kilograms of pristine lunar samples.' },
              { year: '1990 CE', title: 'Hubble Space Telescope Deployed', desc: 'Revolutionary optical observatory outside atmospheric distortion captures 30+ years of celestial deep fields.' },
              { year: '2015 CE', title: 'LIGO Detects Gravitational Waves', desc: 'First direct observation of gravitational spacetime ripples from two merging black holes 1.3 billion light-years away.' },
              { year: '2019 CE', title: 'Event Horizon Telescope Black Hole Image', desc: 'First direct radio shadow image of supermassive black hole M87* rendered using global VLBI telescope arrays.' },
              { year: '2022 CE', title: 'James Webb Space Telescope Deep Field', desc: 'JWST delivers the deepest infrared survey of the early universe, detecting galaxies formed 300M years post-Big Bang.' }
            ].map((d, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#0A0B18] border-2 border-cyan-400 group-hover:scale-125 transition-transform" />
                <div className="text-xs font-mono text-cyan-400">{d.year}</div>
                <h4 className="text-sm font-semibold text-white mt-0.5">{d.title}</h4>
                <p className="text-xs text-gray-300 mt-1 max-w-2xl leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
