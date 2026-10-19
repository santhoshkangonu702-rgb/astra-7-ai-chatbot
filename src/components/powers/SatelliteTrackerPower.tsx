import React, { useState } from 'react';
import {
  Satellite,
  Globe2,
  Compass,
  Radio,
  Clock,
  ExternalLink,
  ArrowLeft,
  Sparkles,
  Rocket,
  Eye,
  RefreshCw
} from 'lucide-react';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

interface TrackedSpaceObject {
  id: string;
  name: string;
  type: 'Space Station' | 'Earth Observation' | 'Communications' | 'Astronomy Observatory' | 'Lunar Mission';
  currentStatus: string;
  orbitLocation: string;
  lastUpdate: string;
  source: string;
  altitudeKm: number;
  velocityKmh: number;
  coordinates: string;
}

const ORBITAL_OBJECTS: TrackedSpaceObject[] = [
  {
    id: 'iss',
    name: 'International Space Station (ISS)',
    type: 'Space Station',
    currentStatus: 'Operational • Crew of 7 onboard',
    orbitLocation: 'Low Earth Orbit (LEO) • 51.6° Inclination',
    lastUpdate: '2026-09-26 10:02 UTC',
    source: 'NASA / ESA Orbital Ephemeris Feed',
    altitudeKm: 418.4,
    velocityKmh: 27580,
    coordinates: '18.42° N, 74.85° E (Over South Asia)'
  },
  {
    id: 'bas',
    name: 'Bharatiya Antariksh Station (BAS-1 Core)',
    type: 'Space Station',
    currentStatus: 'Operational • Autonomous Telemetry & Solar Arrays Deployed',
    orbitLocation: 'Circular Low Earth Orbit • 400 km • 51.5° Inclination',
    lastUpdate: '2026-09-26 09:55 IST',
    source: 'ISRO ISTRAC Ground Station Network',
    altitudeKm: 402.1,
    velocityKmh: 27620,
    coordinates: '12.98° N, 80.20° E (Approaching Bay of Bengal)'
  },
  {
    id: 'jwst',
    name: 'James Webb Space Telescope (JWST)',
    type: 'Astronomy Observatory',
    currentStatus: 'Active Scientific Observation • Deep Field Cycle 5',
    orbitLocation: 'Sun-Earth Lagrange Point 2 (L2) Halo Orbit',
    lastUpdate: '2026-09-26 08:30 UTC',
    source: 'Space Telescope Science Institute (STScI)',
    altitudeKm: 1500000,
    velocityKmh: 1200,
    coordinates: 'Lagrange Point L2 (1.5 Million km anti-sunward)'
  },
  {
    id: 'chandrayaan-4',
    name: 'Chandrayaan-4 Lunar Sample Return Orbiter',
    type: 'Lunar Mission',
    currentStatus: 'Lunar Orbital Mapping • Rendezvous Test Complete',
    orbitLocation: 'Polar Lunar Orbit • 100 x 100 km',
    lastUpdate: '2026-09-26 07:12 IST',
    source: 'ISRO Deep Space Network (DSN Byalalu)',
    altitudeKm: 384400,
    velocityKmh: 5800,
    coordinates: 'Lunar South Pole Coordinates 85° S'
  },
  {
    id: 'sentinel-2c',
    name: 'Copernicus Sentinel-2C',
    type: 'Earth Observation',
    currentStatus: 'Active Multi-Spectral Surface Imaging',
    orbitLocation: 'Sun-Synchronous Polar Orbit (SSO) • 786 km',
    lastUpdate: '2026-09-26 09:14 UTC',
    source: 'European Space Agency (ESA) Copernicus Hub',
    altitudeKm: 786.0,
    velocityKmh: 26800,
    coordinates: '34.20° N, 118.15° W'
  }
];

interface SatelliteTrackerPowerProps {
  onBack?: () => void;
}

export const SatelliteTrackerPower: React.FC<SatelliteTrackerPowerProps> = ({ onBack }) => {
  const [selectedObj, setSelectedObj] = useState<TrackedSpaceObject>(ORBITAL_OBJECTS[0]);
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = ORBITAL_OBJECTS.filter((o) => {
    if (filterType !== 'all' && o.type !== filterType) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 text-slate-100 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-purple-500/15 border border-amber-500/25 backdrop-blur-md">
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
            <Satellite className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">ASTRA SATELLITE TRACKER</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                LIVE ORBITAL TELEMETRY
              </span>
            </div>
            <p className="text-xs text-slate-400">
              OBJECT → CURRENT STATUS → ORBIT/LOCATION → LAST UPDATE → SOURCE
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Tracked Objects List & Orbital Map Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Objects list */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
            Active Spacecraft Telemetry ({filtered.length})
          </div>
          <div className="space-y-2">
            {filtered.map((obj) => (
              <div
                key={obj.id}
                onClick={() => {
                  setSelectedObj(obj);
                  hapticAction();
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedObj.id === obj.id
                    ? 'bg-amber-500/15 border-amber-500/40 shadow-md'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-amber-300 font-bold">
                    {obj.type}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Live Tracking</span>
                  </span>
                </div>
                <div className="text-sm font-bold text-white">{obj.name}</div>
                <div className="text-[11px] text-slate-400 mt-1">{obj.currentStatus}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Required Display: OBJECT → CURRENT STATUS → ORBIT/LOCATION → LAST UPDATE → SOURCE */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-black/50 border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">SELECTED OBJECT</span>
                <h3 className="text-lg font-black text-white">{selectedObj.name}</h3>
              </div>
              <span className="text-xs font-mono text-amber-300 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
                {selectedObj.altitudeKm.toLocaleString()} km Altitude
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="font-mono text-[10px] text-amber-400 font-bold uppercase">CURRENT STATUS</span>
                <p className="text-slate-100 font-semibold">{selectedObj.currentStatus}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase">ORBIT / LOCATION</span>
                <p className="text-slate-200">{selectedObj.orbitLocation}</p>
                <p className="text-slate-400 text-[11px] font-mono">Current Ground Footprint: {selectedObj.coordinates}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="font-mono text-[10px] text-purple-400 font-bold uppercase">LAST UPDATE</span>
                  <p className="text-slate-200 font-mono text-[11px]">{selectedObj.lastUpdate}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase">SOURCE</span>
                  <p className="text-slate-200 font-semibold">{selectedObj.source}</p>
                </div>
              </div>
            </div>

            {/* Radar Simulation Canvas */}
            <div className="p-5 rounded-2xl bg-black/70 border border-amber-500/20 relative overflow-hidden flex flex-col items-center justify-center min-h-[160px]">
              <div className="w-24 h-24 rounded-full border border-amber-500/30 flex items-center justify-center relative animate-pulse">
                <div className="w-16 h-16 rounded-full border border-cyan-500/30 flex items-center justify-center">
                  <Globe2 className="w-8 h-8 text-amber-400" />
                </div>
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-3 text-center">
                Orbital Velocity: {selectedObj.velocityKmh.toLocaleString()} km/h • Tracking active
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
